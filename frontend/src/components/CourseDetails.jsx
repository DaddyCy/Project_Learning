import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourse } from '../services/AxiosApi';
import { FaArrowLeft } from 'react-icons/fa';
import './CourseDetail.css';

const CourseDetails = () => {
  const [course, setCourse] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await getCourse(id);
        setCourse(response.data);
      } catch (error) {
        console.error('Error fetching course details:', error);
      }
    };

    fetchCourseDetails();
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center mb-4">
        <FaArrowLeft 
          className="back-icon me-3" 
          onClick={handleGoBack} 
          style={{ cursor: 'pointer', fontSize: '1.5rem' }}
        />
        <h1>{course.titolo}</h1>
      </div>
      <h5 className='mt-3 description'>{course.descrizione}</h5>
      <h3 className="mt-4">Lezioni</h3>
      {course.lezioni && course.lezioni.length > 0 ? (
        <div className="row">
          {course.lezioni.map((lezione, index) => (
            <div key={lezione._id} className="col-md-4 mb-4">
              <div className="card lesson-card">
                <img src={course.immagine} className="card-img-top" alt={`Lezione ${index + 1}`} />
                <div className="card-img-overlay">
                  <h5 className="card-title">Lezione {index + 1}: {lezione.titolo}</h5>
                  <p className="card-text">{lezione.descrizione}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Nessuna lezione disponibile per questo corso.</p>
      )}
    </div>
  );
};

export default CourseDetails;