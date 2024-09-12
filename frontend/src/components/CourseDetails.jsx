import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCourse } from '../services/AxiosApi';

const CourseDetails = () => {
  const [course, setCourse] = useState(null);
  const { id } = useParams();

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

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>{course.titolo}</h2>
      <p>{course.descrizione}</p>
      <h3 className="mt-4">Lezioni</h3>
      {course.lezioni && course.lezioni.length > 0 ? (
        <ul className="list-group">
          {course.lezioni.map((lezione, index) => (
            <li key={lezione._id} className="list-group-item">
              <h5>Lezione {index + 1}: {lezione.titolo}</h5>
              <p>{lezione.descrizione}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nessuna lezione disponibile per questo corso.</p>
      )}
    </div>
  );
};

export default CourseDetails;