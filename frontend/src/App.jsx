
import Dashboard from './pages/Dashboard';
import Workspace from './pages/Workspace';
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import '@mantine/core/styles.css';
import './App.css';
import { NavbarNested, HeaderSimple } from './lib';
import Login from './pages/Login';
import HomePage from './pages/HomePage'; // Create a HomePage component
import { auth } from './firebase'; // Assuming you have a Firebase authentication setup

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track authentication status

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user); // Update isLoggedIn state based on the presence of user
    });

    return () => unsubscribe(); // Unsubscribe from the listener when component unmounts
  }, []);

  return (
    <>
      {!isLoggedIn ? ( // If not logged in
        <Routes>
          <Route path="/" element={<HomePage />} /> {/* Home page */}
          <Route path="/login" element={<Login />} /> {/* Login page */}
          <Route path="*" element={<Navigate to="/" />} /> {/* Redirect to home for other routes */}
        </Routes>
      ) : ( // If logged in
        <div className="main-content">
          <div className="sidebar">
            <NavbarNested /> {/* Sidebar content */}
          </div>
          <div className="header">
            <HeaderSimple /> {/* Header content */}
          </div>
          <div className="routes-content">
            <Routes>
              <Route path="/workspace" element={<Dashboard />} />
              <Route path="/workspace/:id" element={<Workspace />} /> {/* Add the Workspace route */}
              {/* Add more routes as needed */}
            </Routes>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
