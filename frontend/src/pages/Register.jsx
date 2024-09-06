import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/AxiosApi';

const Register = () => {
  const [userData, setUserData] = useState({
    nome: '',
    cognome: '',
    email: '',
    password: '',
    dataNascita: '',
    ruolo: 'student' // default to student
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(userData);
      navigate('/login');
    } catch (error) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nome" className="form-label">Nome</label>
          <input
            type="text"
            className="form-control"
            id="nome"
            name="nome"
            value={userData.nome}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cognome" className="form-label">Cognome</label>
          <input
            type="text"
            className="form-control"
            id="cognome"
            name="cognome"
            value={userData.cognome}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="dataNascita" className="form-label">Data di Nascita</label>
          <input
            type="date"
            className="form-control"
            id="dataNascita"
            name="dataNascita"
            value={userData.dataNascita}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="ruolo" className="form-label">Ruolo</label>
          <select
            className="form-control"
            id="ruolo"
            name="ruolo"
            value={userData.ruolo}
            onChange={handleChange}
            required
          >
            <option value="student">Studente</option>
            <option value="admin">Amministratore</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
    </div>
  );
};

export default Register;