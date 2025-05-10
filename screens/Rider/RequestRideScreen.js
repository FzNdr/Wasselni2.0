import { useContext, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
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
      <Text style={styles.header}>Request a Ride</Text>
      <TextInput
        style={styles.input}
        placeholder="Pickup Location"
        value={pickup}
        onChangeText={setPickup}
      />
      <TextInput
        style={styles.input}
        placeholder="Dropoff Location"
        value={dropoff}
        onChangeText={setDropoff}
      />
      <Button title="Request Ride" onPress={requestRide} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default RequestRideScreen;
