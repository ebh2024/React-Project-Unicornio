import React, { useRef, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import { UnicornProvider } from "./context/UnicornContext";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/soho-dark/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

import './styles.css';

const LoadingFallback = () => <div className="loading-container">Cargando...</div>;

const Home = lazy(() => import("./components/Home"));
const UnicornsContainer = lazy(() => import("./unicorns"));
const UnicornsView = lazy(() => import("./unicorns/UnicornsView"));
const CreateUnicornView = lazy(() => import("./unicorns/CreateUnicornView"));
const EditUnicornView = lazy(() => import("./unicorns/EditUnicornView"));
const ProductsView = lazy(() => import("./products/ProductsView"));

const App = () => {
  const toast = useRef(null);
  return (
    <PrimeReactProvider>
      <UnicornProvider>
        <Router>
          <div className="app-container">
            <Toast ref={toast} position="top-right" />
            
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/unicornios" element={<UnicornsContainer />} />
              <Route path="/unicornios/ver/:id" element={<UnicornsView />} />
              <Route path="/crear-unicornio" element={<CreateUnicornView />} />
              <Route path="/editar-unicornio/:id" element={<EditUnicornView />} />
              <Route path="/productos" element={<ProductsView />} />
            </Routes>
            </Suspense>
          </div>
        </Router>
      </UnicornProvider>
    </PrimeReactProvider>
  );
};

export default React.memo(App);
