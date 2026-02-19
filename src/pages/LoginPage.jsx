import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/authService';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Email o Password mancanti');
      return;
    }

    setIsLoading(true);

    try {
      const data = await login(formData.email, formData.password);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/profile');
    } catch (err) {
      if (err.response) {
        const serverMessage =
          err.response.data.message || err.response.data.error || 'Credenziali non valide.';
        setError(serverMessage);
      } else if (err.request) {
        setError('Impossibile contattare il server. Controlla la tua connessione.');
      } else {
        setError('Si è verificato un errore imprevisto.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='login-page-container'>
      <div className='login-card'>
        <h1 className='login-title'>Bentornato!</h1>
        <p className='login-subtitle'>Accedi per continuare</p>

        <form onSubmit={handleSubmit} className='login-form'>
          <div className='input-group'>
            <label>Email</label>
            <input
              type='text'
              name='email'
              value={formData.email}
              onChange={handleChange}
              placeholder='Il tuo indirizzo email'
            />
          </div>

          <div className='input-group'>
            <label>Password</label>
            <input
              type='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              placeholder='La tua password'
            />
          </div>

          {error && <p className='error-message'>{error}</p>}

          <button type='submit' className='login-btn-page'>
            Accedi
          </button>
        </form>

        <button className='link-btn' onClick={() => navigate('/register')}>
          Password dimenticata?
        </button>

        <div className='login-footer'>
          <p>Non sei ancora registrato?</p>
          <button className='link-btn' onClick={() => navigate('/register')}>
            Registrati qui
          </button>
        </div>

        <button className='back-home-btn' onClick={() => navigate('/')}>
          Torna alla Home
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
