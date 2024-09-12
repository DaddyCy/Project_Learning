import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/AxiosApi.js";
import { FaArrowLeft } from "react-icons/fa";

const Register = () => {
  const [userData, setUserData] = useState({
    nome: "",
    cognome: "",
    email: "",
    password: "",
    dataNascita: "",
    ruolo: "student",
  });
  
  const [minDate, setMinDate] = useState(""); // Definisce lo stato della data di nascita(min)
  const [maxDate, setMaxDate] = useState(""); // Definisce lo stato della data di nascita(max)
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    
    const today = new Date();
    // Calcola la data minima (16 anni fa da oggi)
    const minDateAccept = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
    setMinDate(minDateAccept.toISOString().split('T')[0]);
    // Calcola la data massima (130 anni  da oggi)
    const maxDateAccept = new Date(today.getFullYear() - 130, today.getMonth(), today.getDate());
    setMaxDate(maxDateAccept.toISOString().split('T')[0]);
  }, []);
  
  
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(userData);
      navigate("/login");
    } catch (error) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <Link to="/" className="mb-3 btn btn-outline-light">
        <FaArrowLeft /> Back to Home
      </Link>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="row mt-5">
          <div className="col-md-6 mb-3">
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
          <div className="col-md-6 mb-3">
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
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
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
          <div className="col-md-6 mb-3">
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
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="dataNascita" className="form-label">Data di Nascita</label>
            <input
              type="date"
              className="form-control"
              id="dataNascita"
              name="dataNascita"
              value={userData.dataNascita}
              onChange={handleChange}
              min={maxDate}
              max={minDate}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
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
        </div>

        <button type="submit" className="mt-3 btn btn-outline-dark">Register</button>
      </form>
    </div>
  );
};

export default Register;


