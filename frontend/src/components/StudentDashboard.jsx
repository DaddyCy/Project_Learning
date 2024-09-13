import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { enrollCourse } from '../services/AxiosApi';
import { FaUserPlus, FaInfoCircle, FaArrowLeft, FaCheck } from 'react-icons/fa';
import './StudentDashboard.css';

const StudentDashboard = ({ courses }) => {
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const [enrollingCourse, setEnrollingCourse] = useState(null);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleEnroll = async (courseId) => {
    if (!username) {
      alert('Inserisci il tuo nome utente');
      return;
    }
    try {
      await enrollCourse(courseId, { username });
      alert('Iscrizione al corso avvenuta con successo');
      setEnrollingCourse(null);
      setUsername('');
    } catch (error) {
      console.error('Error enrolling in course:', error);
      alert('Errore durante l\'iscrizione al corso. Riprova.');
    }
  };

  const handleViewDetails = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  return (
    <div>
      <h2 className="mb-4">Bacheca Corsi</h2>
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
                          placeholder="Inserisci username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="form-control mb-2"
                        />
                        <div>
                          <FaCheck 
                            className="icon-btn-student ms-2 me-2"
                            onClick={() => handleEnroll(course._id)}
                          />
                          <FaArrowLeft 
                            className="icon-btn-student-return"
                            onClick={() => {
                              setEnrollingCourse(null);
                              setUsername('');
                            }}
                          />
                        </div>
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
          <p>Non ci sono corsi disponibili al momento.</p>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;