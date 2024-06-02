import React from 'react';
import { Routes, Route } from 'react-router-dom';
import '@mantine/core/styles.css';
import './App.css';
import { NavbarNested, HeaderMegaMenu } from './lib';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Workspace from './pages/Workspace'; 

function App() {
  return (
    <>
      <div className="main-content">
        <div className="sidebar">
          <NavbarNested /> {/* Sidebar content */}
        </div>
        <div className="routes-content">
          <Routes>
            <Route path="/workspace" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/workspace/:id" element={<Workspace />} /> {/* Add the Workspace route */}
            {/* Add more routes as needed */}
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
