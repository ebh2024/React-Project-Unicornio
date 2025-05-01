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
      }}>Welcome to the Unicorn CRUD App!</h1>
      <p style={{
        fontSize: '1.2em',
        marginBottom: '30px',
        color: '#666'
      }}>Click the link below to manage unicorns.</p>
      <a href="/unicornios" style={{
        fontSize: '1.5em',
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: '5px'
      }}>Manage Unicorns</a>
    </div>
  );
};

export default HomeView;
