import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { AppContext } from '../../contexts/AppContext';

const RidesHistoryScreen = () => {
  const { userInfo, userRole } = useContext(AppContext);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRides = async () => {
      if (!userInfo?.id || !userRole) {
        setError('User not authenticated or role missing.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `http://localhost/api/rides/history?userId=${userInfo.id}&role=${userRole}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch rides history');
        }

        const data = await response.json();
        setRides(data.rides || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [userInfo, userRole]);

  const renderRideItem = ({ item }) => (
    <View style={styles.rideItem}>
      <Text style={styles.rideDate}>{new Date(item.date).toLocaleString()}</Text>
      <Text style={styles.rideInfo}>From: {item.pickupLocation}</Text>
      <Text style={styles.rideInfo}>To: {item.dropoffLocation}</Text>
      <Text style={styles.rideStatus}>Status: {item.status}</Text>
      <Text style={styles.rideFare}>
        Fare: {typeof item.fare === 'number' ? `$${item.fare.toFixed(2)}` : 'N/A'}
      </Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" style={styles.centered} />;
  }

  if (error) {
    return <Text style={[styles.centered, styles.error]}>{error}</Text>;
  }

  if (rides.length === 0) {
    return <Text style={styles.centered}>No rides history available.</Text>;
  }

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={rides}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderRideItem}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  rideItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  rideDate: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  rideInfo: {
    fontSize: 14,
  },
  rideStatus: {
    marginTop: 8,
    fontStyle: 'italic',
  },
  rideFare: {
    marginTop: 4,
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  error: {
    color: 'red',
  },
});

export default RidesHistoryScreen;
