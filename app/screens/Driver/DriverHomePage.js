import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

const DriverHomePage = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const [promotions, setPromotions] = useState([]);
  const [accumulatedPoints, setAccumulatedPoints] = useState(250); // Example points

  useEffect(() => {
    const driverPromotions = [
      {
        id: '1',
        title: 'Boost Zone: Airport Area',
        description:
          'Earn 2.5x fares for trips starting at the Airport between 4 PM - 8 PM.',
        startDate: new Date('2025-05-15T16:00:00'),
        durationHours: 4,
      },
      {
        id: '2',
        title: '10-Ride Completion Bonus',
        description:
          'Complete 10 rides today and earn an additional $20 bonus.',
        startDate: new Date('2025-05-15T00:00:00'),
        durationHours: 24,
      },
      {
        id: '3',
        title: 'Fuel Discount Partner Offer',
        description:
          'Get 10% off at partnered gas stations for the next 48 hours.',
        startDate: new Date('2025-05-14T08:00:00'),
        durationHours: 48,
      },
      {
        id: '4',
        title: 'Evening Rush Challenge',
        description:
          'Earn $5 extra per ride during 6 PM – 9 PM today.',
        startDate: new Date('2025-05-15T18:00:00'),
        durationHours: 3,
      },
    ];

    const now = new Date();
    const promotionsWithTimeRemaining = driverPromotions.map((promo) => {
      const endDate = new Date(promo.startDate);
      endDate.setHours(endDate.getHours() + promo.durationHours);
      const diffMs = endDate - now;
      const remaining =
        diffMs <= 0
          ? 'Expired'
          : `${Math.floor(diffMs / 3600000)}h ${Math.floor(
            (diffMs % 3600000) / 60000
          )}m`;
      return {
        ...promo,
        timeRemaining: remaining,
      };
    });

    setPromotions(promotionsWithTimeRemaining);
  }, []);

  const handleProfileNavigation = () => {
    router.push('/screens/Profile/ProfileScreen');
  };

  const renderPromotionItem = ({ item }) => (
    <View
      style={[
        styles.promotionItem,
        { backgroundColor: isDarkMode ? '#222' : '#FFF' },
      ]}
    >
      <Text
        style={[
          styles.promotionName,
          { color: isDarkMode ? '#FFF' : '#000' },
        ]}
      >
        {item.title}
      </Text>
      <Text
        style={[
          styles.promotionText,
          { color: isDarkMode ? '#AAA' : '#555' },
        ]}
      >
        Start Date: {item.startDate.toLocaleString()}
      </Text>
      <Text
        style={[
          styles.promotionText,
          { color: isDarkMode ? '#AAA' : '#555' },
        ]}
      >
        Time Remaining: {item.timeRemaining}
      </Text>
      <Text
        style={[
          styles.promotionDescription,
          { color: isDarkMode ? '#CCC' : '#333' },
        ]}
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
      <TouchableOpacity
        style={styles.profileButton}
        onPress={handleProfileNavigation}
      >
        <Ionicons
          name="person-circle"
          size={50}
          color={isDarkMode ? '#FFF' : '#000'}
        />
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
      <View>  
              <Button title="Start Your Journey" onPress={() => router.push('/screens/Rider/RiderMap')} />
      </View>
      <View

        style={[
          styles.pointsContainer,
          { backgroundColor: isDarkMode ? '#333' : '#fff' },
        ]}
      >

        <Text
          style={[styles.pointsText, { color: isDarkMode ? '#FFF' : '#000' }]}
        >
          Your Accumulated Points: {accumulatedPoints}
        </Text>
        <View style={styles.pointsOptions}>
          <Text
            style={[
              styles.pointsOption,
              { color: isDarkMode ? '#1E90FF' : '#007AFF' },
            ]}
          >
            Spend on Special Deals
          </Text>
          <Text
            style={[
              styles.pointsOption,
              { color: isDarkMode ? '#1E90FF' : '#007AFF' },
            ]}
          >
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

export default DriverHomePage;
