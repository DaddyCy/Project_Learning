import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="container mt-5 text-center">
      <h1>404 - Pagina non trovata</h1>
      <p>La pagina che stai cercando non esiste.</p>
      <Link to="/" className="btn btn-secondary">Torna alla Home</Link>
    </div>
  );
};

export default NotFoundPage;