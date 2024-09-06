import React, { useState, useEffect } from 'react';
import { getEnrolledCourses } from '../services/AxiosApi';

const StudentDashboard = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);

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

  return (
    <div>
      <h2>Student Dashboard</h2>
      <div className="mt-4">
        <h3>Enrolled Courses</h3>
        {enrolledCourses.length > 0 ? (
          <ul className="list-group">
            {enrolledCourses.map(course => (
              <li key={course._id} className="list-group-item">
                <h5>{course.titolo}</h5>
                <p>{course.descrizione}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>You are not enrolled in any courses yet.</p>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;