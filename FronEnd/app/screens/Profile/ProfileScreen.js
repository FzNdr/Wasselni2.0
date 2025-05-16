import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppContext } from '../../context/AppContext';

const ProfileScreen = () => {
  const router = useRouter();
  const { userRole, setUserRole, userInfo } = useContext(AppContext);

  const handleLogout = () => {
    setUserRole(null);
    router.push('/screens/Auth/LoginScreen');
  };

  const handleRidesHistoryPress = () => {
    router.push('/screens/RidesHistoryScreen'); // adjust if your route is different
  };

  const renderUserDetails = () => {
    if (userRole === 'Rider') {
      return (
        <>
          <Text style={styles.info}>Full Name: {userInfo?.name}</Text>
          <Text style={styles.info}>Email: {userInfo?.email}</Text>
          <Text style={styles.info}>Phone: {userInfo?.phone}</Text>
          <Text style={styles.info}>Date Joined: {userInfo?.dateJoined}</Text>
          <Text style={styles.info}>Total Rides: {userInfo?.totalRides}</Text>
          <Text style={styles.info}>Total Distance Traveled: {userInfo?.totalDistance} km</Text>
          <Text style={styles.info}>Points: {userInfo?.points}</Text>
          <Text style={styles.info}>Rating: {userInfo?.rating} ⭐</Text>
          <Text style={styles.sectionHeader}>Payment Methods</Text>
          {userInfo?.paymentMethods?.map((method, index) => (
            <Text key={index} style={styles.info}>• {method}</Text>
          ))}
          <Text style={styles.sectionHeader}>Preferences</Text>
          <Text style={styles.info}>Preferred Ride Type: {userInfo?.preferredRideType}</Text>
          <Text style={styles.sectionHeader}>Security</Text>
          <Text style={styles.info}>Two-Factor Authentication: {userInfo?.twoFactorAuth ? 'Enabled' : 'Disabled'}</Text>
          <Text style={styles.sectionHeader}>Support</Text>
          <Text style={styles.info}>Help Center: Available in menu</Text>
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

      {/* New Rides History Button */}
      <View style={styles.buttonContainer}>
        <Button title="Rides History" onPress={handleRidesHistoryPress} />
      </View>

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
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    marginVertical: 20,
    width: '60%',
  },
});

export default ProfileScreen;
