import { useContext, useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { AppContext } from '../../context/AppContext';

const RideInProgress = ({ navigation }) => {
  const { dropoffLocation, rideStatus, setRideStatus } = useContext(AppContext);

  const [driverPosition, setDriverPosition] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });

  const intervalRef = useRef(null);

  const destination = {
    latitude: 37.79025,
    longitude: -122.4354,
    ...dropoffLocation, // if you use real drop-off data from context
  };

  // Helper: calculate next position
  const moveDriverTowardDestination = () => {
    const deltaLat = (destination.latitude - driverPosition.latitude) * 0.01;
    const deltaLng = (destination.longitude - driverPosition.longitude) * 0.01;

    setDriverPosition((prev) => ({
      latitude: prev.latitude + deltaLat,
      longitude: prev.longitude + deltaLng,
    }));

    // Stop if very close to destination
    const distance = Math.hypot(
      destination.latitude - driverPosition.latitude,
      destination.longitude - driverPosition.longitude
    );
    if (distance < 0.0002) {
      clearInterval(intervalRef.current);
      setRideStatus('completed');
    }
  };

  useEffect(() => {
    intervalRef.current = setInterval(moveDriverTowardDestination, 500);
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          ...driverPosition,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
      >
        <Marker coordinate={driverPosition} title="Driver" pinColor="green" />
        <Marker coordinate={destination} title="Drop-off" pinColor="blue" />
      </MapView>
      <View style={styles.footer}>
        <Text style={styles.status}>Ride Status: {rideStatus}</Text>
        <Button title="End Ride" onPress={() => navigation.navigate('Home')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  footer: { padding: 20, backgroundColor: '#fff' },
  status: { fontSize: 18, marginBottom: 10 },
});

export default RideInProgress;
