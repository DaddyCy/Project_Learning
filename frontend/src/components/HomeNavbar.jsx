import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaInfoCircle, FaSignInAlt, FaUserPlus } from "react-icons/fa";

const HomeNavbar = () => {
  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
    >
      <div className="container-fluid">
        <div className="d-flex align-items-center justify-content-between w-100">
          <Link id='logo-login' className="nav-link me-3" to="/">
            <FaHome size={30} color="white" />
          </Link>
          <div className="d-flex align-items-center">
            <Link className="nav-link me-4" to="/login" style={{
                fontSize: "15px",
                fontWeight: "bold",
                color: "rgb(0, 0, 0)",
              }}>
              <FaSignInAlt size={24} color="black" /> Login
            </Link>
            <Link
              className="navbar-brand"
              to="/"
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "rgb(229, 227, 230)",
              }}
            >
              LearnEasilyWithDave
            </Link>
            
            <Link id='logo-register' className="nav-link ms-3" to="/register" style={{
                fontSize: "15px",
                fontWeight: "bold",
                color: "rgb(0, 0, 0)",
              }}>
              <FaUserPlus size={24} color="black" /> Register
            </Link>
          </div>

          <Link className="nav-link ms-3" to="/about">
            <FaInfoCircle size={30} color="white" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default HomeNavbar;
