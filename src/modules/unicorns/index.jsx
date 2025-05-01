import React from 'react';
import { Route, Routes } from 'react-router-dom';
import UnicornsView from '../../views/UnicornsView';
import UnicornForm from '../../components/UnicornForm';

const UnicornModule = () => {
  return (
    <Routes>
      <Route path="/" element={<UnicornsView />} />
      <Route path="/crear" element={<UnicornForm />} />
      <Route path="/editar/:id" element={<UnicornForm />} />
    </Routes>
  );
};

export default UnicornModule;
