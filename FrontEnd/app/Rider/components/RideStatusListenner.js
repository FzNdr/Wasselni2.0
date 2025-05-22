// app/screens/Rider/components/RideStatusListener.js

import { useEffect, useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';

const RideStatusListenner = ({ userId }) => {
  const { rideStatus, setRideStatus } = useContext(AppContext);

  useEffect(() => {
    if (!userId) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/ride-status/${userId}`);
        const data = await response.json();
        if (data?.status && data.status !== rideStatus) {
          setRideStatus(data.status);
        }
      } catch (error) {
        console.error('Error fetching ride status:', error);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [userId]);

  return null;
};

export default RideStatusListenner;
