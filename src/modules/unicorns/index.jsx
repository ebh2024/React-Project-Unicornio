import React from 'react';
import { Route, Routes } from 'react-router-dom';
import UnicornsView from './UnicornsView'; // Updated path
import UnicornForm from './UnicornForm'; // Updated path

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
