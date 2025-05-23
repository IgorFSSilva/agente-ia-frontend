// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // ✅ Corrigido: sem BrowserRouter aqui
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import Agente from './Agente';
import MeusAgentes from './MeusAgentes';
import './App.css';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <div className="app-container">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/agente"
          element={isAuthenticated ? <Agente /> : <Navigate to="/login" />}
        />
        <Route
          path="/meus-agentes"
          element={isAuthenticated ? <MeusAgentes /> : <Navigate to="/login" />}
        />
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />}
        />
      </Routes>
    </div>
  );
}

export default App;
