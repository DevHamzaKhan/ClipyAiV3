import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="container">
      <h1 className="title-big">Welcome to Clipy AI</h1>
      <h2 className="title-medium">AI-powered Video Search</h2>
      <p className="description">Type your thoughts and instantly get relevant timestamps</p>
      <Link to="/login">
        <button className="button">Get Started</button>
      </Link>
    </div>
  );
};

export default HomePage;
