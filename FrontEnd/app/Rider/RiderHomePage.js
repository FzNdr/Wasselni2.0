import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

const RiderHomePage = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const [promotions, setPromotions] = useState([]);
  const [accumulatedPoints, setAccumulatedPoints] = useState();

  useEffect(() => {
  const fetchPromotions = async () => {
    try {
      const response = await fetch('http://10.0.2.2:8000/api/promotions');
      const data = await response.json();

      const now = new Date();

      // Filter to rider promotions active right now
      const activeRiderPromos = data.filter(promo => {
        const startDate = new Date(promo.start_date);
        const endDate = new Date(promo.end_date);
        return (
          promo.target_role === 'rider' &&
          startDate <= now &&
          now <= endDate
        );
      });

      // Map with time remaining
      const processedPromos = activeRiderPromos.map(promo => {
        const endDate = new Date(promo.end_date);
        const diffMs = endDate - now;
        const timeRemaining =
          diffMs <= 0
            ? 'Expired'
            : `${Math.floor(diffMs / 3600000)}h ${Math.floor(
                (diffMs % 3600000) / 60000
              )}m`;

        return {
          id: promo.id.toString(),
          title: promo.title,
          description: promo.description || 'No description provided',
          startDate: new Date(promo.start_date),
          endDate,
          timeRemaining,
        };
      });

      setPromotions(processedPromos);
    } catch (error) {
      console.error('Failed to fetch promotions:', error);
    }
  };

  fetchPromotions();
}, []);


  const handleProfileNavigation = () => {
    router.push('Profile/ProfileScreen');
  };

  const renderPromotionItem = ({ item }) => (
    <View
      style={[
        styles.promotionItem,
        { backgroundColor: isDarkMode ? '#222' : '#FFF' },
      ]}
    >
      <Text style={[styles.promotionName, { color: isDarkMode ? '#FFF' : '#000' }]}>
        {item.title}
      </Text>
      <Text style={[styles.promotionText, { color: isDarkMode ? '#AAA' : '#555' }]}>
        Start Date: {item.startDate.toLocaleString()}
      </Text>
      <Text style={[styles.promotionText, { color: isDarkMode ? '#AAA' : '#555' }]}>
        Time Remaining: {item.timeRemaining}
      </Text>
      <Text
        style={[styles.promotionDescription, { color: isDarkMode ? '#CCC' : '#333' }]}
      >
        {item.description}
      </Text>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#121212' : '#F5F5F5' },
      ]}
    >
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
        ListEmptyComponent={
          <Text style={{ color: isDarkMode ? '#AAA' : '#555', textAlign: 'center', marginTop: 20 }}>
            No promotions available right now.
          </Text>
        }
      />

      <View style={{ marginVertical: 10 }}>
        <Button title="Start Your Journey" onPress={() => router.push('/Rider/RiderMap')} />
      </View>

      <View
        style={[
          styles.pointsContainer,
          { backgroundColor: isDarkMode ? '#333' : '#fff' },
        ]}
      >
        <Text style={[styles.pointsText, { color: isDarkMode ? '#FFF' : '#000' }]}>
          Your Accumulated Points: {accumulatedPoints}
        </Text>
        <View style={styles.pointsOptions}>
          <TouchableOpacity>
            <Text style={[styles.pointsOption, { color: isDarkMode ? '#1E90FF' : '#007AFF' }]}>
              Spend on Special Deals
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={[styles.pointsOption, { color: isDarkMode ? '#1E90FF' : '#007AFF' }]}>
              Convert to In-App Credits
            </Text>
          </TouchableOpacity>
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
