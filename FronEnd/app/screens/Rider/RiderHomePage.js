import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, useEffect, useContext } from 'react';
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  ActivityIndicator,
} from 'react-native';
import RideStatusListener from './components/RideStatusListener'; // Adjust path if needed
import { AppContext } from '../contexts/AppContext'; // Adjust path if needed

const RiderHomePage = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const { userInfo } = useContext(AppContext);
  const userId = userInfo?.id;
  const userRole = userInfo?.role || 'rider';

  const [promotions, setPromotions] = useState([]);
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        // Fetch promotions filtered by role
        const promoResponse = await fetch(`http://localhost/api/promotions?role=${userRole}`);
        const promoData = await promoResponse.json();

        // Fetch user credits
        const creditsResponse = await fetch(`http://localhost/api/users/${userId}/credits`);
        const creditsData = await creditsResponse.json();

        setPromotions(promoData);
        setCredits(creditsData.credits);
      } catch (error) {
        console.error('Error fetching promotions or credits:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, userRole]);

  const handleProfileNavigation = () => {
    router.push('/screens/Profile/ProfileScreen');
  };

  const renderPromotionItem = ({ item }) => (
    <View style={[styles.promotionItem, { backgroundColor: isDarkMode ? '#222' : '#FFF' }]}>
      <Text style={[styles.promotionName, { color: isDarkMode ? '#FFF' : '#000' }]}>{item.name}</Text>
      <Text style={[styles.promotionText, { color: isDarkMode ? '#AAA' : '#555' }]}>Start Date: {item.start_date}</Text>
      <Text style={[styles.promotionText, { color: isDarkMode ? '#AAA' : '#555' }]}>Time Remaining: {item.time_remaining}</Text>
      <Text style={[styles.promotionDescription, { color: isDarkMode ? '#CCC' : '#333' }]}>{item.description}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: isDarkMode ? '#121212' : '#F5F5F5' }]}>
        <ActivityIndicator size="large" color={isDarkMode ? '#FFF' : '#000'} />
      </View>
    );
  }

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
        ListEmptyComponent={<Text style={{ color: isDarkMode ? '#AAA' : '#555', textAlign: 'center', marginTop: 20 }}>No promotions available right now.</Text>}
      />

      <Button title="Start Your Journey" onPress={() => router.push('/screens/Rider/RiderMap')} />

      <View style={[styles.creditsContainer, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
        <Text style={[styles.creditsText, { color: isDarkMode ? '#FFF' : '#000' }]}>Your Credits: {credits ?? 0}</Text>
      </View>

      <RideStatusListener userId={userId} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 20, paddingHorizontal: 20, paddingBottom: 40 },
  profileButton: { position: 'absolute', top: 20, right: 20, zIndex: 10 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  promotionsList: { marginBottom: 20 },
  promotionItem: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  promotionName: { fontSize: 18, fontWeight: 'bold' },
  promotionText: { fontSize: 14, marginTop: 5 },
  promotionDescription: { marginTop: 10, fontSize: 14, fontStyle: 'italic' },

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
  creditsContainer: {
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  creditsText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RiderHomePage;
