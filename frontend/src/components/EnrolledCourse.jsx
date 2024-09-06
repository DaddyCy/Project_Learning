import React, { useState, useEffect } from 'react';
import { getEnrolledCourses, unenrollCourse } from '../services/AxiosApi';
import { useAuth } from '../hooks/useAuth';

const EnrolledCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const { user } = useAuth();

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
    if (window.confirm('Are you sure you want to unenroll from this course?')) {
      try {
        await unenrollCourse(courseId, user.username);
        fetchEnrolledCourses();
      } catch (error) {
        console.error('Error unenrolling from course:', error);
      }
    }
  };

  return (
    <div>
      <h2>My Enrolled Courses</h2>
      {enrolledCourses.length > 0 ? (
        <div className="row mt-4">
          {enrolledCourses.map(course => (
            <div key={course._id} className="col-md-4 mb-4">
              <div className="card">
                <img src={course.immagine} className="card-img-top" alt={course.titolo} />
                <div className="card-body">
                  <h5 className="card-title">{course.titolo}</h5>
                  <p className="card-text">{course.descrizione}</p>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleUnenroll(course._id)}
                  >
                    Unenroll
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>You are not enrolled in any courses yet.</p>
      )}
    </div>
  );
};

export default EnrolledCourses;