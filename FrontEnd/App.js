import { Slot } from 'expo-router';
import AppProvider from './context/AppContext';

export default function App() {
  return (
    <AppProvider>
      <Slot />
    </AppProvider>
  );
}
