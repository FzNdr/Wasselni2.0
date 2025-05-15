import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';


const RiderMap = () => {
  const [region, setRegion] = useState(null);
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [drivers, setDrivers] = useState([]);

  const mockDrivers = [
    {
      id: '1',
      name: 'John Doe',
      carBrand: 'Toyota Corolla',
      availableSeats: 3,
      pricePerKm: 5,
      phoneNumber: '123-456-7890',
      rewardPoints: 50,
      latitude: 37.78825,
      longitude: -122.4324,
    },
    {
      id: '2',
      name: 'Jane Smith',
      carBrand: 'Honda Civic',
      availableSeats: 2,
      pricePerKm: 6,
      phoneNumber: '987-654-3210',
      rewardPoints: 60,
      latitude: 37.78925,
      longitude: -122.4334,
    },
  ];

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

      const address = await Location.reverseGeocodeAsync(userLocation.coords);
      if (address && address.length > 0) {
        const formatted = formatAddress(address[0]);
        setPickupAddress(formatted || 'Unknown Location');
      }
    };

    fetchLocation();
    setDrivers(mockDrivers);
  }, []);

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

    // Set drop-off coordinates
    setDropoffLocation({ latitude, longitude });

    // Reverse geocode to get address (optional, not used for validation anymore)
    const addressList = await Location.reverseGeocodeAsync({ latitude, longitude });

    if (addressList.length > 0) {
      const address = addressList[0];
      const formatted = formatAddress(address);
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
        {/* Dropoff Pin */}
        {dropoffLocation && (
          <Marker
            coordinate={dropoffLocation}
            title="Dropoff"
            description={dropoffAddress || 'Drop-off location'}
            pinColor="green"
          />
        )}

        {/* Mock driver pins */}
        {drivers.map((driver) => (
          <Marker
            key={driver.id}
            coordinate={{
              latitude: driver.latitude,
              longitude: driver.longitude,
            }}
            title={driver.name}
            description={`Car: ${driver.carBrand}, Seats: ${driver.availableSeats}`}
          />
        ))}
      </MapView>

      <View style={styles.tableContainer}>
        <Text style={styles.locationText}>📍 Pickup: {pickupAddress}</Text>
        <Text style={styles.locationText}>🎯 Drop-off: {dropoffAddress || 'Tap on the map to select.'}</Text>

        <Text style={styles.tableHeader}>Nearby Drivers</Text>
        <FlatList
          data={drivers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <View style={styles.driverInfo}>
                <Text>Name: {item.name}</Text>
                <Text>Car: {item.carBrand}</Text>
                <Text>Seats: {item.availableSeats}</Text>
                <Text>Price: ${item.pricePerKm}/km</Text>
                <Text>Phone: {item.phoneNumber}</Text>
                <Text>Points: {item.rewardPoints}</Text>
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
  container: {
    flex: 1,
  },
  map: {
    flex: 2,
    marginTop:'7%',
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
  driverInfo: {
    flex: 3,
  },
  requestButton: {
    flex: 1,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  locationText: {
    fontSize: 14,
    marginBottom: 5,
  },
});

export default RiderMap;
