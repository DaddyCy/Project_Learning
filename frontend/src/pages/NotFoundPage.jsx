import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css'; 

const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>Pagina non trovata</h1>
        <Link to="/" className="btn btn-outline-dark">Torna alla Home</Link>
      </div>
    </div>
  );
};

export default NotFoundPage;