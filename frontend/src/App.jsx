import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation,
  Navigate
} from 'react-router-dom';
import './css/style.css';
import './charts/ChartjsConfig';

// Import pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

function App() {

  const location = useLocation();
  const isLogged = window.localStorage.getItem("LoggedIn");

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto';
    window.scroll({ top: 0 });
    document.querySelector('html').style.scrollBehavior = '';
  }, [location.pathname]); // triggered on route change

  return (
    <>
      <Routes>
        {isLogged ? (
          <Route path="*" element={<Dashboard />} />
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
