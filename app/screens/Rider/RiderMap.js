import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const RiderMap = () => {
  const [location, setLocation] = useState(null);
  const [drivers, setDrivers] = useState([]);

  // Mock data for drivers
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
    // Simulate fetching the rider's location
    setLocation({
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });

    // Simulate fetching drivers' data
    setDrivers(mockDrivers);
  }, []);

  const handleRequestRide = (driver) => {
    Alert.alert(
      'Request Ride',
      `Are you sure you want to request a ride from ${driver.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => console.log(`Ride requested from ${driver.name}`) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Map Section */}
      <MapView
        style={styles.map}
        region={location}
        showsUserLocation={true}
      >
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

      {/* Table Section */}
      <View style={styles.tableContainer}>
        <Text style={styles.tableHeader}>Nearby Drivers</Text>
        <FlatList
          data={drivers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <View style={styles.driverInfo}>
                <Text style={styles.tableCell}>Name: {item.name}</Text>
                <Text style={styles.tableCell}>Car: {item.carBrand}</Text>
                <Text style={styles.tableCell}>Seats: {item.availableSeats}</Text>
                <Text style={styles.tableCell}>Price: ${item.pricePerKm}/km</Text>
                <Text style={styles.tableCell}>Phone: {item.phoneNumber}</Text>
                <Text style={styles.tableCell}>Points: {item.rewardPoints}</Text>
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
  },
  tableContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
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
  driverInfo: {
    flex: 3,
  },
  tableCell: {
    fontSize: 14,
    marginBottom: 5,
  },
  requestButton: {
    flex: 1,
    backgroundColor: '#007BFF',
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

export default RiderMap;