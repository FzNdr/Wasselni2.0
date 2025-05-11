import { createContext, useState } from 'react';

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [rideStatus, setRideStatus] = useState('idle');
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


