import React from 'react';

const HomeView = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#f0f0f0'
    }}>
      <h1 style={{
        fontSize: '3em',
        marginBottom: '20px',
        color: '#333'
      }}>¡Bienvenido a la aplicación Unicorn CRUD!</h1>
      <p style={{
        fontSize: '1.2em',
        marginBottom: '30px',
        color: '#666'
      }}>Haga clic en el enlace a continuación para administrar unicornios</p>
      <a href="/unicornios" style={{
        fontSize: '1.5em',
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: '5px'
      }}>Administrar unicornios</a>
    </div>
  );
};

export default HomeView;
