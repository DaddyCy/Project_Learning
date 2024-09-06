import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { getStudentDetails } from '../services/AxiosApi';
import StudentDashboard from '../components/StudentDashboard';
import EnrolledCourses from '../components/EnrolledCourses';
import StudentProfile from '../components/StudentProfile';
import Footer from '../components/Footer';
import LogoutButton from '../components/LogoutButton';

const StudentPage = () => {
  const [studentDetails, setStudentDetails] = useState(null);

  useEffect(() => {
    fetchStudentDetails();
  }, []);

  const fetchStudentDetails = async () => {
    try {
      const response = await getStudentDetails();
      setStudentDetails(response.data);
    } catch (error) {
      console.error('Error fetching student details:', error);
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/student">Student Dashboard</Link>
          <div className="navbar-nav">
            <Link className="nav-link" to="/student">Dashboard</Link>
            <Link className="nav-link" to="/student/courses">My Courses</Link>
            <Link className="nav-link" to="/student/profile">Profile</Link>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        {studentDetails && (
          <h2>Welcome, {studentDetails.nome} {studentDetails.cognome}</h2>
        )}
        <Routes>
          <Route path="/" element={<StudentDashboard />} />
          <Route path="/courses" element={<EnrolledCourses />} />
          <Route path="/profile" element={<StudentProfile />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default StudentPage;