import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import GuildConfig from './components/GuildConfig';
import Navbar from './components/Navbar';
import OAuth2Callback from './components/OAuth2Callback';

function App() {
  const isLoggedIn = !!localStorage.getItem('token');
  console.log("isLoggedIn", isLoggedIn);
  return (
    <Router>
      {isLoggedIn && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/guild/:guildId" element={isLoggedIn ? <GuildConfig /> : <Navigate to="/login" />} />
        <Route path="/oauth/callback" element={<OAuth2Callback />} />
        <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App; 