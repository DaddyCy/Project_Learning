import React, { useState, useEffect } from 'react';
import { getEnrolledCourses, unenrollCourse } from '../services/AxiosApi.js';
import { FaTimes } from 'react-icons/fa';
import './EnrolledCourse.css';

const EnrolledCourse = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const [unenrollingCourse, setUnenrollingCourse] = useState(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      const response = await getEnrolledCourses();
      setEnrolledCourses(response.data);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    }
  };

  const handleUnenroll = async (courseId) => {
    if (!username) {
      alert('Please enter your username');
      return;
    }
    try {
      await unenrollCourse(courseId, { username });
      alert('Cancellazione dell\'iscrizione al corso avvenuta con successo');
      fetchEnrolledCourses();
      setUnenrollingCourse(null);
      setUsername('');
    } catch (error) {
      console.error('Error unenrolling from course:', error);
      alert('Errore durante la cancellazione dell\'iscrizione al corso. Per favore, riprova.');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Courses</h2>
      <div className="row">
        {enrolledCourses.length > 0 ? (
          enrolledCourses.map(course => (
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
                {hoveredCourse === course._id && (
                  <div className="card-img-overlay d-flex flex-column justify-content-between">
                    <div className="d-flex justify-content-end">
                      <FaTimes 
                        className="unenroll-icon"
                        onClick={() => setUnenrollingCourse(course._id)}
                      />
                    </div>
                    <h5 id="mycard-title" className="card-title">{course.titolo}</h5>
                  </div>
                )}
                {unenrollingCourse === course._id && (
                  <div className="card-img-overlay d-flex flex-column justify-content-center align-items-center">
                    <input
                      type="text"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="form-control mb-2"
                    />
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleUnenroll(course._id)}
                    >
                      Confirm Unenroll
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>You are not enrolled in any courses yet.</p>
        )}
      </div>
    </div>
  );
};

export default EnrolledCourse;