import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div className="container mt-5">
      <h1>Accesso non autorizzato</h1>
      <p>Non hai il permesso per accedere a questa pagina.</p>
      <Link to="/" className="btn btn-primary">Torna alla Home</Link>
    </div>
  );
};

export default UnauthorizedPage;