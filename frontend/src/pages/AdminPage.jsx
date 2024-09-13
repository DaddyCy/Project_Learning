import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { getAdminDetails } from '../services/AxiosApi.js';
import AdminDashboard from '../components/AdminDashboard.jsx';
import CourseManagement from '../components/CourseManagment.jsx';
import StudentManagement from '../components/StudentManagment.jsx';
import Footer from '../components/Footer.jsx';
import LogoutButton from '../components/LogoutButton.jsx';
import { FaHome, FaBook, FaUsers } from 'react-icons/fa';

const AdminPage = () => {
  const [adminDetails, setAdminDetails] = useState(null);

  useEffect(() => {
    fetchAdminDetails();
  }, []);

  const fetchAdminDetails = async () => {
    try {
      const response = await getAdminDetails();
      setAdminDetails(response.data);
    } catch (error) {
      console.error('Error fetching admin details:', error);
    }
  };

  const iconStyle = { fontSize: '1.5rem', marginRight: '5px' };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid ms-2">
          {adminDetails && (
            <span className="navbar-brand">Benvenuto, {adminDetails.nome} {adminDetails.cognome}</span>
          )}
          <div className="navbar-nav  me-4">
            <Link className="nav-link mx-3" to="/admin" title="Dashboard">
              <FaHome style={iconStyle} />
            </Link>
            <Link className="nav-link" to="/admin/courses" title="Manage Courses">
              <FaBook style={iconStyle} />
            </Link>
            <Link className="nav-link mx-3" to="/admin/students" title="Manage Students">
              <FaUsers style={iconStyle} />
            </Link>
            <div className='pt-2'>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/courses" element={<CourseManagement />} />
          <Route path="/students" element={<StudentManagement />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default AdminPage;