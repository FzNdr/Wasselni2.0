import { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null); // 'rider' or 'driver'
  const [rideStatus, setRideStatus] = useState('idle'); // 'idle', 'requested', 'in_progress', 'completed'
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);

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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;


