import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { FiLogOut } from 'react-icons/fi'; // Importiamo l'icona di logout

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <FiLogOut 
      onClick={handleLogout}
      style={{
        cursor: 'pointer',
        fontSize: '1.5rem',
        color: '#dc3545', // Colore rosso di Bootstrap per il danger
        verticalAlign: 'middle'
      }}
      title="Logout" // Aggiunge un tooltip al passaggio del mouse
    />
  );
};

export default LogoutButton;

