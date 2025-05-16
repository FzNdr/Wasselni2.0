// app/(auth)/register.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  useColorScheme
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

const RegisterScreen = () => {
  const [registrationType, setRegistrationType] = useState('Rider');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [licensePhoto, setLicensePhoto] = useState(null);

  const colorScheme = useColorScheme();
  const router = useRouter();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access media library is required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      setLicensePhoto(result.assets[0]);
    }
  };

  const validateForm = () => {
    if (!fullName || !phoneNumber || !email || !password) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return false;
    }

    if (registrationType === 'Driver') {
      if (!vehicleMake || !vehicleModel || !licensePhoto) {
        Alert.alert('Error', 'Please fill in all driver information and upload your license photo.');
        return false;
      }
    }

    return true;
  };

  const handleRegister = () => {
    if (!validateForm()) return;

    const formData = {
      role: registrationType,
      fullName,
      phoneNumber,
      email,
      password,
      ...(registrationType === 'Driver' && {
        vehicleMake,
        vehicleModel,
        licensePhoto,
      }),
    };

    console.log('Submitting Registration Data:', formData);
    Alert.alert('Success', 'Registered successfully!');
    router.push('/login');
  };

  const styles = {
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 4,
      color: colorScheme === 'dark' ? '#fff' : '#000',
    },
    input: {
      height: 40,
      borderColor: colorScheme === 'dark' ? '#555' : '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 10,
      color: colorScheme === 'dark' ? '#fff' : '#000',
      backgroundColor: colorScheme === 'dark' ? '#222' : '#f9f9f9',
    },
    button: {
      backgroundColor: '#4CAF50',
      padding: 12,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
      position: 'absolute',
      bottom: 20,
      left: 20,
      right: 20,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    pickerContainer: {
      borderWidth: 1,
      borderColor: colorScheme === 'dark' ? '#555' : '#ccc',
      borderRadius: 5,
      marginBottom: 10,
      backgroundColor: colorScheme === 'dark' ? '#222' : '#f9f9f9',
    },
    imagePreview: {
      width: '100%',
      height: 200,
      marginBottom: 10,
      borderRadius: 10,
    },
    uploadButton: {
      backgroundColor: '#2196F3',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      marginBottom: 10,
    },
  };

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 100 }} style={styles.container}>
      <Text style={styles.label}>Register As</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={registrationType}
          onValueChange={(itemValue) => setRegistrationType(itemValue)}
        >
          <Picker.Item label="Rider" value="Rider" />
          <Picker.Item label="Driver" value="Driver" />
        </Picker>
      </View>

      <Text style={styles.label}>Full Name</Text>
      <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

      <Text style={styles.label}>Password</Text>
      <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />

      {registrationType === 'Driver' && (
        <>
          <Text style={styles.label}>Vehicle Make</Text>
          <TextInput style={styles.input} value={vehicleMake} onChangeText={setVehicleMake} />

          <Text style={styles.label}>Vehicle Model</Text>
          <TextInput style={styles.input} value={vehicleModel} onChangeText={setVehicleModel} />

          <Text style={styles.label}>Upload License Photo</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <Text style={{ color: '#fff' }}>Choose Image</Text>
          </TouchableOpacity>
          {licensePhoto && (
            <Image source={{ uri: licensePhoto.uri }} style={styles.imagePreview} />
          )}
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default RegisterScreen;
