import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { enrollCourse } from '../services/AxiosApi';
import { FaUserPlus, FaInfoCircle, FaArrowLeft } from 'react-icons/fa';
import './StudentDashboard.css';

const StudentDashboard = ({ courses }) => {
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const [enrollingCourse, setEnrollingCourse] = useState(null);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleEnroll = async (courseId) => {
    if (!username) {
      alert('Please enter your username');
      return;
    }
    try {
      await enrollCourse(courseId, { username });
      alert('Iscrizione al corso avvenuta con successo');
      setEnrollingCourse(null);
      setUsername('');
    } catch (error) {
      console.error('Error enrolling in course:', error);
      alert('Error enrolling in course. Please try again.');
    }
  };

  const handleViewDetails = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  return (
    <div>
      <h2 className="mb-4">Available Courses</h2>
      <div className="row">
        {Array.isArray(courses) && courses.length > 0 ? (
          courses.map(course => (
            <div key={course._id} className="col-md-4 mb-4">
              <div 
                className="card course-card"
                onMouseEnter={() => setHoveredCourse(course._id)}
                onMouseLeave={() => setHoveredCourse(null)}
              >
                <img 
                  src={course.immagine} 
                  className="card-img-top" 
                  alt={course.titolo}
                />
                <div className="card-body-overlay">
                  <h5 className="card-title">{course.titolo}</h5>
                  <p className="card-text">{course.descrizione}</p>
                </div>
                {hoveredCourse === course._id && (
                  <div className="card-icons-overlay">
                    {enrollingCourse === course._id ? (
                      <div className="enroll-form">
                        <input
                          type="text"
                          placeholder="Enter username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="form-control mb-2"
                        />
                        <FaArrowLeft 
                          className="icon-btn"
                          onClick={() => {
                            setEnrollingCourse(null);
                            setUsername('');
                          }}
                        />
                      </div>
                    ) : (
                      <>
                        <FaUserPlus 
                          className="icon-btn"
                          onClick={() => setEnrollingCourse(course._id)}
                        />
                        <FaInfoCircle 
                          className="icon-btn"
                          onClick={() => handleViewDetails(course._id)}
                        />
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>There are no courses available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;