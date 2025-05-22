import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  Alert,
  Button,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';
import FormToggle from '../../components/FormToggle';

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

  const theme = {
    background: isDarkMode ? '#121212' : '#f5f5f5',
    text: isDarkMode ? '#fff' : '#1c1c1c',
    inputBg: isDarkMode ? '#1e1e1e' : '#e6e6e6',
    placeholder: isDarkMode ? '#aaa' : '#666',
    borderColor: isDarkMode ? '#444' : '#ccc',
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Denied', 'We need access to your photos to continue.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setPhoto(result.assets[0]);
    }
  };

  const handleRegister = async () => {
  if (!username || !firstName || !lastName || !phoneNumber || !govId || !password) {
    Alert.alert('Missing Fields', 'Please complete all required fields.');
    return;
  }

  if (
    registrationType === 'Driver' &&
    (!drivingLicense || !carPlate || !vehicleBrand || !vehicleType || !totalSeats || !photo)
  ) {
    Alert.alert('Missing Fields', 'Please complete all driver-specific fields including the photo.');
    return;
  }

  try {
    let response;
    if (registrationType === 'Driver') {
      formData.append('registrationType', registrationType);
formData.append('username', username);
formData.append('firstName', firstName);
formData.append('lastName', lastName);
formData.append('phoneNumber', phoneNumber);
formData.append('govId', govId);
formData.append('password', password);
formData.append('password_confirmation', password); // For password confirmation

formData.append('drivingLicense', drivingLicense);
formData.append('carPlate', carPlate);
formData.append('vehicleBrand', vehicleBrand);
formData.append('vehicleType', vehicleType);
formData.append('totalSeats', Number(totalSeats));
formData.append('photo', {
  uri: photo.uri,
  name: 'photo.jpg',
  type: 'image/jpeg',
});


      response = await fetch('http://10.0.2.2:8000/api/register', {
        method: 'POST',
        body: formData,
      });
    } else {
      const payload = {
  registrationType,
  username,
  firstName,
  lastName,
  phoneNumber,
  govId,
  password,
  password_confirmation: password, // add this for confirmation
};

      response = await fetch('http://10.0.2.2:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }

    const contentType = response.headers.get('Content-Type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid response format. Expected JSON.');
    }

    const data = await response.json();

    if (response.ok) {
      Alert.alert('Success', 'Registration successful!');
      if (registrationType === 'driver') {
        router.push('/Driver/DriverHomePage');
      } else {
          router.push('/Rider/RiderHomePage');
      }
    } else {
      Alert.alert('Registration Failed', data.message || 'Something went wrong.');
    }
  } catch (error) {
    console.error(error);
    Alert.alert('Error', error.message || 'Unable to complete registration.');
  }
};


  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <FormToggle activeScreen="RegisterScreen" />
        <Text style={[styles.header, { color: theme.text }]}>Register</Text>
        <Text style={{ color: theme.text }}>Select Registration Type:</Text>

        <View style={[styles.pickerWrapper, { borderColor: theme.borderColor }]}>
          <Picker
            selectedValue={registrationType}
            onValueChange={setRegistrationType}
            style={{ color: theme.text }}
            dropdownIconColor={theme.text}
          >
            <Picker.Item label="Rider" value="Rider" />
            <Picker.Item label="Driver" value="Driver" />
          </Picker>
        </View>

        <Text style={[styles.sectionHeader, { color: theme.text }]}>Personal Information</Text>
        <TextInput style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.borderColor }]} placeholder="Username" placeholderTextColor={theme.placeholder} value={username} onChangeText={setUsername} />
        <TextInput style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.borderColor }]} placeholder="First Name" placeholderTextColor={theme.placeholder} value={firstName} onChangeText={setFirstName} />
        <TextInput style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.borderColor }]} placeholder="Last Name" placeholderTextColor={theme.placeholder} value={lastName} onChangeText={setLastName} />
        <TextInput style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.borderColor }]} placeholder="Phone Number" placeholderTextColor={theme.placeholder} value={phoneNumber} onChangeText={setPhoneNumber} />
        <TextInput style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.borderColor }]} placeholder="Government ID" placeholderTextColor={theme.placeholder} value={govId} onChangeText={setGovId} />
        <TextInput style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.borderColor }]} placeholder="Password" placeholderTextColor={theme.placeholder} value={password} onChangeText={setPassword} secureTextEntry />

        {registrationType === 'Driver' && (
          <>
            <Text style={[styles.sectionHeader, { color: theme.text }]}>Vehicle Information</Text>
            <TextInput style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.borderColor }]} placeholder="Driving License Number" placeholderTextColor={theme.placeholder} value={drivingLicense} onChangeText={setDrivingLicense} />
            <TextInput style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.borderColor }]} placeholder="Car Plate Number" placeholderTextColor={theme.placeholder} value={carPlate} onChangeText={setCarPlate} />
            <TextInput style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.borderColor }]} placeholder="Vehicle Brand" placeholderTextColor={theme.placeholder} value={vehicleBrand} onChangeText={setVehicleBrand} />
            <TextInput style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.borderColor }]} placeholder="Total Seats (excluding driver)" placeholderTextColor={theme.placeholder} keyboardType="numeric" value={totalSeats} onChangeText={setTotalSeats} />

            <Text style={{ color: theme.text, marginTop: 10 }}>Vehicle Type</Text>
            <View style={[styles.pickerWrapper, { borderColor: theme.borderColor }]}>
              <Picker selectedValue={vehicleType} onValueChange={setVehicleType} style={{ color: theme.text }} dropdownIconColor={theme.text}>
                <Picker.Item label="SUV" value="SUV" />
                <Picker.Item label="Sedan" value="Sedan" />
                <Picker.Item label="Van" value="Van" />
              </Picker>
            </View>

            <Text style={{ color: theme.text, marginTop: 15 }}>
              Upload a clear photo of yourself holding your Driving License and Government ID while standing in front of your car.
            </Text>
            <Button title="Choose Photo" onPress={pickImage} />
            {photo && (
              <Image
                source={{ uri: photo.uri }}
                style={{ width: 100, height: 100, marginTop: 10, borderRadius: 10 }}
              />
            )}
          </>
        )}

        {/* ✅ Register button at the bottom of scrollable area */}
        <View style={{ marginTop: 30, marginBottom: 50 }}>
          <Button title="Register" onPress={handleRegister} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40, // Adjusted for FormToggle height
    paddingHorizontal: 20,
  },
  formToggleWrapper: {
    alignItems: 'center',
    marginTop: '10%',
  },
  formWrapper: {
    marginBottom: 20,
    borderRadius: 10,
    padding: 10,
  },
  pickerWrapper: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    marginVertical: 10,
    backgroundColor: 'transparent',
  },
  input: {
    height: 50,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
  },
  scrollView: {
    marginBottom: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    overflow: 'hidden',
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
});

export default RegisterScreen;
