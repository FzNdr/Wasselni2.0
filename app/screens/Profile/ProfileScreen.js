import { useContext } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { AppContext } from '../../context/AppContext';

const ProfileScreen = ({ navigation }) => {
  const { userRole, setUserRole } = useContext(AppContext);

  const handleLogout = () => {
    setUserRole(null); // Reset user role or perform logout logic
    navigation.navigate('Login'); // Navigate back to the login screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>
      <Text style={styles.info}>Role: {userRole || 'Guest'}</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  info: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default ProfileScreen;