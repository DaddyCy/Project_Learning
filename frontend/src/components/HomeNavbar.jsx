import React from 'react';
import { Link } from 'react-router-dom';

const HomeNavbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Course Platform</Link>
        <div className="navbar-nav">
          <Link className="nav-link" to="/login">Login</Link>
          <Link className="nav-link" to="/register">Register</Link>
        </div>
      </div>
    </nav>
  );
};

export default HomeNavbar;