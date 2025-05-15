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

  const handleRegister = () => {
    if (username && firstName && lastName && phoneNumber && govId && password) {
      if (
        registrationType === 'Driver' &&
        (!drivingLicense || !carPlate || !vehicleBrand || !vehicleType || !totalSeats)
      ) {
        Alert.alert('Missing Fields', 'Please fill in all the required driver fields.');
        return;
      }
      router.push('screens/Auth/DriverHomePage');
    } else {
      Alert.alert('Missing Fields', 'Please fill in all the required fields.');
    }
  };

  const themeStyles = {
    backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
    textColor: isDarkMode ? '#FFFFFF' : '#1c1c1c',
    inputBackground: isDarkMode ? '#1e1e1e' : '#eeeeee',
    placeholderTextColor: isDarkMode ? '#aaa' : '#555',
    formContainerColor: isDarkMode ? '#1a1a1a' : '#f0f0f0',
    borderColor: isDarkMode ? '#555' : '#ccc',
    buttonColor: isDarkMode ? '#1e90ff' : '#007AFF',
    buttonTextColor: '#fff',
    buttonPadding: 15,
    buttonRadius: 8,
    buttonFontSize: 18,
  };

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <View style={styles.formToggleWrapper}>
        <FormToggle activeScreen="RegisterScreen" />
      </View>

      <Text style={[styles.header, { color: themeStyles.textColor }]}>Register</Text>
      <Text style={{ color: themeStyles.textColor }}>Select Registration Type:</Text>

      <View
        style={[
          styles.pickerWrapper,
          {
            backgroundColor: themeStyles.inputBackground,
            borderColor: themeStyles.borderColor,
          },
        ]}
      >
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

      <View
        style={[
          styles.formWrapper,
          { backgroundColor: themeStyles.formContainerColor },
        ]}
      >
        <ScrollView
          contentContainerStyle={styles.formContainer}
          style={styles.scrollView}
          showsVerticalScrollIndicator
        >
          <Text style={[styles.sectionHeader, { color: themeStyles.textColor }]}>
            Personal Information
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: themeStyles.inputBackground,
                color: themeStyles.textColor,
                borderColor: themeStyles.borderColor,
              },
            ]}
            placeholder="Username"
            placeholderTextColor={themeStyles.placeholderTextColor}
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: themeStyles.inputBackground,
                color: themeStyles.textColor,
                borderColor: themeStyles.borderColor,
              },
            ]}
            placeholder="Password"
            placeholderTextColor={themeStyles.placeholderTextColor}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: themeStyles.inputBackground,
                color: themeStyles.textColor,
                borderColor: themeStyles.borderColor,
              },
            ]}
            placeholder="First Name"
            placeholderTextColor={themeStyles.placeholderTextColor}
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: themeStyles.inputBackground,
                color: themeStyles.textColor,
                borderColor: themeStyles.borderColor,
              },
            ]}
            placeholder="Last Name"
            placeholderTextColor={themeStyles.placeholderTextColor}
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: themeStyles.inputBackground,
                color: themeStyles.textColor,
                borderColor: themeStyles.borderColor,
              },
            ]}
            placeholder="Phone Number"
            placeholderTextColor={themeStyles.placeholderTextColor}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: themeStyles.inputBackground,
                color: themeStyles.textColor,
                borderColor: themeStyles.borderColor,
              },
            ]}
            placeholder="Government ID"
            placeholderTextColor={themeStyles.placeholderTextColor}
            value={govId}
            onChangeText={setGovId}
          />

          {registrationType === 'Driver' && (
            <>
              <Text
                style={[styles.sectionHeader, { color: themeStyles.textColor }]}
              >
                Vehicle Information
              </Text>

              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: themeStyles.inputBackground,
                    color: themeStyles.textColor,
                    borderColor: themeStyles.borderColor,
                  },
                ]}
                placeholder="Driving License Number"
                placeholderTextColor={themeStyles.placeholderTextColor}
                value={drivingLicense}
                onChangeText={setDrivingLicense}
              />
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: themeStyles.inputBackground,
                    color: themeStyles.textColor,
                    borderColor: themeStyles.borderColor,
                  },
                ]}
                placeholder="Car Plate Number"
                placeholderTextColor={themeStyles.placeholderTextColor}
                value={carPlate}
                onChangeText={setCarPlate}
              />
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: themeStyles.inputBackground,
                    color: themeStyles.textColor,
                    borderColor: themeStyles.borderColor,
                  },
                ]}
                placeholder="Vehicle Brand"
                placeholderTextColor={themeStyles.placeholderTextColor}
                value={vehicleBrand}
                onChangeText={setVehicleBrand}
              />
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: themeStyles.inputBackground,
                    color: themeStyles.textColor,
                    borderColor: themeStyles.borderColor,
                  },
                ]}
                placeholder="Total Seats (excluding driver)"
                placeholderTextColor={themeStyles.placeholderTextColor}
                value={totalSeats}
                onChangeText={setTotalSeats}
                keyboardType="numeric"
              />

              <Text style={{ color: themeStyles.textColor }}>Vehicle Type</Text>
              <View
                style={[
                  styles.pickerWrapper,
                  {
                    backgroundColor: themeStyles.inputBackground,
                    borderColor: themeStyles.borderColor,
                  },
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
            </>
          )}
        </ScrollView>
      </View>

      <View style={styles.floatingButton}>
        <Button title="Register" onPress={handleRegister} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40, // Adjusted for FormToggle height
    paddingHorizontal: 20,
    marginBottom: '3%',
  },
  formToggleWrapper: {
    alignItems: 'center',
    marginTop: '10%',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
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
    width: '100%',
    padding: 14,
    marginVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
  },
  formWrapper: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    marginBottom: 100, // Enough space above the Register button
  },
  formContainer: {
    flexGrow: 1,
    paddingBottom: '5%', // Smaller buffer just for spacing
  },
  scrollView: {
    width: '100%',
  },
  floatingButton: {
    position: 'absolute',
    bottom: '5%',
    left: '10%',
    right: '10%',
    zIndex: 10,
    elevation: 5,
  },
});

export default RegisterScreen;