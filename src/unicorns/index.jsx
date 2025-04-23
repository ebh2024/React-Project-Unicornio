import React, { Suspense, lazy } from 'react';
import { UnicornContext } from "../context/UnicornContext";

const UnicornsContainer = lazy(() => import('./UnicornsContainer'));
const LoadingFallback = () => <div>Cargando...</div>;

export { UnicornContext };
export default function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <UnicornsContainer />
    </Suspense>
  );
}
