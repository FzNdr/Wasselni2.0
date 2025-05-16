import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  Alert,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import FormToggle from '../../../components/FormToggle';

const RegisterScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const [registrationType, setRegistrationType] = useState('Rider');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [govId, setGovId] = useState('');
  const [password, setPassword] = useState('');
  const [drivingLicense, setDrivingLicense] = useState('');
  const [carPlate, setCarPlate] = useState('');
  const [vehicleBrand, setVehicleBrand] = useState('');
  const [vehicleType, setVehicleType] = useState('SUV');
  const [totalSeats, setTotalSeats] = useState('');
  const [photo, setPhoto] = useState(null);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Please grant media access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setPhoto(result.assets[0]);
    }
  };

  const handleRegister = async () => {
    if (!username || !firstName || !lastName || !phoneNumber || !govId || !password) {
      Alert.alert('Missing Fields', 'Please fill in all the required fields.');
      return;
    }

    if (registrationType === 'Driver') {
      if (!drivingLicense || !carPlate || !vehicleBrand || !vehicleType || !totalSeats || !photo) {
        Alert.alert('Missing Fields', 'Please fill in all the required driver fields including photo.');
        return;
      }
    }

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('first_name', firstName);
      formData.append('last_name', lastName);
      formData.append('phone', phoneNumber);
      formData.append('gov_id', govId);
      formData.append('password', password);
      formData.append('role', registrationType);

      if (registrationType === 'Driver') {
        formData.append('driving_license', drivingLicense);
        formData.append('car_plate', carPlate);
        formData.append('vehicle_brand', vehicleBrand);
        formData.append('vehicle_type', vehicleType);
        formData.append('total_seats', totalSeats);
        formData.append('photo', {
          uri: photo.uri,
          name: 'photo.jpg',
          type: 'image/jpeg',
        });
      }

      const response = await fetch('http://YOUR_LARAVEL_IP/api/register', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Registration successful!');
        router.push('/LoginScreen');
      } else {
        console.error(data);
        Alert.alert('Registration Failed', data.message || 'Please check your input.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while registering.');
    }
  };

  const themeStyles = {
    backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
    textColor: isDarkMode ? '#FFFFFF' : '#1c1c1c',
    inputBackground: isDarkMode ? '#1e1e1e' : '#eeeeee',
    placeholderTextColor: isDarkMode ? '#aaa' : '#555',
    formContainerColor: isDarkMode ? '#1a1a1a' : '#f0f0f0',
  };

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <FormToggle activeScreen="RegisterScreen" />

      <Text style={[styles.header, { color: themeStyles.textColor }]}>Register</Text>
      <Text style={{ color: themeStyles.textColor }}>Select Registration Type:</Text>

      {/* Picker wrapper borderColor fixed to static '#ccc' */}
      <View style={[styles.pickerWrapper, { backgroundColor: themeStyles.inputBackground, borderColor: '#ccc' }]}>
        <Picker
          selectedValue={registrationType}
          onValueChange={(itemValue) => setRegistrationType(itemValue)}
          style={[styles.picker, { color: themeStyles.textColor }]}
          dropdownIconColor={themeStyles.textColor}
        >
          <Picker.Item label="Rider" value="Rider" />
          <Picker.Item label="Driver" value="Driver" />
        </Picker>
      </View>

      <View style={[styles.formWrapper, { backgroundColor: themeStyles.formContainerColor }]}>
        <ScrollView contentContainerStyle={styles.formContainer} style={styles.scrollView} showsVerticalScrollIndicator>
          <Text style={[styles.sectionHeader, { color: themeStyles.textColor }]}>Personal Information</Text>

          <TextInput
            style={[styles.input, { backgroundColor: themeStyles.inputBackground, color: themeStyles.textColor }]}
            placeholder="Username"
            placeholderTextColor={themeStyles.placeholderTextColor}
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={[styles.input, { backgroundColor: themeStyles.inputBackground, color: themeStyles.textColor }]}
            placeholder="First Name"
            placeholderTextColor={themeStyles.placeholderTextColor}
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={[styles.input, { backgroundColor: themeStyles.inputBackground, color: themeStyles.textColor }]}
            placeholder="Last Name"
            placeholderTextColor={themeStyles.placeholderTextColor}
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            style={[styles.input, { backgroundColor: themeStyles.inputBackground, color: themeStyles.textColor }]}
            placeholder="Phone Number"
            placeholderTextColor={themeStyles.placeholderTextColor}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          <TextInput
            style={[styles.input, { backgroundColor: themeStyles.inputBackground, color: themeStyles.textColor }]}
            placeholder="Government ID"
            placeholderTextColor={themeStyles.placeholderTextColor}
            value={govId}
            onChangeText={setGovId}
          />
          <TextInput
            style={[styles.input, { backgroundColor: themeStyles.inputBackground, color: themeStyles.textColor }]}
            placeholder="Password"
            placeholderTextColor={themeStyles.placeholderTextColor}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {registrationType === 'Driver' && (
            <>
              <Text style={[styles.sectionHeader, { color: themeStyles.textColor }]}>Vehicle Information</Text>

              <TextInput
                style={[styles.input, { backgroundColor: themeStyles.inputBackground, color: themeStyles.textColor }]}
                placeholder="Driving License Number"
                placeholderTextColor={themeStyles.placeholderTextColor}
                value={drivingLicense}
                onChangeText={setDrivingLicense}
              />
              <TextInput
                style={[styles.input, { backgroundColor: themeStyles.inputBackground, color: themeStyles.textColor }]}
                placeholder="Car Plate Number"
                placeholderTextColor={themeStyles.placeholderTextColor}
                value={carPlate}
                onChangeText={setCarPlate}
              />
              <TextInput
                style={[styles.input, { backgroundColor: themeStyles.inputBackground, color: themeStyles.textColor }]}
                placeholder="Vehicle Brand"
                placeholderTextColor={themeStyles.placeholderTextColor}
                value={vehicleBrand}
                onChangeText={setVehicleBrand}
              />
              <TextInput
                style={[styles.input, { backgroundColor: themeStyles.inputBackground, color: themeStyles.textColor }]}
                placeholder="Total Seats (excluding driver)"
                placeholderTextColor={themeStyles.placeholderTextColor}
                value={totalSeats}
                onChangeText={setTotalSeats}
                keyboardType="numeric"
              />

              <Text style={{ color: themeStyles.textColor, marginTop: 10 }}>Vehicle Type</Text>
              <View
                style={[
                  styles.pickerWrapper,
                  { backgroundColor: themeStyles.inputBackground, borderColor: themeStyles.textColor },
                ]}
              >
                <Picker
                  selectedValue={vehicleType}
                  onValueChange={(itemValue) => setVehicleType(itemValue)}
                  style={[styles.picker, { color: themeStyles.textColor }]}
                  dropdownIconColor={themeStyles.textColor}
                >
                  <Picker.Item label="SUV" value="SUV" />
                  <Picker.Item label="Sedan" value="Sedan" />
                  <Picker.Item label="Van" value="Van" />
                </Picker>
              </View>

              <Text style={{ color: themeStyles.textColor, marginTop: 15 }}>Upload Photo of you holding your Driving license and your Government iD standing infront of your car with the car plate number clear and visible</Text>
              <Button title="Choose Photo" onPress={pickImage} />
              {photo && (
                <Image
                  source={{ uri: photo.uri }}
                  style={{ width: 100, height: 100, marginTop: 10, borderRadius: 8 }}
                />
              )}
            </>
          )}
        </ScrollView>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Register" onPress={handleRegister} />
      </View>
    </View>
  );
};

      
const styles = StyleSheet.create({
  pickerWrapper: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    borderColor: '#ccc', // Keep default border color here
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 14,
    marginVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ccc',
  },
  picker: {
    width: '100%',
    marginVertical: 10,
    backgroundColor: 'transparent',
  },
  formWrapper: {
    width: '100%',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    flex: 1,
  },
  formContainer: {
    flexGrow: 1,
    paddingBottom: 60,
  },
  scrollView: {
    width: '100%',
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 20,
  },
});

export default RegisterScreen;
