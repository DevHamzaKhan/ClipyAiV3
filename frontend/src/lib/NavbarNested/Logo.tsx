import React from 'react';
import clipyAiLogo from './clipylogo.jpg';
import './Logo.css'; // Ensure this is the correct path to your CSS file

export const Logo = ({ style }) => (
  <div className="logo" style={style}>
    <img src={clipyAiLogo} alt="Clipy AI Logo" className="logo-image" />
    <span className="logo-text">Clipy AI</span>
  </div>
);
