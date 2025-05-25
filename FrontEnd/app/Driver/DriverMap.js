import * as Location from 'expo-location';
import React, { useEffect, useState, useRef } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const API_BASE = 'http://10.0.2.2:8000/api';

const DriverMap = () => {
  const router = useRouter();

  const [region, setRegion] = useState(null);
  const [riders, setRiders] = useState([]);
  const [rideRequestsQueue, setRideRequestsQueue] = useState([]); // queue of incoming ride requests
  const [currentRequest, setCurrentRequest] = useState(null); // current ride request
  const [counterFare, setCounterFare] = useState('');
  const [loadingAction, setLoadingAction] = useState(false);

  const userIdRef = useRef(null);
  const intervalLocationRef = useRef(null);
  const intervalRequestsRef = useRef(null);

  useEffect(() => {
    (async () => {
      const user_id = await AsyncStorage.getItem('user_id');
      if (!user_id) {
        console.warn('No user_id found in storage — redirecting to login.');
        return;
      }
      userIdRef.current = user_id;

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required.');
        return;
      }

      // Initial location fetch and send
      const loc = await Location.getCurrentPositionAsync({});
      const coordsRegion = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(coordsRegion);
      await sendDriverLocation(loc.coords, user_id);
      await loadNearbyRiders(loc.coords);

      //  location update every 5 seconds
      intervalLocationRef.current = setInterval(async () => {
        try {
          const loc = await Location.getCurrentPositionAsync({});
          setRegion({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
          await sendDriverLocation(loc.coords, user_id);
          await loadNearbyRiders(loc.coords);
        } catch (e) {
          console.error('Interval location fetch error:', e);
        }
      }, 5000);

      //  ride requests fetching  every 5 seconds
      intervalRequestsRef.current = setInterval(async () => {
        await fetchIncomingRideRequests(user_id);
      }, 5000);

      //  fetch immediately on entering page
      await fetchIncomingRideRequests(user_id);
    })();

    // Cleanup intervals on unmount
    return () => {
      if (intervalLocationRef.current) clearInterval(intervalLocationRef.current);
      if (intervalRequestsRef.current) clearInterval(intervalRequestsRef.current);
    };
  }, []);

  // Send driver location to backend
  const sendDriverLocation = async ({ latitude, longitude }, user_id) => {
    try {
      const response = await fetch(`${API_BASE}/driver-locations/store`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ user_id, latitude, longitude }),
      });
      const json = await response.json();
      if (!response.ok) {
        console.error('Driver-location API error:', json);
      }
    } catch (error) {
      console.error('Error updating driver location:', error);
    }
  };

  // Load nearby riders within 2 km
  const loadNearbyRiders = async ({ latitude, longitude }) => {
    try {
      const response = await fetch(`${API_BASE}/rider-locations`, {
        headers: { Accept: 'application/json' },
      });
      const data = await response.json();

      if (data.success && Array.isArray(data.riderLocations)) {
        const nearby = data.riderLocations.filter(r =>
          getDistance(
            latitude,
            longitude,
            parseFloat(r.latitude),
            parseFloat(r.longitude)
          ) <= 2
        );
        setRiders(nearby);
      } else {
        setRiders([]);
      }
    } catch (err) {
      console.error('Error fetching riders:', err);
    }
  };

  // Calculate distance between two locations in km 
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = v => (v * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  // get incoming ride requests for driver + add to queue
  const fetchIncomingRideRequests = async (driver_id) => {
    try {
      const response = await fetch(`${API_BASE}/ride-requests/incoming?driver_id=${driver_id}`, {
        headers: { Accept: 'application/json' },
      });
      const data = await response.json();

      if (data.success && Array.isArray(data.requests)) {
        // Filter out requests already shown or in queue by id
        const newRequests = data.requests.filter(
          r => !rideRequestsQueue.some(q => q.id === r.id) && (currentRequest ? currentRequest.id !== r.id : true)
        );
        if (newRequests.length > 0) {
          setRideRequestsQueue(prev => [...prev, ...newRequests]);
          // If no modal currently open, show the first
          if (!currentRequest) {
            setCurrentRequest(newRequests[0]);
            setRideRequestsQueue(prev => prev.slice(1));
            setCounterFare('');
          }
        }
      }
    } catch (err) {
      console.error('Error fetching incoming ride requests:', err);
    }
  };

  // Move to next ride request in queue or close modal if none
  const processNextRequest = () => {
    if (rideRequestsQueue.length > 0) {
      setCurrentRequest(rideRequestsQueue[0]);
      setRideRequestsQueue(prev => prev.slice(1));
      setCounterFare('');
    } else {
      setCurrentRequest(null);
      setCounterFare('');
    }
  };

  // Accept current ride request
  const acceptRide = async () => {
    if (!currentRequest) return;
    setLoadingAction(true);
    try {
      const response = await fetch(`${API_BASE}/ride-requests/${currentRequest.id}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ driver_id: userIdRef.current }),
      });
      const json = await response.json();
      if (json.success) {
        router.push('Driver/DriverRideInProgress');
        Alert.alert('Success', 'Ride accepted.');
        processNextRequest();
      } else {
        Alert.alert('Error', json.message || 'Failed to accept ride.');
      }
    } catch (err) {
      Alert.alert('Error', 'Network error during accept.');
      console.error(err);
    }
    setLoadingAction(false);
  };

  // Deny current ride request
  const denyRide = async () => {
    if (!currentRequest) return;
    setLoadingAction(true);
    try {
      const response = await fetch(`${API_BASE}/ride-requests/${currentRequest.id}/deny`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
      });
      const json = await response.json();
      if (!json.error) {
        Alert.alert('Success', 'Ride denied.');
        processNextRequest();
      } else {
        Alert.alert('Error', json.error || 'Failed to deny ride.');
      }
    } catch (err) {
      Alert.alert('Error', 'Network error during deny.');
      console.error(err);
    }
    setLoadingAction(false);
  };

  // Send counter offer for current ride request
  const sendCounterOffer = async () => {
    if (!currentRequest) return;

    const counterFareNum = parseFloat(counterFare);
    if (isNaN(counterFareNum) || counterFareNum <= 0) {
      Alert.alert('Invalid Fare', 'Please enter a valid counter fare (positive number).');
      return;
    }

    setLoadingAction(true);
    try {
      const response = await fetch(`${API_BASE}/ride-requests/${currentRequest.id}/counter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ride_id: currentRequest.id, counter_fare: counterFareNum }),
      });
      const json = await response.json();
      if (json.success) {
        Alert.alert('Success', 'Counter offer sent.');
        processNextRequest();
      } else {
        Alert.alert('Error', json.message || 'Failed to send counter offer.');
      }
    } catch (err) {
      Alert.alert('Error', 'Network error during counter offer.');
      console.error(err);
    }
    setLoadingAction(false);
  };

  if (!region) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region} showsUserLocation={true}>
        {riders.map(rider => (
          <Marker
            key={rider.id}
            coordinate={{
              latitude: parseFloat(rider.latitude),
              longitude: parseFloat(rider.longitude),
            }}
            title={`Rider ID: ${rider.id}`}
            description={`Location: (${rider.latitude}, ${rider.longitude})`}
            pinColor="blue"
          />
        ))}
      </MapView>

      {/* Modal for current ride request */}
      <Modal visible={!!currentRequest} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Ride Request</Text>

            {currentRequest && (
              <>
                <Text>Rider ID: {currentRequest.rider_id}</Text>
                <Text>
                  Pickup: {currentRequest.pickup_address
                    ? currentRequest.pickup_address
                    : `${currentRequest.pickup_latitude}, ${currentRequest.pickup_longitude}`}
                </Text>
                <Text>
                  Dropoff: {currentRequest.dropoff_address
                    ? currentRequest.dropoff_address
                    : `${currentRequest.dropoff_latitude}, ${currentRequest.dropoff_longitude}`}
                </Text>
                <Text>Requested Fare: ${currentRequest.fare}</Text>

                <TextInput
                  placeholder="Enter Counter Offer Fare"
                  keyboardType="numeric"
                  style={styles.input}
                  value={counterFare}
                  onChangeText={setCounterFare}
                  editable={!loadingAction}
                />

                <View style={styles.buttonsRow}>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: 'green' }]}
                    onPress={acceptRide}
                    disabled={loadingAction}
                  >
                    <Text style={styles.buttonText}>Accept</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: 'orange' }]}
                    onPress={sendCounterOffer}
                    disabled={loadingAction}
                  >
                    <Text style={styles.buttonText}>Counter Offer</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: 'red' }]}
                    onPress={denyRide}
                    disabled={loadingAction}
                  >
                    <Text style={styles.buttonText}>Deny</Text>
                  </TouchableOpacity>
                </View>

                {loadingAction && <ActivityIndicator style={{ marginTop: 10 }} />}
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    marginTop: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 10,
    height: 40,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
export default DriverMap;
