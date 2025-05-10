import { Button, StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';

const DriverMap = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
      />
      <Button title="Start Ride" onPress={() => navigation.navigate('RideInProgress')} />
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

export default DriverMap;
