import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
const RiderMap = () => {
  const [region, setRegion] = useState(null);
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [riderCoords, setRiderCoords] = useState(null);

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
      setRiderCoords(userLocation.coords);

      const address = await Location.reverseGeocodeAsync(userLocation.coords);
      if (address && address.length > 0) {
        const formatted = formatAddress(address[0]);
        setPickupAddress(formatted || 'Unknown Location');
      }

      await updateRiderLocation(userLocation.coords);
      await fetchNearbyDrivers(userLocation.coords);
    };

    fetchLocation();
  }, []);

  const updateRiderLocation = async ({ latitude, longitude }) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const phone_number = await AsyncStorage.getItem('userPhone');

    await fetch('http://10.0.2.2:8000/api/rider-locations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ latitude, longitude, phone_number }),
    });
  } catch (error) {
    console.error('Error updating rider location:', error);
  }
};


  const fetchNearbyDrivers = async ({ latitude, longitude }) => {
  try {

    const token = await AsyncStorage.getItem('userToken');
const response = await fetch('http://10.0.2.2:8000/api/driver-locations', {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`, 
  },
});


    const text = await response.text();

    try {
      const data = JSON.parse(text);

      const nearby = data.filter((driver) => {
        const distance = getDistanceFromLatLonInKm(
          latitude,
          longitude,
          parseFloat(driver.latitude),
          parseFloat(driver.longitude)
        );
        return distance <= 2;
      });

      setDrivers(nearby);
    } catch (jsonError) {
      console.error('Failed to parse driver response as JSON:', text);
    }
  } catch (error) {
    console.error('Error fetching drivers:', error.message);
  }
};

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Earth radius in KM
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const formatAddress = (address) => {
    if (!address) return '';
    const parts = [address.name, address.street, address.city].filter(
      (part) =>
        part &&
        typeof part === 'string' &&
        !part.startsWith('RG') &&
        part.toLowerCase() !== 'null'
    );
    return parts.join(', ');
  };

  const handleMapPress = async (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setDropoffLocation({ latitude, longitude });

    const addressList = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (addressList.length > 0) {
      const formatted = formatAddress(addressList[0]);
      setDropoffAddress(formatted || 'Unknown Location');
    }
  };

  const handleRequestRide = (driver) => {
    if (!dropoffAddress) {
      Alert.alert('Select Destination', 'Please tap on the map to select your drop-off location.');
      return;
    }

    Alert.alert(
      'Request Ride',
      `Confirm ride from:\nPickup: ${pickupAddress}\nDrop-off: ${dropoffAddress}\nDriver: ${driver.name}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => console.log(`Ride requested from ${driver.name}`) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
        onPress={handleMapPress}
      >
        {dropoffLocation && (
          <Marker
            coordinate={dropoffLocation}
            title="Dropoff"
            description={dropoffAddress || 'Drop-off location'}
            pinColor="green"
          />
        )}

        {drivers.map((driver) => (
          <Marker
            key={driver.id}
            coordinate={{
              latitude: parseFloat(driver.latitude),
              longitude: parseFloat(driver.longitude),
            }}
            title={driver.name}
            description={`Car: ${driver.car_brand}, Seats: ${driver.available_seats}`}
            pinColor="blue"
          />
        ))}
      </MapView>

      <View style={styles.tableContainer}>
        <Text style={styles.locationText}>📍 Pickup: {pickupAddress}</Text>
        <Text style={styles.locationText}>🎯 Drop-off: {dropoffAddress || 'Tap on the map to select.'}</Text>

        <Text style={styles.tableHeader}>Nearby Drivers (within 2KM)</Text>
        <FlatList
          data={drivers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <View style={styles.driverInfo}>
                <Text>Name: {item.name}</Text>
                <Text>Car: {item.car_brand}</Text>
                <Text>Seats: {item.available_seats}</Text>
                <Text>Price: ${item.price_per_km}/km</Text>
                <Text>Phone: {item.phone_number}</Text>
                <Text>Points: {item.reward_points}</Text>
              </View>
              <TouchableOpacity
                style={styles.requestButton}
                onPress={() => handleRequestRide(item)}
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
  driverInfo: { flex: 3 },
  requestButton: {
    flex: 1,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  locationText: { fontSize: 14, marginBottom: 5 },
});

export default RiderMap;
