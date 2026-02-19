import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Missing email or password.');
      return;
    }

    if (formData.email === 'admin' && formData.password === '1234') {
      alert('Login effettuato!');
      navigate('/');
    } else {
      setError('Credenziali non valide (usa admin / 1234)');
    }
  };

  return (
    <div className='login-page-container'>
      <div className='login-card'>
        <h1 className='login-title'>Welcome Back!</h1>
        <p className='login-subtitle'>Log in to continue</p>

        <form onSubmit={handleSubmit} className='login-form'>
          <div className='input-group'>
            <label>Email</label>
            <input
              type='text'
              name='email'
              value={formData.email}
              onChange={handleChange}
              placeholder='Your email address'
            />
          </div>

          <div className='input-group'>
            <label>Password</label>
            <input
              type='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              placeholder='Your password'
            />
          </div>

          <button className='link-btn' onClick={() => navigate('/register')}>
            Forgot your password?
          </button>

          {error && <p className='error-message'>{error}</p>}

          <button type='submit' className='login-btn-page'>
            Login
          </button>
        </form>

        <div className='login-footer'>
          <p>Not registered yet?</p>
          <button className='link-btn' onClick={() => navigate('/register')}>
            Register here
          </button>
        </div>

        <button className='back-home-btn' onClick={() => navigate('/')}>
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
