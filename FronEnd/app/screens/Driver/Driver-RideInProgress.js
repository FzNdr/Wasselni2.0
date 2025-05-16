import React, { useEffect, useState, useRef } from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  CheckBox,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Rating } from 'react-native-ratings';

const DriverRideInProgress = ({ route, navigation }) => {
  const {
    riderLocation,
    driverLocation,
    rideId,
    paymentMethod,
  } = route.params;

  const [region, setRegion] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [rideCompleted, setRideCompleted] = useState(true);
  const [loading, setLoading] = useState(false);

  const ws = useRef(null);

  useEffect(() => {
    if (riderLocation && driverLocation) {
      const midLat = (riderLocation.latitude + driverLocation.latitude) / 2;
      const midLng = (riderLocation.longitude + driverLocation.longitude) / 2;
      setRegion({
        latitude: midLat,
        longitude: midLng,
        latitudeDelta: Math.abs(riderLocation.latitude - driverLocation.latitude) * 2.5 || 0.01,
        longitudeDelta: Math.abs(riderLocation.longitude - driverLocation.longitude) * 2.5 || 0.01,
      });
    }
  }, [riderLocation, driverLocation]);

  useEffect(() => {
    ws.current = new WebSocket('ws://your-ws-server-address:port');

    ws.current.onopen = () => {
      console.log('WS connected (Driver)');
      ws.current.send(JSON.stringify({
        type: 'join_ride',
        rideId,
        userType: 'driver',
      }));
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('WS message (Driver):', message);

      if (message.type === 'ride_status_update') {
        if (message.status === 'ride_cancelled') {
          Alert.alert('Update', 'Ride was cancelled by rider');
          navigation.goBack();
        }
      }
    };

    ws.current.onerror = (error) => {
      console.error('WS error (Driver):', error.message);
    };

    ws.current.onclose = () => {
      console.log('WS disconnected (Driver)');
    };

    return () => {
      ws.current.close();
    };
  }, []);

  const sendStatusUpdate = (status) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'ride_status_update',
        rideId,
        status,
      }));
    }
  };

  const submitFeedback = async () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please rate the rider before submitting.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('https://yourapi.com/api/rides/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ride_id: rideId,
          user_type: 'driver',
          rating,
          feedback,
          ride_completed: rideCompleted,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Thank You', 'Your feedback has been submitted.');
        setModalVisible(false);
        navigation.goBack();
      } else {
        Alert.alert('Error', data.message || 'Failed to submit feedback.');
      }
    } catch {
      Alert.alert('Error', 'An error occurred submitting feedback.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {region ? (
        <MapView style={styles.map} region={region} showsUserLocation={true}>
          <Marker coordinate={driverLocation} title="You (Driver)" pinColor="red" />
          <Marker coordinate={riderLocation} title="Rider" pinColor="blue" />
        </MapView>
      ) : (
        <Text>Loading Map...</Text>
      )}

      <View style={styles.bottomBar}>
        <Text style={styles.paymentText}>
          Payment Method: {paymentMethod === 'cash' ? 'Cash' : 'In-App Credits'}
        </Text>

        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[styles.statusButton, { backgroundColor: '#007bff' }]}
            onPress={() => sendStatusUpdate('driver_arrived')}
          >
            <Text style={styles.buttonText}>Driver Arrived</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statusButton, { backgroundColor: '#28a745' }]}
            onPress={() => sendStatusUpdate('ride_started')}
          >
            <Text style={styles.buttonText}>Start Ride</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statusButton, { backgroundColor: '#dc3545' }]}
            onPress={() => {
              sendStatusUpdate('ride_ended');
              setModalVisible(true);
            }}
          >
            <Text style={styles.buttonText}>End Ride</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => !loading && setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ride Feedback</Text>

            <Text style={styles.label}>Rate your rider (1-5):</Text>
            <Rating
              type="star"
              startingValue={rating}
              imageSize={30}
              onFinishRating={setRating}
              style={{ paddingVertical: 10 }}
            />

            <Text style={styles.label}>Feedback:</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Write your feedback here..."
              multiline
              numberOfLines={3}
              value={feedback}
              onChangeText={setFeedback}
              editable={!loading}
            />

            <View style={styles.checkboxContainer}>
              <CheckBox
                value={rideCompleted}
                onValueChange={setRideCompleted}
                disabled={loading}
              />
              <Text style={styles.checkboxLabel}>Ride completed successfully</Text>
            </View>

            {loading ? (
              <ActivityIndicator size="large" color="#007BFF" />
            ) : (
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.submitButton]}
                  onPress={submitFeedback}
                >
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DriverRideInProgress;

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 7 },
  bottomBar: {
    flex: 2,
    paddingHorizontal: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  paymentText: { fontSize: 16, marginBottom: 10, textAlign: 'center' },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  statusButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  label: { fontSize: 14, marginTop: 10 },
  textInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginTop: 5,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 15 },
  checkboxLabel: { marginLeft: 8, fontSize: 14 },
  modalButtons: { marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: '#007bff',
  },
});
