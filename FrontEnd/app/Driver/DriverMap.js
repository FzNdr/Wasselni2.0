import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DriverMap = () => {
  const [region, setRegion] = useState(null);
  const [riders, setRiders] = useState([]);
  const [driverCoords, setDriverCoords] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required.');
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(coords);
      setDriverCoords(userLocation.coords);

      await updateDriverLocation(userLocation.coords);
      await fetchNearbyRiders(userLocation.coords);
    };

    fetchLocation();
  }, []);

  const updateDriverLocation = async ({ latitude, longitude }) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const phone_number = await AsyncStorage.getItem('userPhone'); // get from storage

      await fetch('http://10.0.2.2:8000/api/driver-locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          latitude,
          longitude,
          phone_number,
        }),
      });
    } catch (error) {
      console.error('Error updating driver location:', error);
    }
  };

  const fetchNearbyRiders = async ({ latitude, longitude }) => {
    try {
      const response = await fetch('http://10.0.2.2:8000/api/rider-locations');
      const data = await response.json();

      const nearby = data.filter((rider) => {
        const distance = getDistanceFromLatLonInKm(
          latitude,
          longitude,
          parseFloat(rider.latitude),
          parseFloat(rider.longitude)
        );
        return distance <= 2;
      });

      setRiders(nearby);
    } catch (error) {
      console.error('Error fetching riders:', error);
    }
  };

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleOfferRide = (rider) => {
    Alert.alert(
      'Offer Ride',
      `Are you sure you want to offer a ride to ${rider.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => console.log(`Ride offered to ${rider.name}`) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {region && (
        <MapView
          style={styles.map}
          region={region}
          showsUserLocation={true}
        >
          {riders.map((rider) => (
            <Marker
              key={rider.id}
              coordinate={{
                latitude: parseFloat(rider.latitude),
                longitude: parseFloat(rider.longitude),
              }}
              title={rider.name}
              description={`Pickup location`}
              pinColor="purple"
            />
          ))}
        </MapView>
      )}

      <View style={styles.tableContainer}>
        <Text style={styles.tableHeader}>Nearby Riders (within 2KM)</Text>
        <FlatList
          data={riders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <View style={styles.riderInfo}>
                <Text>Name: {item.name}</Text>
                <Text>Phone: {item.phone_number}</Text>
              </View>
              <TouchableOpacity
                style={styles.offerButton}
                onPress={() => handleOfferRide(item)}
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
    marginTop: '7%',
    margin: '2%',
    borderRadius: 15,
    overflow: 'hidden',
  },
  tableContainer: {
    flex: 1,
    padding: 10,
    margin: '5%',
    borderRadius: 15,
    backgroundColor: '#fff',
  },
  tableHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  riderInfo: { flex: 3 },
  offerButton: {
    flex: 1,
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default DriverMap;
