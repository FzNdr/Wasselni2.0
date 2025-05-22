import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';

export default function DriverApplicationStatus() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const fetchApplications = async () => {
  try {
    const response = await fetch('http://10.0.2.2:8000/api/driver-applications');
    console.log('Status:', response.status);
    const text = await response.text();
    console.log('Raw response:', text);

    if (!response.ok) {
      throw new Error(`Network response was not ok, status: ${response.status}`);
    }

    const data = JSON.parse(text);
    console.log('Parsed data:', data);
    setApplications(data);
  } catch (e) {
    console.error('Fetch error:', e);
    setError('Failed to load applications.');
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchApplications();
  }, []);

  const renderItem = ({ item }) => {
    const statusColor =
      item.status.toLowerCase() === 'approved' ? '#4CAF50' :
      item.status.toLowerCase() === 'pending' ? '#FF9800' :
      item.status.toLowerCase() === 'denied' ? '#F44336' :
      '#000';

    return (
      <View style={styles.itemContainer}>
        <Text style={styles.id}>Application ID: #{item.id}</Text>
        <Text style={[styles.status, { color: statusColor }]}>Status: {item.status}</Text>
        <Text style={styles.submittedAt}>Submitted At: {new Date(item.submitted_at).toLocaleString()}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading applications...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={applications}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={applications.length === 0 ? styles.centered : styles.list}
      ListEmptyComponent={<Text style={styles.emptyText}>No applications found.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  id: {
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 6,
    color: '#333',
  },
  status: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  submittedAt: {
    fontSize: 14,
    color: '#666',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#007AFF',
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});
