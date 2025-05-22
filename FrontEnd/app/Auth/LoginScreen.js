import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme
} from 'react-native';
import FormToggle from '../../components/FormToggle';

const LoginScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const [loginType, setLoginType] = useState('rider');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {

    if (!username || !password) {
      Alert.alert('Missing Fields', 'Please fill in all the required fields.');
      return;
    }

    try {
      console.log('Sending login request...', { username, password, role: loginType });
      const response = await fetch('http://10.0.2.2:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role: loginType.toLowerCase() }),

      });

      console.log('Response status:', response.status);

      const data = await response.json();
      console.log('Response data:', data);

      if (data.token && data.user) {
        if (loginType.toLowerCase() === 'driver') {
           router.push('/Driver/DriverHomePage');


        } else {
          router.push('/Rider/RiderHomePage');

         

        }
      } else {
        Alert.alert('Login Failed', data.message || 'Invalid credentials.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to the server.');
      console.error('Fetch error:', error);
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
    buttonTextColor: isDarkMode ? '#fff' : '#fff',
    buttonPadding: 15,
    buttonRadius: 8,
    buttonFontSize: 18,
  };

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <View style={styles.formToggleWrapper}>
        <FormToggle activeScreen="LoginScreen" />
      </View>

      <Text style={[styles.header, { color: themeStyles.textColor }]}>Login</Text>

      <Text style={{ color: themeStyles.textColor }}>Select Login Type:</Text>
      <View
        style={[
          styles.pickerWrapper,
          { backgroundColor: themeStyles.inputBackground, borderColor: themeStyles.borderColor },
        ]}
      >
        <Picker
          selectedValue={loginType}
          onValueChange={(itemValue) => setLoginType(itemValue)}
          style={[styles.picker, { color: themeStyles.textColor }]}
          dropdownIconColor={themeStyles.textColor}
        >
          <Picker.Item label="Rider" value="Rider" />
          <Picker.Item label="Driver" value="Driver" />
        </Picker>
      </View>

      <View style={[styles.formWrapper, { backgroundColor: themeStyles.formContainerColor }]}>
        <ScrollView contentContainerStyle={styles.formContainer} style={styles.scrollView}>
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
        </ScrollView>
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: themeStyles.buttonColor,
            paddingVertical: themeStyles.buttonPadding,
            borderRadius: themeStyles.buttonRadius,
          },
        ]}
        onPress={handleLogin}
      >
        <Text style={[styles.buttonText, { color: themeStyles.buttonTextColor }]}>Login</Text>
      </TouchableOpacity>
    </View>
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
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
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
});

export default LoginScreen;