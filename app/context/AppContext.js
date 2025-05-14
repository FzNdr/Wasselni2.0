import { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null); // 'rider' or 'driver'
  const [rideStatus, setRideStatus] = useState('idle'); // 'idle', 'requested', 'in_progress', 'completed'
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);

  // NEW: Add userInfo for ProfileScreen
  const [userInfo, setUserInfo] = useState(null); // This will hold the user's data

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        rideStatus,
        setRideStatus,
        pickupLocation,
        setPickupLocation,
        dropoffLocation,
        setDropoffLocation,
        userInfo,
        setUserInfo, // <-- Make sure to expose this too
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
