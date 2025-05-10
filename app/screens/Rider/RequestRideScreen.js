import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { AppContext } from '../../context/AppContext';

const RequestRideScreen = ({ navigation }) => {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const {
    setRideStatus,
    setPickupLocation,
    setDropoffLocation,
  } = useContext(AppContext);

  const requestRide = () => {
    if (pickup && dropoff) {
      setPickupLocation(pickup);
      setDropoffLocation(dropoff);
      setRideStatus('requested');
      navigation.navigate('DriverMap');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Pickup Location</Text>
      <TextInput style={styles.input} value={pickup} onChangeText={setPickup} />
      <Text style={styles.label}>Drop-off Location</Text>
      <TextInput style={styles.input} value={dropoff} onChangeText={setDropoff} />
      <Button title="Request Ride" onPress={requestRide} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontWeight: 'bold', marginTop: 15 },
  input: { borderWidth: 1, padding: 10, borderRadius: 6, marginTop: 5 },
});

export default RequestRideScreen;