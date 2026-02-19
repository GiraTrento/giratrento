import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import SuggestActivityPage from './pages/SuggestActivityPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />

        <Route path='/login' element={<LoginPage />} />

        <Route path='/register' element={<RegisterPage />} />

        <Route path='/profile' element={<ProfilePage />} />

        <Route path='/dashboard' element={<AdminDashboard />} />

        <Route path='/suggest' element={<SuggestActivityPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
