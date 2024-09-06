import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCourses } from '../services/AxiosApi';
import HomeNavbar from '../components/HomeNavbar';
import Footer from '../components/Footer';

const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCourses();
  }, [currentPage]);

  const fetchCourses = async () => {
    try {
      const response = await getAllCourses(currentPage, 10);
      setCourses(response.data.courses);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  return (
    <div>
      <HomeNavbar />
      <div className="container mt-4">
        <h1>Welcome to Our Course Platform</h1>
        <div className="row">
          {courses.map(course => (
            <div key={course._id} className="col-md-4 mb-4">
              <div className="card">
                <img src={course.immagine} className="card-img-top" alt={course.titolo} />
                <div className="card-body">
                  <h5 className="card-title">{course.titolo}</h5>
                  <p className="card-text">{course.descrizione}</p>
                  <Link to={`/course/${course._id}`} className="btn btn-primary">View Course</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>{currentPage} of {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;