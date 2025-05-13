// components/FormToggle.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router'; // Import useRouter

const FormToggle = ({ activeScreen }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const router = useRouter(); // Use the router from expo-router

  return (
    <View style={[styles.toggleContainer, { backgroundColor: isDarkMode ? '#222' : '#eee' }]}>
      <TouchableOpacity
        onPress={() => router.push('/LoginScreen')} // Use router.push() instead of navigation.navigate()
        style={[styles.toggleButton, activeScreen === 'login' && styles.activeButton]}
      >
        <Text style={[styles.toggleText, activeScreen === 'login' && styles.activeText]}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push('/RegisterScreen')} // Use router.push() for navigation
        style={[styles.toggleButton, activeScreen === 'register' && styles.activeButton]}
      >
        <Text style={[styles.toggleText, activeScreen === 'register' && styles.activeText]}>Register</Text>
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
