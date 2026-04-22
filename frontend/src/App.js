import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ComplaintForm from './pages/ComplaintForm';
import StatusTracker from './pages/StatusTracker';
import Navbar from './components/Navbar';
import { AuthProvider, useAuth } from './services/AuthContext';
import './App.css';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    mode: 'light'
  },
  typography: {
    fontFamily: 'Inter, sans-serif'
  }
});

function AppContent() {
  const { user, token } = useAuth();

  return (
    <div className="App">
      {token && <Navbar />}
      <Routes>
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!token ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/complaint/new" element={token ? <ComplaintForm /> : <Navigate to="/login" />} />
        <Route path="/complaint/:id" element={token ? <StatusTracker /> : <Navigate to="/login" />} />
        <Route path="/feedback/:id" element={<div>Feedback Form Coming Soon</div>} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
