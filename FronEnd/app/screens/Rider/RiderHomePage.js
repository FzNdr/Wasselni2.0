import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import RideStatusListener from './components/RideStatusListener'; // Adjust path if needed

const RiderHomePage = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // TODO: Replace with actual logged-in user ID from auth or context
  const userId = 123;

  const [promotions] = useState([
    {
      id: '1',
      name: '10% Off First Ride',
      startDate: '2025-05-14',
      timeRemaining: '2 days 5 hours',
      description: 'Get 10% off on your first ride with us.',
    },
    {
      id: '2',
      name: 'Free Ride Up to $5',
      startDate: '2025-05-10',
      timeRemaining: '1 day 3 hours',
      description: 'Free ride for the first $5 of your trip.',
    },
    {
      id: '3',
      name: '10% Off First Ride',
      startDate: '2025-05-14',
      timeRemaining: '2 days 5 hours',
      description: 'Get 10% off on your first ride with us.',
    },
    {
      id: '4',
      name: '10% Off First Ride',
      startDate: '2025-05-14',
      timeRemaining: '2 days 5 hours',
      description: 'Get 10% off on your first ride with us.',
    },
  ]);

  const [accumulatedPoints] = useState(250);

  const handleProfileNavigation = () => {
    router.push('/screens/Profile/ProfileScreen');
  };

  const renderPromotionItem = ({ item }) => (
    <View style={styles.promotionItem}>
      <Text style={[styles.promotionName, { color: isDarkMode ? '#FFF' : '#000' }]}>
        {item.name}
      </Text>
      <Text style={[styles.promotionText, { color: isDarkMode ? '#AAA' : '#555' }]}>
        Start Date: {item.startDate}
      </Text>
      <Text style={[styles.promotionText, { color: isDarkMode ? '#AAA' : '#555' }]}>
        Time Remaining: {item.timeRemaining}
      </Text>
      <Text style={[styles.promotionDescription, { color: isDarkMode ? '#CCC' : '#333' }]}>
        {item.description}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#F5F5F5' }]}>
      <TouchableOpacity style={styles.profileButton} onPress={handleProfileNavigation}>
        <Ionicons name="person-circle" size={50} color={isDarkMode ? '#FFF' : '#000'} />
      </TouchableOpacity>

      <Text style={[styles.header, { color: isDarkMode ? '#FFF' : '#000' }]}>
        Ongoing Promotions
      </Text>

      <FlatList
        data={promotions}
        renderItem={renderPromotionItem}
        keyExtractor={(item) => item.id}
        style={styles.promotionsList}
      />

      <Button
        title="Start Your Journey"
        onPress={() => router.push('/screens/Rider/RiderMap')}
      />

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

      {/* WebSocket listener component for ride status */}
      <RideStatusListener userId={userId} />
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
    backgroundColor: '#FFF',
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
