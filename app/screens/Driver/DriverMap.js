import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const DriverMap = () => {
  const [location, setLocation] = useState(null);
  const [riders, setRiders] = useState([]);

  // Mock data for riders
  const mockRiders = [
    {
      id: '1',
      name: 'Alice Johnson',
      phoneNumber: '123-456-7890',
      latitude: 37.78825,
      longitude: -122.4324,
    },
    {
      id: '2',
      name: 'Bob Williams',
      phoneNumber: '987-654-3210',
      latitude: 37.78925,
      longitude: -122.4334,
    },
  ];

  useEffect(() => {
    // Simulate fetching the driver's location
    setLocation({
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });

    // Simulate fetching riders' data
    setRiders(mockRiders);
  }, []);

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
      {/* Map Section */}
      <MapView
        style={styles.map}
        region={location}
        showsUserLocation={true}
      >
        {riders.map((rider) => (
          <Marker
            key={rider.id}
            coordinate={{
              latitude: rider.latitude,
              longitude: rider.longitude,
            }}
            title={rider.name}
            description={`Phone: ${rider.phoneNumber}`}
          />
        ))}
      </MapView>

      {/* Table Section */}
      <View style={styles.tableContainer}>
        <Text style={styles.tableHeader}>Nearby Riders</Text>
        <FlatList
          data={riders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <View style={styles.riderInfo}>
                <Text style={styles.tableCell}>Name: {item.name}</Text>
                <Text style={styles.tableCell}>Phone: {item.phoneNumber}</Text>
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