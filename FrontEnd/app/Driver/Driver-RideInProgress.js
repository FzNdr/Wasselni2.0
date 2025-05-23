import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Rating } from 'react-native-ratings';
import CheckBox from '@react-native-community/checkbox'; // Recommended for cross-platform checkbox

const DriverRideInProgress = ({ route, navigation }) => {
  const { riderLocation, driverLocation, rideId, paymentMethod } = route.params;

  const [region, setRegion] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [rideCompleted, setRideCompleted] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (riderLocation && driverLocation) {
      const midLat = (riderLocation.latitude + driverLocation.latitude) / 2;
      const midLng = (riderLocation.longitude + driverLocation.longitude) / 2;
      setRegion({
        latitude: midLat,
        longitude: midLng,
        latitudeDelta:
          Math.abs(riderLocation.latitude - driverLocation.latitude) * 2.5 || 0.01,
        longitudeDelta:
          Math.abs(riderLocation.longitude - driverLocation.longitude) * 2.5 || 0.01,
      });
    }
  }, [riderLocation, driverLocation]);

  const submitFeedback = async () => {
  if (rating === 0) {
    Alert.alert('Rating Required', 'Please provide a rating before submitting.');
    return;
  }

  setLoading(true);

  try {
    const response = await fetch('http://10.0.2.2/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from_user_id: driverUserId,  // Set this in each screen
        to_user_id: riderUserId,     // Set this in each screen
        ride_id: rideId,
        rating,
        comment: feedback,
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
  } catch (error) {
    Alert.alert('Error', 'An error occurred while submitting feedback.');
  } finally {
    setLoading(false);
  }
};


  return (
    <View style={styles.container}>
      {region ? (
        <MapView style={styles.map} region={region} showsUserLocation={true}>
          <Marker coordinate={riderLocation} title="Rider" pinColor="blue" />
          <Marker coordinate={driverLocation} title="You (Driver)" pinColor="red" />
        </MapView>
      ) : (
        <Text>Loading Map...</Text>
      )}

      <View style={styles.bottomBar}>
        <Text style={styles.paymentText}>
          Payment Method: {paymentMethod === 'cash' ? 'Cash' : 'In-App Credits'}
        </Text>

        <TouchableOpacity
          style={styles.endRideButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.endRideText}>End Ride</Text>
        </TouchableOpacity>
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

            <Text style={styles.label}>Rate the rider (1-5):</Text>
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
                tintColors={{ true: '#dc3545', false: '#ccc' }}
                boxType={Platform.OS === 'ios' ? 'square' : undefined} // for iOS styling
              />
              <Text style={styles.checkboxLabel}>Ride completed successfully</Text>
            </View>

            {loading ? (
              <ActivityIndicator size="large" color="#dc3545" />
            ) : (
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.submitButton,
                    rating === 0 && { opacity: 0.6 },
                  ]}
                  onPress={submitFeedback}
                  disabled={rating === 0 || loading}
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


const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 7 },
  bottomBar: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  paymentText: { fontSize: 16, marginBottom: 10 },
  endRideButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  endRideText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
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
  button: { flex: 1, paddingVertical: 12, borderRadius: 6, alignItems: 'center' },
  cancelButton: { backgroundColor: '#6c757d', marginRight: 10 },
  submitButton: { backgroundColor: '#007bff' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default DriverRideInProgress;
