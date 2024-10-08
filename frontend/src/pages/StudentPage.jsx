import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { getStudentDetails, getAllCourses } from '../services/AxiosApi.js';
import StudentDashboard from '../components/StudentDashboard.jsx';
import EnrolledCourses from '../components/EnrolledCourse.jsx';
import StudentProfile from '../components/StudentProfile.jsx';
import Footer from '../components/Footer.jsx';
import LogoutButton from '../components/LogoutButton.jsx';

const StudentPage = () => {
  const [studentDetails, setStudentDetails] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchStudentDetails = useCallback(async () => {
    try {
      const response = await getStudentDetails();
      setStudentDetails(response.data);
    } catch (error) {
      console.error('Error fetching student details:', error);
    }
  }, []);

  const fetchCourses = useCallback(async () => {
    try {
      const response = await getAllCourses();
      if (response.data && Array.isArray(response.data.courses)) {
        setCourses(response.data.courses);
      } else {
        console.error('Invalid course data structure:', response.data);
        setCourses([]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchStudentDetails(), fetchCourses()]);
      setLoading(false);
    };

    fetchData();
  }, [fetchStudentDetails, fetchCourses]);

  useEffect(() => {
    // Aggiorna i dettagli dello studente ogni volta che si cambia route
    if (location.pathname === '/student') {
      fetchStudentDetails();
    }
  }, [location, fetchStudentDetails]);

  const handleAvatarClick = () => {
    navigate('/student');
  };

  if (loading) {
    return <div>Caricamento in corso...</div>;
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light mb-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
        <div className="container">
          {studentDetails && (
            <span className="navbar-brand" onClick={handleAvatarClick} style={{ cursor: 'pointer' }}>
              {studentDetails.avatar ? (
                <img
                  src={studentDetails.avatar}
                  alt="Avatar"
                  style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }}
                />
              ) : null}
              Benvenuto, {studentDetails.nome} {studentDetails.cognome}
            </span>
          )}
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link to="/student/profile" className="nav-link" style={{ fontSize:'18px' }}>Profilo</Link>
              </li>
              <li className="nav-item">
                <Link to="/student/courses" className="nav-link" style={{ fontSize:'18px' }}>I Miei Corsi</Link>
              </li>
              <li className="nav-item mt-2 ms-1">
                <LogoutButton/>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<StudentDashboard courses={courses} />} />
          <Route path="/courses" element={<EnrolledCourses />} />
          <Route path="/profile" element={<StudentProfile onProfileUpdate={fetchStudentDetails} />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default StudentPage;