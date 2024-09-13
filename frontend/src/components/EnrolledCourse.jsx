import React, { useState, useEffect } from 'react';
import { getEnrolledCourses, unenrollCourse, getCourse } from '../services/AxiosApi.js';
import { FaTimes, FaArrowLeft, FaInfoCircle, FaPlay } from 'react-icons/fa';
import './EnrolledCourse.css';

const EnrolledCourse = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const [unenrollingCourse, setUnenrollingCourse] = useState(null);
  const [username, setUsername] = useState('');
  const [viewingCourse, setViewingCourse] = useState(null);
  const [playingLesson, setPlayingLesson] = useState(null);
  const [videoError, setVideoError] = useState(false);
  const [hoveredLesson, setHoveredLesson] = useState(null);

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

  const handleViewCourseDetails = async (courseId) => {
    try {
      const response = await getCourse(courseId);
      console.log("Course details:", response.data);
      setViewingCourse(response.data);
    } catch (error) {
      console.error('Error fetching course details:', error);
    }
  };

  const handlePlayLesson = (lesson) => {
    console.log("Playing lesson:", lesson);
    setVideoError(false);
    if (lesson && lesson.videoUrl) {
      setPlayingLesson(lesson);
    } else {
      console.error('URL del video non disponibile per questa lezione');
      setVideoError(true);
    }
  };

  const handleUnenroll = async (courseId) => {
    if (!username) {
      alert('Inserisci il tuo nome utente');
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

  const renderCourseList = () => (
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
                    <FaInfoCircle 
                      className="info-icon me-2"
                      onClick={() => handleViewCourseDetails(course._id)}
                    />
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
                    placeholder="Inserisci username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-control mb-2"
                  />
                  <div>
                    <button 
                      className="btn btn-danger me-2"
                      onClick={() => handleUnenroll(course._id)}
                    >
                      Conferma cancellazione
                    </button>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => setUnenrollingCourse(null)}
                    >
                      <FaArrowLeft />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <h2 className='ms-5 mt-5'>Non sei ancora iscritto a nessun corso.</h2>
      )}
    </div>
  );

  const renderCourseDetails = () => (
    <div className="course-details">
      <h2>{viewingCourse.titolo}</h2>
      <p className='lesson-description mt-5 mb-4'>{viewingCourse.descrizione}</p>
      <h3>Lezioni:</h3>
      <div className="row">
        {viewingCourse.lezioni && viewingCourse.lezioni.map((lezione, index) => (
          <div key={lezione._id} className="col-md-4 mb-3">
            <div 
              className="card lesson-card"
              onMouseEnter={() => setHoveredLesson(lezione._id)}
              onMouseLeave={() => setHoveredLesson(null)}
            >
              <img 
                src={viewingCourse.immagine} 
                className="card-img-top" 
                alt={lezione.titolo}
              />
              {hoveredLesson === lezione._id && (
                <div className="card-img-overlay d-flex flex-column justify-content-between">
                  <h6 className="card-title">Lezione {index + 1}: {lezione.titolo}</h6>
                  <p className="card-text">{lezione.descrizione}</p>
                  <FaPlay 
                    className="play-icon" 
                    onClick={() => handlePlayLesson(lezione)}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <button className="btn btn-outline-dark mt-3" onClick={() => setViewingCourse(null)}>
        Torna alla lista dei corsi
      </button>
    </div>
  );

  return (
    <div className="container mt-4">
      {viewingCourse ? renderCourseDetails() : renderCourseList()}

      {playingLesson && (
        <div className="modal fade show" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{playingLesson.titolo}</h5>
                <button type="button" className="btn-close" onClick={() => setPlayingLesson(null)}></button>
              </div>
              <div className="modal-body">
                {videoError ? (
                  <div className="alert alert-danger">
                    Si è verificato un errore nel caricamento del video. Per favore, riprova più tardi.
                  </div>
                ) : (
                  <video controls width="100%" onError={() => setVideoError(true)}>
                    <source src={playingLesson.videoUrl} type="video/mp4" />
                    Il tuo browser non supporta il tag video.
                  </video>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrolledCourse;