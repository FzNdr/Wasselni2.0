import React, { useContext } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import { AppContext } from '../../context/AppContext';
import { useRouter } from 'expo-router';
  const router = useRouter();

const ProfileScreen = ({ navigation }) => {
  const { userRole, setUserRole, userInfo } = useContext(AppContext);

  const handleLogout = () => {
    setUserRole(null);
    router.push('/screens/Auth/LoginScreen');
  };

  const renderUserDetails = () => {
    if (userRole === 'Rider') {
      return (
        <>
          <Text style={styles.info}>Full Name: {userInfo?.name}</Text>
          <Text style={styles.info}>Email: {userInfo?.email}</Text>
          <Text style={styles.info}>Phone: {userInfo?.phone}</Text>
          <Text style={styles.info}>Total Rides: {userInfo?.totalRides}</Text>
          <Text style={styles.info}>Points: {userInfo?.points}</Text>
          <Text style={styles.info}>Rating: {userInfo?.rating} ⭐</Text>

        </>
      );
    } else if (userRole === 'Driver') {
      return (
        <>
          <Text style={styles.info}>Full Name: {userInfo?.name}</Text>
          <Text style={styles.info}>Email: {userInfo?.email}</Text>
          <Text style={styles.info}>Phone: {userInfo?.phone}</Text>
          <Text style={styles.info}>Vehicle Type: {userInfo?.vehicleType}</Text>
          <Text style={styles.info}>License Plate: {userInfo?.licensePlate}</Text>
          <Text style={styles.info}>Total Completed Rides: {userInfo?.totalRides}</Text>
          <Text style={styles.info}>Points: {userInfo?.points}</Text>
          <Text style={styles.info}>Rating: {userInfo?.rating} ⭐</Text>
        </>
      );
    } else {
      return <Text style={styles.info}>No user info available.</Text>;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Profile</Text>
      <Text style={styles.role}>Role: {userRole || 'Guest'}</Text>
      {renderUserDetails()}
      <Button title="Logout" onPress={handleLogout} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  role: {
    fontSize: 20,
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
});

export default ProfileScreen;
