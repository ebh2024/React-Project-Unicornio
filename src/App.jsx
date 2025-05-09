import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeView from './views/HomeView';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { UnicornProvider } from './modules/unicorns/context/UnicornContext'; // Updated path
import { ToastProvider } from './contexts/ToastContext';
import { ConfirmDialog } from 'primereact/confirmdialog'; // Import ConfirmDialog
import UnicornModule from './modules/unicorns';
import ProductsModule from './modules/products';
import AnimatedOutlet from './components/AnimatedOutlet'; // Import AnimatedOutlet

// This component will wrap the routes that need animation
const AppLayout = () => {
  // location is handled by AnimatedOutlet internally
  return (
    // The key on Routes or a wrapping div is important for AnimatePresence
    // However, with AnimatedOutlet, the key is handled inside it.
    // We might need to adjust how AnimatedOutlet is used if direct children of Routes are animated.
    // For now, let's assume AnimatedOutlet handles its children correctly.
    <AnimatedOutlet />
  );
};

function App() {
  return (
    <ToastProvider>
      <ConfirmDialog /> {/* Add ConfirmDialog globally */}
      <BrowserRouter>
        <Routes>
          {/* Wrap element with AppLayout which contains AnimatedOutlet */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomeView />} />
            <Route path="/unicornios/*" element={
              <UnicornProvider>
                <UnicornModule />
              </UnicornProvider>
            } />
            <Route path="/productos/*" element={<ProductsModule />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
