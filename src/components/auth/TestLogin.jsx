import React from 'react';

const TestLogin = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(143deg, #E7F1FD 46.9%, #D0F3F7 73.35%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    }}>
      <h1 style={{color: 'white', fontSize: '48px', marginBottom: '20px'}}>
        Login
      </h1>
      <p style={{color: 'white', fontSize: '24px'}}>
        Welcome to Thalassic
      </p>
      <button 
        onClick={() => window.location.href = '/'}
        style={{
          marginTop: '30px',
          padding: '15px 30px',
          backgroundColor: 'white',
          border: 'none',
          borderRadius: '25px',
          fontSize: '18px',
          cursor: 'pointer'
        }}
      >
        Back to Home
      </button>
    </div>
  );
};

export default TestLogin;
