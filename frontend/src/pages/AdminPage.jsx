import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { getAdminDetails } from '../services/AxiosApi';
import AdminDashboard from '../components/AdminDashboard';
import CourseManagement from '../components/CourseManagement';
import StudentManagement from '../components/StudentManagement';
import Footer from '../components/Footer';
import LogoutButton from '../components/LogoutButton';

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

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/admin">Admin Dashboard</Link>
          <div className="navbar-nav">
            <Link className="nav-link" to="/admin">Dashboard</Link>
            <Link className="nav-link" to="/admin/courses">Manage Courses</Link>
            <Link className="nav-link" to="/admin/students">Manage Students</Link>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        {adminDetails && (
          <h2>Welcome, {adminDetails.nome} {adminDetails.cognome}</h2>
        )}
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