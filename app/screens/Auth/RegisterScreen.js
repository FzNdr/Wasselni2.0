import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';

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

  const handleRegister = () => {
    if (username && firstName && lastName && phoneNumber && govId && password) {
      if (
        registrationType === 'Driver' &&
        (!drivingLicense || !carPlate || !vehicleBrand || !vehicleType || !totalSeats)
      ) {
        Alert.alert('Missing Fields', 'Please fill in all the required driver fields.');
        return;
      }
      router.push('/LoginScreen');
    } else {
      Alert.alert('Missing Fields', 'Please fill in all the required fields.');
    }
  };

  // Dynamic theme-based colors
  const themeStyles = {
    backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
    textColor: isDarkMode ? '#FFFFFF' : '#1c1c1c',
    inputBackground: isDarkMode ? '#1e1e1e' : '#eeeeee',
    placeholderTextColor: isDarkMode ? '#aaa' : '#555',
    formContainerColor: isDarkMode ? '#1a1a1a' : '#f0f0f0',
  };

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <Text style={[styles.header, { color: themeStyles.textColor }]}>Register</Text>
      <Text style={{ color: themeStyles.textColor }}>Select Registration Type:</Text>

      <View style={[styles.pickerWrapper, { backgroundColor: themeStyles.inputBackground, borderColor: themeStyles.textColor }]}>
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
        <ScrollView
          contentContainerStyle={styles.formContainer}
          style={styles.scrollView}
          showsVerticalScrollIndicator
        >
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

              <Text style={{ color: themeStyles.textColor }}>Vehicle Type</Text>
              <Text style={{ color: themeStyles.textColor, marginTop: 10 }}>Vehicle Type</Text>
              <View style={[styles.pickerWrapper, { backgroundColor: themeStyles.inputBackground, borderColor: themeStyles.textColor }]}>
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
    paddingBottom: 120,
  },
  scrollView: {
    width: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
});

export default RegisterScreen;
