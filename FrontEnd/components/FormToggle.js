import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

const FormToggle = ({ activeScreen }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const router = useRouter();

  return (
    <View style={[styles.toggleContainer, { backgroundColor: isDarkMode ? '#222' : '#eee' }]}>
      <TouchableOpacity
        onPress={() => router.push('./Auth/LoginScreen')}
        style={[styles.toggleButton, activeScreen === 'LoginScreen' && styles.activeButton]}
      >
        <Text style={[styles.toggleText, activeScreen === 'LoginScreen' && styles.activeText]}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push('./Auth/RegisterScreen')}
        style={[styles.toggleButton, activeScreen === 'RegisterScreen' && styles.activeButton]}
      >
        <Text style={[styles.toggleText, activeScreen === 'RegisterScreen' && styles.activeText]}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  toggleText: {
    fontSize: 16,
    color: '#888',
  },
  activeButton: {
    backgroundColor: '#007AFF',
  },
  activeText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default FormToggle;