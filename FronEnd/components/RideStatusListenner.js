import { useEffect, useRef } from 'react';

export default function RideStatus({ userId }) {
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://YOUR_SERVER_IP:8080');

    ws.current.onopen = () => {
      // Send handshake with role and userId
      ws.current.send(JSON.stringify({ type: 'handshake', role: 'rider', userId }));
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'ride_status_update') {
        console.log('Ride status update:', message);
        // Handle the status update — e.g., update local state, notify user
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.current.close();
    };
  }, [userId]);

  return null; // or your UI
}
