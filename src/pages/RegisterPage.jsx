import React from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Inter, sans-serif' }}>
      <h1>Pagina di Registrazione</h1>
      <p>Qui costruiremo il form per creare un nuovo account.</p>
      
      {/* Bottone per tornare indietro e testare la navigazione */}
      <button 
        onClick={() => navigate('/')}
        style={{ padding: '10px 20px', cursor: 'pointer', marginTop: '20px' }}
      >
        Torna alla Home
      </button>
    </div>
  );
};

export default RegisterPage;
