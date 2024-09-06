import React, { useState, useEffect } from 'react';
import { getAllCourses, getAllStudents } from '../services/AxiosApi';

const AdminDashboard = () => {
  const [coursesCount, setCoursesCount] = useState(0);
  const [studentsCount, setStudentsCount] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const coursesResponse = await getAllCourses(1, 1);
      const studentsResponse = await getAllStudents(1, 1);
      setCoursesCount(coursesResponse.data.totalCourses);
      setStudentsCount(studentsResponse.data.totalStudents);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total Courses</h5>
              <p className="card-text">{coursesCount}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total Students</h5>
              <p className="card-text">{studentsCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;