import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RiderMap = () => {
  const [region, setRegion] = useState(null);
  const [drivers, setDrivers] = useState([]);
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

      console.log('Sending rider location:', { user_id, latitude, longitude });
      const res = await fetch('http://10.0.2.2:8000/api/rider-locations/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, latitude, longitude }),
      });

      const text = await res.text();
      console.log('Rider-location API status:', res.status, text);
    } catch (err) {
      console.error('Error updating rider location:', err);
    }
  };

  const loadNearbyDrivers = async ({ latitude, longitude }) => {
    try {
      const res = await fetch('http://10.0.2.2:8000/api/driver-locations');
      const json = await res.json();
      console.log('Raw driver fetch response:', json);

      const list = Array.isArray(json.driverLocations) ? json.driverLocations : [];

      const nearby = list.filter(d =>
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
    Alert.alert('Request Ride', `Request a ride from ${driver.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', onPress: () => console.log(`Requested from ${driver.name}`) },
    ]);
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
              <TouchableOpacity
                style={styles.button}
                onPress={() => requestRide(item)}
              >
                <Text style={styles.buttonText}>Request Ride</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
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
});

export default RiderMap;
