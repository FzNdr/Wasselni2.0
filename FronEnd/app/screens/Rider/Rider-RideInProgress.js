import React, { useContext, useEffect, useState } from 'react';
import { 
  Ionicons 
} from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { 
  Button, FlatList, StyleSheet, Text, TouchableOpacity, useColorScheme, View 
} from 'react-native';

import { AppContext } from '../context/AppContext'; // adjust the path to where your AppContext is

const RiderHomePage = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const { userInfo } = useContext(AppContext);

  // Use real promotions from backend instead of hardcoded ones
  const [promotions, setPromotions] = useState([]);

  const [accumulatedPoints, setAccumulatedPoints] = useState(250); // Example points

  useEffect(() => {
    // Fetch promotions from backend API
    fetch('https://your-api-url/api/promotions')
      .then(res => res.json())
      .then(data => setPromotions(data))
      .catch(err => console.error('Error fetching promotions:', err));
  }, []);

  const handleProfileNavigation = () => {
    router.push('/screens/Profile/ProfileScreen'); // Navigate to ProfileScreen
  };

  if (!userInfo) {
    // No user logged in yet
    return (
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#F5F5F5', justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: isDarkMode ? '#FFF' : '#000' }}>Please log in to view this page.</Text>
      </View>
    );
  }

  const renderPromotionItem = ({ item }) => (
    <View style={[styles.promotionItem, { backgroundColor: isDarkMode ? '#222' : '#FFF' }]}>
      <Text style={[styles.promotionName, { color: isDarkMode ? '#FFF' : '#000' }]}>{item.name}</Text>
      <Text style={[styles.promotionText, { color: isDarkMode ? '#AAA' : '#555' }]}>Start Date: {item.startDate}</Text>
      <Text style={[styles.promotionText, { color: isDarkMode ? '#AAA' : '#555' }]}>Time Remaining: {item.timeRemaining}</Text>
      <Text style={[styles.promotionDescription, { color: isDarkMode ? '#CCC' : '#333' }]}>{item.description}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#F5F5F5' }]}>
      <TouchableOpacity style={styles.profileButton} onPress={handleProfileNavigation}>
        <Ionicons name="person-circle" size={50} color={isDarkMode ? '#FFF' : '#000'} />
      </TouchableOpacity>

      <Text style={[styles.header, { color: isDarkMode ? '#FFF' : '#000' }]}>Ongoing Promotions</Text>

      <FlatList
        data={promotions}
        renderItem={renderPromotionItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.promotionsList}
      />

      <Button title="Start Your Journey" onPress={() => router.push('/screens/Rider/RiderMap')} />

      <View style={[styles.pointsContainer, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
        <Text style={[styles.pointsText, { color: isDarkMode ? '#FFF' : '#000' }]}>
          Your Accumulated Points: {accumulatedPoints}
        </Text>
        <View style={styles.pointsOptions}>
          <Text style={[styles.pointsOption, { color: isDarkMode ? '#1E90FF' : '#007AFF' }]}>
            Spend on Special Deals
          </Text>
          <Text style={[styles.pointsOption, { color: isDarkMode ? '#1E90FF' : '#007AFF' }]}>
            Convert to In-App Credits
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  profileButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  promotionsList: {
    marginBottom: 20,
  },
  promotionItem: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  promotionName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  promotionText: {
    fontSize: 14,
    marginTop: 5,
  },
  promotionDescription: {
    marginTop: 10,
    fontSize: 14,
    fontStyle: 'italic',
  },
  pointsContainer: {
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pointsOptions: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  pointsOption: {
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default RiderHomePage;
