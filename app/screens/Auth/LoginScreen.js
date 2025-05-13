import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme
} from 'react-native';
import FormToggle from 'E:/Wasselni2.0/components/FormToggle';

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isDarkMode = useColorScheme() === 'dark';
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    try {
      const response = await fetch('http://YOUR_BACKEND_URL/services/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (data.user.type === 'Driver') {
          router.push('/DriverMap');
        } else {
          router.push('/RiderMap');
        }
      } else {
        Alert.alert('Login Failed', data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };

  // Dynamic theme styles
  const themeStyles = {
    backgroundColor: isDarkMode ? '#121212' : '#f2f2f2',
    inputBackground: isDarkMode ? '#333' : '#f9f9f9',
    textColor: isDarkMode ? '#fff' : '#000',
    borderColor: isDarkMode ? '#555' : '#ccc',
    buttonColor: isDarkMode ? '#1e90ff' : '#007AFF',
  };

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <FormToggle activeScreen="login" />
      <ScrollView
        contentContainerStyle={[
          styles.formContainer,
          {
            backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
            borderColor: themeStyles.borderColor,
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.header, { color: themeStyles.textColor }]}>Login</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: themeStyles.inputBackground,
              color: themeStyles.textColor,
              borderColor: themeStyles.borderColor,
            },
          ]}
          placeholder="Email"
          placeholderTextColor={isDarkMode ? '#aaa' : '#666'}
          value={email}
          onChangeText={setEmail}
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
          placeholderTextColor={isDarkMode ? '#aaa' : '#666'}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <View style={styles.buttonContainer}>
          <Button title="Login" onPress={handleLogin} color={themeStyles.buttonColor} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    margin: 20,
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  input: {
    height: 50,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 15,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default LoginScreen;
