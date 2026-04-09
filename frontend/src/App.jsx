import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, SocketProvider, LocationProvider, AuthContext } from './context/AppProviders';
import SplashScreen from './components/SplashScreen';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import AnalyticsHub from './pages/AnalyticsHub';
import Weather from './pages/Weather';
import AQI from './pages/AQI';
import Traffic from './pages/Traffic';
import Energy from './pages/Energy';
import Water from './pages/Water';
import Alerts from './pages/Alerts';
import PublicServices from './pages/PublicServices';
import News from './pages/News';
import Feedback from './pages/Feedback';
import Waste from './pages/Waste';
import Emergency from './pages/Emergency';
import Complaint from './pages/Complaint';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <AuthProvider>
      <SocketProvider>
        <LocationProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<AnalyticsHub />} />
                <Route path="weather" element={<Weather />} />
                <Route path="aqi" element={<AQI />} />
                <Route path="traffic" element={<Traffic />} />
                <Route path="energy" element={<Energy />} />
                <Route path="water" element={<Water />} />
                <Route path="waste" element={<Waste />} />
                <Route path="emergency" element={<Emergency />} />
                <Route path="complaint" element={<Complaint />} />
                <Route path="alerts" element={<Alerts />} />
                <Route path="services" element={<PublicServices />} />
                <Route path="news" element={<News />} />
                <Route path="feedback" element={<Feedback />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </LocationProvider>
      </SocketProvider>
    </AuthProvider>
  );
};

export default App;
