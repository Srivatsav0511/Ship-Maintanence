import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import Layout from './components/Layout';
import KPI from './pages/KPI';
import Ships from './pages/Ships';
import Components from './pages/Components';
import Maintenance from './pages/Maintenance';
import Login from './pages/Login';
import Calendar from './pages/Calendar';
import Dashboard from './pages/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { authService } from './services/authService';
import { NotificationProvider } from './context/NotificationContext';
import NotificationCenter from './components/NotificationCenter';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2'
    },
    secondary: {
      main: '#dc004e'
    }
  }
});

function App() {
  localStorage.clear(); // TEMP: Always start at login page for development/testing
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = () => {
      const auth = authService.isAuthenticated();
      setIsAuthenticated(auth);
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <NotificationCenter />
        <Router>
          <Routes>
            {/* Root route - Login */}
            <Route 
              path="/" 
              element={
                isAuthenticated ? (
                  <Navigate to="/ships" replace />
                ) : (
                  <Login onLoginSuccess={() => setIsAuthenticated(true)} />
                )
              } 
            />

            {/* Protected routes */}
            <Route
              path="/kpi"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Layout>
                    <KPI />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/ships"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Layout>
                    <Ships />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/components"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Layout>
                    <Components />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/maintenance"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Layout>
                    <Maintenance />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Layout>
                    <Calendar />
                  </Layout>
                </ProtectedRoute>
              }
            />
            {/* Catch all route - redirect to login if not authenticated */}
            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Routes>
        </Router>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
