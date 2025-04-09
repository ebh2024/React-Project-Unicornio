import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';

// PrimeReact styles
import "primereact/resources/themes/soho-dark/theme.css";     // dark theme
import "primereact/resources/primereact.min.css";            // core css
import "primeicons/primeicons.css";                         // icons
import "primeflex/primeflex.css";                          // primeflex css

// Custom styles
import './styles.css';

import UnicornsContainer from "./unicorns";
import Home from "./components/Home";

function App() {
  return (
    <PrimeReactProvider>
      <Router>
        <div className="min-h-screen bg-gray-900">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/unicornios" element={<UnicornsContainer />} />
          </Routes>
        </div>
      </Router>
    </PrimeReactProvider>
  );
}

export default App;
