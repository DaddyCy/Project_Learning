import React, { useState, useEffect } from 'react';
import { getAllCourses, createCourse, updateCourse, deleteCourse } from '../services/AxiosApi';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newCourse, setNewCourse] = useState({ titolo: '', descrizione: '', immagine: null });

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

  const handleNewCourseChange = (e) => {
    if (e.target.name === 'immagine') {
      setNewCourse({ ...newCourse, immagine: e.target.files[0] });
    } else {
      setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('titolo', newCourse.titolo);
      formData.append('descrizione', newCourse.descrizione);
      if (newCourse.immagine) {
        formData.append('immagine', newCourse.immagine);
      }
      await createCourse(formData);
      setNewCourse({ titolo: '', descrizione: '', immagine: null });
      fetchCourses();
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse(id);
        fetchCourses();
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  return (
    <div>
      <h2>Course Management</h2>
      <form onSubmit={handleCreateCourse} className="mb-4">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            name="titolo"
            value={newCourse.titolo}
            onChange={handleNewCourseChange}
            placeholder="Course Title"
            required
          />
        </div>
        <div className="mb-3">
          <textarea
            className="form-control"
            name="descrizione"
            value={newCourse.descrizione}
            onChange={handleNewCourseChange}
            placeholder="Course Description"
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <input
            type="file"
            className="form-control"
            name="immagine"
            onChange={handleNewCourseChange}
            accept="image/*"
          />
        </div>
        <button type="submit" className="btn btn-primary">Create Course</button>
      </form>
      <div className="row">
        {courses.map(course => (
          <div key={course._id} className="col-md-4 mb-4">
            <div className="card">
              <img src={course.immagine} className="card-img-top" alt={course.titolo} />
              <div className="card-body">
                <h5 className="card-title">{course.titolo}</h5>
                <p className="card-text">{course.descrizione}</p>
                <button 
                  className="btn btn-danger"
                  onClick={() => handleDeleteCourse(course._id)}
                >
                  Delete
                </button>
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
  );
};

export default CourseManagement;