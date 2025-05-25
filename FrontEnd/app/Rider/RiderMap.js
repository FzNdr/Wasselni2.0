import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'http://10.0.2.2:8000/api';

const RiderMap = () => {
  const [region, setRegion] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalStage, setModalStage] = useState('loading'); // 'loading', 'counter', 'final'
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [counterOffer, setCounterOffer] = useState(null);
  const [rideRequestId, setRideRequestId] = useState(null);

  const locationInterval = useRef(null);
  const responseInterval = useRef(null);

  // INITIALIZE LOCATION & FETCH DRIVERS
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required.');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const initialRegion = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(initialRegion);

      await updateRiderLocation(loc.coords);
      await fetchNearbyDrivers(loc.coords);

      locationInterval.current = setInterval(async () => {
        try {
          const updatedLoc = await Location.getCurrentPositionAsync({});
          await updateRiderLocation(updatedLoc.coords);
          await fetchNearbyDrivers(updatedLoc.coords);
        } catch (error) {
          console.error('Location update error:', error);
        }
      }, 5000);
    })();

    return () => {
      clearInterval(locationInterval.current);
    };
  }, []);

  // UPDATE RIDER LOCATION TO BACKEND
  const updateRiderLocation = async ({ latitude, longitude }) => {
    try {
      const user_id = await AsyncStorage.getItem('user_id');
      if (!user_id) return;

      await fetch(`${API_BASE}/rider-locations/store`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, latitude, longitude }),
      });
    } catch (error) {
      console.error('Error sending rider location:', error);
    }
  };

  // FETCH DRIVERS FROM BACKEND & FILTER BY DISTANCE
  const fetchNearbyDrivers = async ({ latitude, longitude }) => {
    try {
      const response = await fetch(`${API_BASE}/driver-locations`);
      const data = await response.json();
      const list = Array.isArray(data.driverLocations) ? data.driverLocations : [];
      const nearby = list.filter(d =>
        calculateDistance(
          latitude,
          longitude,
          parseFloat(d.latitude),
          parseFloat(d.longitude)
        ) <= 2
      );
      setDrivers(nearby);
    } catch (error) {
      console.error('Error fetching nearby drivers:', error);
    }
  };

  // DISTANCE CALCULATION (KM)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = val => (val * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // REQUEST RIDE: POST + START POLLING
  const requestRide = async (driver) => {
    setSelectedDriver(driver);
    setModalStage('loading');
    setCounterOffer(null);
    setModalVisible(true);

    try {
      const rider_id = await AsyncStorage.getItem('user_id');
      const res = await fetch(`${API_BASE}/ride-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          rider_id,
          driver_id: driver.id,
          pickup_latitude: region.latitude,
          pickup_longitude: region.longitude,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setRideRequestId(json.data.id);
        responseInterval.current = setInterval(() => {
          fetchIncomingRideResponses(rider_id, json.data.id);
        }, 3000);
      } else {
        Alert.alert('Error', json.message || 'Failed to request ride.');
        setModalVisible(false);
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Network Error', 'Could not send ride request.');
      setModalVisible(false);
    }
  };

  // POLL FOR DRIVER RESPONSE
  const fetchIncomingRideResponses = async (rider_id, request_id) => {
    try {
      const resp = await fetch(
        `${API_BASE}/ride-requests/incoming?rider_id=${rider_id}`
      );
      const data = await resp.json();
      if (data.success && Array.isArray(data.requests)) {
        const match = data.requests.find(r => r.id === request_id);
        if (!match) return;

        if (match.status === 'accepted' || match.status === 'denied') {
          clearInterval(responseInterval.current);
          setModalStage('final');
        } else if (match.status === 'countered') {
          clearInterval(responseInterval.current);
          setCounterOffer({ amount: match.counter_fare.toFixed(2), currency: '$' });
          setModalStage('counter');
        }
      }
    } catch (err) {
      console.error('Error polling ride response:', err);
    }
  };

  // CLEAN UP WHEN MODAL CLOSES
  useEffect(() => {
    if (!modalVisible) {
      clearInterval(responseInterval.current);
      setRideRequestId(null);
      resetModal();
    }
  }, [modalVisible]);

  const resetModal = () => {
    setSelectedDriver(null);
    setCounterOffer(null);
    setModalStage('loading');
  };

  // HANDLERS
  const onAcceptCounter = () => {
    setModalVisible(false);
    Alert.alert(
      'Counter Offer Accepted',
      `You accepted the counter offer of ${counterOffer.currency}${counterOffer.amount} from ${selectedDriver.name}.`
    );
  };

  const onDenyCounter = () => {
    setModalVisible(false);
    Alert.alert('Counter Offer Denied', `You denied the counter offer from ${selectedDriver.name}.`);
  };

  const onAccept = () => {
    setModalVisible(false);
    Alert.alert('Ride Accepted', `You accepted the ride from ${selectedDriver.name}.`);
  };

  const onDeny = () => {
    setModalVisible(false);
    Alert.alert('Ride Denied', `You denied the ride from ${selectedDriver.name}.`);
  };

  // RENDER
  return (
    <View style={styles.container}>
      {region ? (
        <MapView style={styles.map} region={region} showsUserLocation>
          {drivers.map(driver => (
            <Marker
              key={driver.id.toString()}
              coordinate={{
                latitude: parseFloat(driver.latitude),
                longitude: parseFloat(driver.longitude),
              }}
              title={driver.name}
              description="Driver Nearby"
              pinColor="blue"
            />
          ))}
        </MapView>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text>Loading map...</Text>
        </View>
      )}

      <View style={styles.listContainer}>
        <Text style={styles.header}>Nearby Drivers (within 2km)</Text>
        <FlatList
          data={drivers}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={<Text>No drivers nearby.</Text>}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.info}>
                <Text>Name: {item.name}</Text>
                <Text>Phone: {item.phone_number}</Text>
              </View>
              <TouchableOpacity style={styles.button} onPress={() => requestRide(item)}>
                <Text style={styles.buttonText}>Request Ride</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {modalStage === 'loading' && (
              <>
                <Text style={styles.modalTitle}>
                  Requesting ride from {selectedDriver?.name}...
                </Text>
                <ActivityIndicator size="large" color="#007bff" />
              </>
            )}
            {modalStage === 'counter' && counterOffer && (
              <>
                <Text style={styles.modalTitle}>Counter Offer from {selectedDriver?.name}</Text>
                <Text style={styles.modalMessage}>
                  Driver offers: {counterOffer.currency}{counterOffer.amount}
                </Text>
                <View style={styles.modalButtonsRow}>
                  <TouchableOpacity style={styles.acceptButton} onPress={onAcceptCounter}>
                    <Text style={styles.buttonText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.denyButton} onPress={onDenyCounter}>
                    <Text style={styles.buttonText}>Deny</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
            {modalStage === 'final' && (
              <>
                <Text style={styles.modalTitle}>Ride Request Result</Text>
                <Text style={styles.modalMessage}>
                  {Math.random() > 0.5
                    ? `Ride accepted by ${selectedDriver?.name}`
                    : `Ride denied by ${selectedDriver?.name}`}
                </Text>
                <TouchableOpacity
                  style={[styles.denyButton, { alignSelf: 'center', marginTop: 10 }]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 2, margin: '2%', borderRadius: 15, overflow: 'hidden' },
  loadingContainer: { flex: 2, justifyContent: 'center', alignItems: 'center' },
  listContainer: { flex: 1, margin: '5%', padding: 10, backgroundColor: '#fff', borderRadius: 15 },
  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  info: { flex: 3 },
  button: { flex: 1, backgroundColor: '#007bff', borderRadius: 5, justifyContent: 'center', alignItems: 'center', padding: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  modalBackground: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '85%', padding: 20, backgroundColor: '#fff', borderRadius: 15, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  modalMessage: { fontSize: 16, marginVertical: 10, textAlign: 'center' },
  modalButtonsRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  acceptButton: { backgroundColor: 'green', padding: 10, borderRadius: 8, minWidth: '40%', alignItems: 'center' },
  denyButton: { backgroundColor: 'red', padding: 10, borderRadius: 8, minWidth: '40%', alignItems: 'center' },
});

export default RiderMap;
