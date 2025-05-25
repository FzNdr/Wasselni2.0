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

const RiderMap = () => {
  const [region, setRegion] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalStage, setModalStage] = useState('loading'); // 'loading', 'counter', 'final'
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [counterOffer, setCounterOffer] = useState(null);
  const locationInterval = useRef(null);

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
      if (locationInterval.current) clearInterval(locationInterval.current);
    };
  }, []);

  const updateRiderLocation = async ({ latitude, longitude }) => {
    try {
      const user_id = await AsyncStorage.getItem('user_id');
      if (!user_id) return console.warn('User ID missing in AsyncStorage');

      await fetch('http://10.0.2.2:8000/api/rider-locations/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, latitude, longitude }),
      });
    } catch (error) {
      console.error('Error sending rider location:', error);
    }
  };

  const fetchNearbyDrivers = async ({ latitude, longitude }) => {
    try {
      const response = await fetch('http://10.0.2.2:8000/api/driver-locations');
      const data = await response.json();
      const driverList = Array.isArray(data.driverLocations) ? data.driverLocations : [];

      const nearbyDrivers = driverList.filter(driver =>
        calculateDistance(
          latitude,
          longitude,
          parseFloat(driver.latitude),
          parseFloat(driver.longitude)
        ) <= 2
      );

      setDrivers(nearbyDrivers);
    } catch (error) {
      console.error('Error fetching nearby drivers:', error);
    }
  };

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

  const requestRide = driver => {
    setSelectedDriver(driver);
    setModalStage('loading');
    setCounterOffer(null);
    setModalVisible(true);

    setTimeout(() => {
      const responses = ['accept', 'deny', 'counter'];
      const choice = responses[Math.floor(Math.random() * responses.length)];

      if (choice === 'accept' || choice === 'deny') {
        setModalStage('final');
        setCounterOffer(null);
      } else {
        setModalStage('counter');
        setCounterOffer({
          amount: (Math.random() * 10 + 5).toFixed(2),
          currency: '$',
        });
      }
    }, 3000);
  };

  const resetModal = () => {
    setSelectedDriver(null);
    setCounterOffer(null);
    setModalStage('loading');
  };

  const onAcceptCounter = () => {
    setModalVisible(false);
    Alert.alert(
      'Counter Offer Accepted',
      `You accepted the counter offer of ${counterOffer.currency}${counterOffer.amount} from ${selectedDriver.name}.`
    );
    resetModal();
  };

  const onDenyCounter = () => {
    setModalVisible(false);
    Alert.alert('Counter Offer Denied', `You denied the counter offer from ${selectedDriver.name}.`);
    resetModal();
  };

  const onAccept = () => {
    setModalVisible(false);
    Alert.alert('Ride Accepted', `You accepted the ride from ${selectedDriver.name}.`);
    resetModal();
  };

  const onDeny = () => {
    setModalVisible(false);
    Alert.alert('Ride Denied', `You denied the ride from ${selectedDriver.name}.`);
    resetModal();
  };

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

      {/* Modal */}
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
                  Driver offers: {counterOffer.currency}
                  {counterOffer.amount}
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
  map: {
    flex: 2,
    margin: '2%',
    borderRadius: 15,
    overflow: 'hidden',
  },
  loadingContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    flex: 1,
    margin: '5%',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  info: { flex: 3 },
  button: {
    flex: 1,
    backgroundColor: '#007bff',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  acceptButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 8,
    minWidth: '40%',
    alignItems: 'center',
  },
  denyButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 8,
    minWidth: '40%',
    alignItems: 'center',
  },
});

export default RiderMap;
