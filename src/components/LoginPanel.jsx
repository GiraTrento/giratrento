import React, { useState } from 'react';
import './LoginPanel.css';

const LoginPanel = ({ isOpen, onClose }) => {
  /*  const [nome, setNome] = useState('');

  const cambiaNome = (e) => {
    setNome(e.target.value);
  }; */

  return (
    <>
      <div className={`login-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
        <div className={`login-panel ${isOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
          <h1 className='login-title'>Login</h1>

          <p className='input-header'>Email:</p>
          <div className='input-group'>
            <input
              className='login-input'
              type='text'
              placeholder='Email'
              /* value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading} */
            />
          </div>

          <p className='input-header'>Password:</p>
          <div className='input-group'>
            <input
              className='login-input'
              type='password'
              placeholder='Password'
              /* value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading} 

<input className='name-textinput' type='text' value={nome} onChange={cambiaNome} />
          <p>Hai scritto: {nome}</p>
              */
            />
          </div>

          <button className='submit-btn'>Submit</button>

        </div>
      </div>
    </>
  );
};

export default LoginPanel;
