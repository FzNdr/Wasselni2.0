import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
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
      const coordsRegion = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(coordsRegion);

      await sendRiderLocation(loc.coords);
      await loadNearbyDrivers(loc.coords);

      locationInterval.current = setInterval(async () => {
        try {
          const updatedLoc = await Location.getCurrentPositionAsync({});
          await sendRiderLocation(updatedLoc.coords);
          await loadNearbyDrivers(updatedLoc.coords);
        } catch (err) {
          console.error('Interval Location Error:', err);
        }
      }, 5000);
    })();

    return () => {
      if (locationInterval.current) {
        clearInterval(locationInterval.current);
      }
    };
  }, []);

  const sendRiderLocation = async ({ latitude, longitude }) => {
    try {
      const user_id = await AsyncStorage.getItem('user_id');
      if (!user_id) {
        console.warn('No user_id found in storage.');
        return;
      }
      await fetch('http://10.0.2.2:8000/api/rider-locations/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, latitude, longitude }),
      });
    } catch (err) {
      console.error('Error updating rider location:', err);
    }
  };

  const loadNearbyDrivers = async ({ latitude, longitude }) => {
    try {
      const res = await fetch('http://10.0.2.2:8000/api/driver-locations');
      const json = await res.json();

      const list = Array.isArray(json.driverLocations) ? json.driverLocations : [];
      const nearby = list.filter(
        d =>
          getDistance(latitude, longitude, parseFloat(d.latitude), parseFloat(d.longitude)) <= 2
      );
      setDrivers(nearby);
    } catch (err) {
      console.error('Error fetching drivers:', err);
    }
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = v => (v * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const requestRide = driver => {
    setSelectedDriver(driver);
    setModalStage('loading');
    setCounterOffer(null);
    setModalVisible(true);

    // Simulate driver response after 3 seconds:
    setTimeout(() => {
      // Randomly choose between accept, deny, or counter offer:
      const responses = ['accept', 'deny', 'counter'];
      const choice = responses[Math.floor(Math.random() * responses.length)];

      if (choice === 'accept') {
        setModalStage('final');
        setCounterOffer(null);
      } else if (choice === 'deny') {
        setModalStage('final');
        setCounterOffer(null);
      } else {
        // Counter offer example: driver offers a different fare
        setModalStage('counter');
        setCounterOffer({
          amount: (Math.random() * 10 + 5).toFixed(2), // random counter offer fare
          currency: '$',
        });
      }
    }, 3000);
  };

  const onAccept = () => {
    setModalVisible(false);
    Alert.alert('Ride Accepted', `You accepted the ride from ${selectedDriver.name}.`);
    setSelectedDriver(null);
    setCounterOffer(null);
  };

  const onDeny = () => {
    setModalVisible(false);
    Alert.alert('Ride Denied', `You denied the ride from ${selectedDriver.name}.`);
    setSelectedDriver(null);
    setCounterOffer(null);
  };

  const onAcceptCounter = () => {
    setModalVisible(false);
    Alert.alert(
      'Counter Offer Accepted',
      `You accepted the counter offer of ${counterOffer.currency}${counterOffer.amount} from ${selectedDriver.name}.`
    );
    setSelectedDriver(null);
    setCounterOffer(null);
  };

  const onDenyCounter = () => {
    setModalVisible(false);
    Alert.alert('Counter Offer Denied', `You denied the counter offer from ${selectedDriver.name}.`);
    setSelectedDriver(null);
    setCounterOffer(null);
  };

  return (
    <View style={styles.container}>
      {region && (
        <MapView style={styles.map} region={region} showsUserLocation>
          {drivers.map(d => (
            <Marker
              key={d.id}
              coordinate={{
                latitude: parseFloat(d.latitude),
                longitude: parseFloat(d.longitude),
              }}
              title={d.name}
              description="Driver Nearby"
              pinColor="blue"
            />
          ))}
        </MapView>
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

      {/* Modal for ride request */}
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
                <Text style={styles.modalTitle}>
                  Counter Offer from {selectedDriver?.name}
                </Text>
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
                <Text style={styles.modalTitle}>
                  {counterOffer
                    ? `Counter Offer ${counterOffer.currency}${counterOffer.amount}`
                    : 'Ride Request Result'}
                </Text>
                <Text style={styles.modalMessage}>
                  {/* Simulated response: */}
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
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  acceptButton: {
    backgroundColor: '#28a745',
    flex: 1,
    marginRight: 10,
    paddingVertical: 10,
    borderRadius: 7,
    alignItems: 'center',
  },
  denyButton: {
    backgroundColor: '#dc3545',
    flex: 1,
    marginLeft: 10,
    paddingVertical: 10,
    borderRadius: 7,
    alignItems: 'center',
  },
});

export default RiderMap;
