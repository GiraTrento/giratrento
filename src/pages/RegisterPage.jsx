import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please complete the form before proceding.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    console.log('Dati registrazione:', formData);
    alert('Registration successful!');

    navigate('/');
  };

  return (
    <div className='register-container'>
      <div className='register-card'>
        <h1 className='register-title'>Create an Account</h1>
        <p className='register-subtitle'>Join us today</p>

        <form onSubmit={handleSubmit} className='register-form'>
          <div className='input-group'>
            <label>Full Name</label>
            <input
              type='text'
              name='name'
              value={formData.name}
              onChange={handleChange}
              placeholder='John Smith'
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
            <label>Confirm Password</label>
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
            Register
          </button>
        </form>

        <div className='register-footer'>
          <p>Already have an account?</p>
          <button className='link-btn' onClick={() => navigate('/login')}>
            Login
          </button>
        </div>

        <button className='back-home-btn' onClick={() => navigate('/')}>
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;
