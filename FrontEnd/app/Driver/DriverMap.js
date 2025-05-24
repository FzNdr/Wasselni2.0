import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DriverMap = () => {
  const [region, setRegion] = useState(null);
  const [riders, setRiders] = useState([]);

  useEffect(() => {
    let intervalId;

    (async () => {
      const user_id = await AsyncStorage.getItem('user_id');
      if (!user_id) {
        console.warn('No user_id found in storage — redirecting to login.');
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required.');
        return;
      }

      // Send initial location
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

      // Start interval to update every 5 seconds
      intervalId = setInterval(async () => {
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
    })();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const sendDriverLocation = async ({ latitude, longitude }, user_id) => {
    try {
      console.log('Sending driver location:', { user_id, latitude, longitude });

      const response = await fetch(
        'http://10.0.2.2:8000/api/driver-locations/store',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ user_id, latitude, longitude }),
        }
      );

      const json = await response.json();
      if (!response.ok) {
        console.error('Driver-location API error:', json);
      } else {
        console.log('Driver-location API success:', json);
      }
    } catch (error) {
      console.error('Error updating driver location:', error);
    }
  };

  const loadNearbyRiders = async ({ latitude, longitude }) => {
    try {
      const response = await fetch('http://10.0.2.2:8000/api/rider-locations', {
        headers: { 'Accept': 'application/json' }
      });
      const list = await response.json();
      console.log('Rider fetch response:', list);

      const nearby = Array.isArray(list)
        ? list.filter(r =>
            getDistance(
              latitude,
              longitude,
              parseFloat(r.latitude),
              parseFloat(r.longitude)
            ) <= 2
          )
        : [];

      setRiders(nearby);
    } catch (err) {
      console.error('Error fetching riders:', err);
    }
  };

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

  const offerRide = rider => {
    Alert.alert(
      'Offer Ride',
      `Offer a ride to ${rider.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => console.log(`Offered to ${rider.name}`) }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {region && (
        <MapView style={styles.map} region={region} showsUserLocation>
          {riders.map(r => (
            <Marker
              key={r.id}
              coordinate={{
                latitude: parseFloat(r.latitude),
                longitude: parseFloat(r.longitude),
              }}
              title={r.name}
              description="Pickup"
              pinColor="purple"
            />
          ))}
        </MapView>
      )}

      <View style={styles.listContainer}>
        <Text style={styles.header}>Nearby Riders (within 2 km)</Text>
        <FlatList
          data={riders}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={<Text>No riders nearby.</Text>}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.info}>
                <Text>Name: {item.name}</Text>
                <Text>Phone: {item.phone_number}</Text>
              </View>
              <TouchableOpacity
                style={styles.button}
                onPress={() => offerRide(item)}
              >
                <Text style={styles.buttonText}>Offer Ride</Text>
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
    backgroundColor: '#28a745',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default DriverMap;
