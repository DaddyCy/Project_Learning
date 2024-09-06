import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div className="container mt-5">
      <h1>Unauthorized Access</h1>
      <p>You do not have permission to access this page.</p>
      <Link to="/" className="btn btn-primary">Go to Home</Link>
    </div>
  );
};

export default UnauthorizedPage;