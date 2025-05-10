import { useContext, useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
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

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setDriverPosition((prev) => ({
        latitude: prev.latitude + 0.0001,
        longitude: prev.longitude + 0.0001,
      }));
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, []);

  const completeRide = () => {
    setRideStatus('completed');
    navigation.navigate('DriverMap');
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={driverPosition}>
        <Marker coordinate={driverPosition} />
        <Marker coordinate={destination} />
      </MapView>
      <Button title="Complete Ride" onPress={completeRide} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default RideInProgress;
