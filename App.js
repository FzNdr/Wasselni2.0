import AppProvider from './context/AppContext';
import AppNavigator from 'app/navigation/AppNavigator';

export default function App() {
  return (
    <AppProvider>
      <AppNavigator />
    </AppProvider>
  );
}