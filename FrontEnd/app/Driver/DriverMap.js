import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

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

      // Update driver location in DB
      await updateDriverLocation(userLocation.coords);

      // Fetch nearby riders
      await fetchNearbyRiders(userLocation.coords);
    };

    fetchLocation();
  }, []);

  const updateDriverLocation = async ({ latitude, longitude }) => {
    try {
      await fetch('http://10.0.2.2:8000/api/driver-locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude,
          longitude,
          phone_number: '987-654-3210', // Replace with actual driver phone from auth
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
      setRiders(data);
    } catch (error) {
      console.error('Error fetching riders:', error);
    }
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
            description={`Phone: ${rider.phone_number}`}
            pinColor="red"
          />
        ))}
      </MapView>

      <View style={styles.tableContainer}>
        <Text style={styles.tableHeader}>Nearby Riders</Text>
        <FlatList
          data={riders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <View style={styles.riderInfo}>
                <Text style={styles.tableCell}>Name: {item.name}</Text>
                <Text style={styles.tableCell}>Phone: {item.phone_number}</Text>
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
    marginTop: '5%',
    margin: '2%',
    borderRadius: 15,
    overflow: 'hidden',
  },
  tableContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    margin: '5%',
    borderRadius: 15,
  },
  tableHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  riderInfo: {
    flex: 3,
  },
  tableCell: {
    fontSize: 14,
    marginBottom: 5,
  },
  offerButton: {
    flex: 1,
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DriverMap;
