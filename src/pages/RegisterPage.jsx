import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/authService';
import './RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Completa il modulo per procedere.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Le password non corrispondono.');
      return;
    }

    setIsLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      navigate('/login');
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
    <div className='register-container'>
      <div className='register-card'>
        <h1 className='register-title'>Crea un Account</h1>
        <p className='register-subtitle'>Unisciti a noi</p>

        <form onSubmit={handleSubmit} className='register-form'>
          <div className='input-group'>
            <label>Nome completo</label>
            <input
              type='text'
              name='name'
              value={formData.name}
              onChange={handleChange}
              placeholder='Nome Cognome'
            />
          </div>

          <div className='input-group'>
            <label>Email</label>
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              placeholder='example@email.com'
            />
          </div>

          <div className='input-group'>
            <label>Password</label>
            <input
              type='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              placeholder='Password'
            />
          </div>

          <div className='input-group'>
            <label>Conferma password</label>
            <input
              type='password'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder='Repeat password'
              className={error === 'Passwords do not match.' ? 'input-error' : ''}
            />
          </div>

          {error && <p className='error-message'>{error}</p>}

          <button type='submit' className='register-btn'>
            Registrati
          </button>
        </form>

        <div className='register-footer'>
          <p>Hai già un account?</p>
          <button className='link-btn' onClick={() => navigate('/login')}>
            Accedi
          </button>
        </div>

        <button className='back-home-btn' onClick={() => navigate('/')}>
          Torna alla Home
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;
