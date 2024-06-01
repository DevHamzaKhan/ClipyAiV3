import React from 'react';
import { Routes, Route } from 'react-router-dom';
import '@mantine/core/styles.css';
import './App.css';
import { NavbarNested, HeaderMegaMenu } from './lib';
import Login from './pages/Login';

function App() {
  return (
    <>
      <div className="main-content">
        <div className="sidebar">
          <NavbarNested /> {/* Sidebar content */}
        </div>
        <div className="routes-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            {/* Add more routes as needed */}
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
