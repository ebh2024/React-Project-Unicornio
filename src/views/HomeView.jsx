import React from 'react';
import './HomeView.css';

const HomeView = () => {
  return (
    <div className="home-view-container">
      <h1 className="home-view-title">¡Bienvenido a la Aplicación!</h1>
      <p className="home-view-text">Haga clic en los enlaces a continuación para administrar unicornios o productos.</p>
      <a href="/unicornios" className="home-view-link">Administrar Unicornios</a>
      <a href="/productos" className="home-view-link">Administrar Productos</a>
    </div>
  );
};

export default HomeView;
