import React, { useState, useEffect } from "react";
import {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  addLesson,
  updateLesson,
  deleteLesson,
  getLessonDetail,
} from "../services/AxiosApi.js";
import { FaPlus, FaEdit, FaTrash, FaEye, FaPlay, FaArrowLeft, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import './CourseManagment.css';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newCourse, setNewCourse] = useState({
    titolo: "",
    descrizione: "",
    immagine: null,
  });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newLesson, setNewLesson] = useState({
    titolo: "",
    descrizione: "",
    videoUrl: null,
    durata: "",
  });
  const [editingLesson, setEditingLesson] = useState(null);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [viewingCourse, setViewingCourse] = useState(null);
  const [viewingLesson, setViewingLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [isUpdatingCourse, setIsUpdatingCourse] = useState(false);
  const [playingLesson, setPlayingLesson] = useState(null);
   
  useEffect(() => {
    fetchCourses();
  }, [currentPage]);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const response = await getAllCourses(currentPage, 3);
      setCourses(response.data.courses);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewCourseChange = (e) => {
    if (e.target.name === "immagine") {
      setNewCourse({ ...newCourse, immagine: e.target.files[0] });
    } else {
      setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setIsCreatingCourse(true);
    try {
      const formData = new FormData();
      formData.append("titolo", newCourse.titolo);
      formData.append("descrizione", newCourse.descrizione);
      if (newCourse.immagine) {
        formData.append("immagine", newCourse.immagine);
      }
      await createCourse(formData);
      setNewCourse({ titolo: "", descrizione: "", immagine: null });
      setShowCourseForm(false);
      fetchCourses();
    } catch (error) {
      console.error("Error creating course:", error);
    } finally {
      setIsCreatingCourse(false);
    }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    setIsUpdatingCourse(true);
    try {
      const formData = new FormData();
      formData.append("titolo", selectedCourse.titolo);
      formData.append("descrizione", selectedCourse.descrizione);
      if (selectedCourse.newImage) {
        formData.append("immagine", selectedCourse.newImage);
      }
      await updateCourse(selectedCourse._id, formData);
      setSelectedCourse(null);
      fetchCourses();
    } catch (error) {
      console.error("Error updating course:", error);
    } finally {
      setIsUpdatingCourse(false);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm("Sei sicuro di voler eliminare questo corso?")) {
      try {
        setIsLoading(true);
        await deleteCourse(id);
        fetchCourses();
      } catch (error) {
        console.error("Error deleting course:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("titolo", newLesson.titolo);
      formData.append("descrizione", newLesson.descrizione);
      formData.append("durata", newLesson.durata === "" ? "0" : newLesson.durata);
      if (newLesson.videoUrl) {
        formData.append("videoUrl", newLesson.videoUrl);
      }
      await addLesson(viewingCourse._id, formData);
      setNewLesson({ titolo: "", descrizione: "", videoUrl: null, durata: "" });
      setShowLessonForm(false);
      await fetchCourseDetails(viewingCourse._id);
    } catch (error) {
      console.error("Error adding lesson:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdateLesson = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("titolo", editingLesson.titolo);
      formData.append("descrizione", editingLesson.descrizione);
      formData.append("durata", editingLesson.durata);
      if (editingLesson.newVideo) {
        formData.append("videoUrl", editingLesson.newVideo);
      }
      await updateLesson(viewingCourse._id, editingLesson._id, formData);
      setEditingLesson(null);
      await fetchCourseDetails(viewingCourse._id);
    } catch (error) {
      console.error("Error updating lesson:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteLesson = async (lessonId) => {
    if (window.confirm("Sei sicuro di voler eliminare questa lezione?")) {
      try {
        setIsLoading(true);
        await deleteLesson(viewingCourse._id, lessonId);
        await fetchCourseDetails(viewingCourse._id);
      } catch (error) {
        console.error("Error deleting lesson:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const fetchCourseDetails = async (courseId) => {
    setIsLoading(true);
    try {
      const updatedCourse = await getCourse(courseId);
      setViewingCourse(updatedCourse.data);
    } catch (error) {
      console.error("Error fetching course details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayLesson = async (lesson) => {
    try {
      const response = await getLessonDetail(viewingCourse._id, lesson._id);
      setPlayingLesson(response.data);
    } catch (error) {
      console.error("Error fetching lesson details:", error);
    }
  };
  
  useEffect(() => {
    if (viewingCourse) {
      fetchCourseDetails(viewingCourse._id);
    }
  }, [viewingCourse?._id]);

  return (
    <div className="container mt-4">
      {!showCourseForm && !selectedCourse && !viewingCourse && (
        <div className="text-center mt-5 mb-5">
          <FaPlus className="icon-button" onClick={() => setShowCourseForm(true)} />
        </div>
      )}

      {showCourseForm && (
        <div className="card mb-4 form-card">
          <div className="card-body">
            <h3 className="text-center mb-4">Crea Corso</h3>
            <form onSubmit={handleCreateCourse}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  name="titolo"
                  value={newCourse.titolo}
                  onChange={handleNewCourseChange}
                  placeholder="Titolo"
                  required
                />
              </div>
              <div className="mb-3">
                <textarea
                  className="form-control"
                  name="descrizione"
                  value={newCourse.descrizione}
                  onChange={handleNewCourseChange}
                  placeholder="Descrizione"
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
              <div className="text-center mt-4">
                {isCreatingCourse ? (
                  <FaSpinner className="spinner" />
                ) : (
                  <>
                    <FaCheck className="icon-button text-success me-3" onClick={handleCreateCourse} />
                    <FaTimes className="icon-button text-danger" onClick={() => setShowCourseForm(false)} />
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedCourse && (
        <div className="card mb-4 form-card">
          <div className="card-body">
            <h3 className="text-center mb-4">Modifica {selectedCourse.titolo}</h3>
            <form onSubmit={handleUpdateCourse}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  name="titolo"
                  value={selectedCourse.titolo}
                  onChange={(e) =>
                    setSelectedCourse({
                      ...selectedCourse,
                      titolo: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <textarea
                  className="form-control"
                  name="descrizione"
                  value={selectedCourse.descrizione}
                  onChange={(e) =>
                    setSelectedCourse({
                      ...selectedCourse,
                      descrizione: e.target.value,
                    })
                  }
                  required
                ></textarea>
              </div>
              <div className="mb-3">
                <input
                  type="file"
                  className="form-control"
                  name="newImage"
                  onChange={(e) =>
                    setSelectedCourse({
                      ...selectedCourse,
                      newImage: e.target.files[0],
                    })
                  }
                  accept="image/*"
                />
              </div>
              <div className="text-center mt-4">
                {isUpdatingCourse ? (
                  <FaSpinner className="spinner" />
                ) : (
                  <>
                    <FaCheck className="icon-button text-success me-3" onClick={handleUpdateCourse} />
                    <FaTimes className="icon-button text-danger" onClick={() => setSelectedCourse(null)} />
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {viewingCourse && !showLessonForm && !editingLesson && (
        <div className="mb-4">
          <div className="d-flex align-items-center mb-4">
            <FaArrowLeft className="icon-button me-3" onClick={() => setViewingCourse(null)} />
            <h2 className="mb-0">{viewingCourse.titolo}</h2>
          </div>
          <p className="lead mb-4 font">{viewingCourse.descrizione}</p>
          <h3 className="mb-3">Lezioni</h3>
          {isLoading ? (
            <div className="text-center">
              <FaSpinner className="spinner" />
            </div>
          ) : viewingCourse.lezioni && viewingCourse.lezioni.length > 0 ? (
            <div className="row">
              {viewingCourse.lezioni.map((lesson) => (
                <div key={lesson._id} className="col-md-4 mb-3">
                  <div className="card lesson-card h-100">
                    <img src={viewingCourse.immagine} className="card-img-top" alt={lesson.titolo} />
                    <div className="card-img-overlay">
                      <h5 className="card-title">{lesson.titolo}</h5>
                      <p className="card-text">{lesson.descrizione}</p>
                      <p className="card-text"><small>Durata: {lesson.durata} minuti</small></p>
                      <div className=" mb-3 me-3 lesson-icons">
                        <FaPlay className="icon" onClick={() => handlePlayLesson(lesson)} />
                        <FaEdit className="icon" onClick={() => setEditingLesson(lesson)} />
                        <FaTrash className="icon" onClick={() => handleDeleteLesson(lesson._id)} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Nessuna lezione disponibile per questo corso.</p>
          )}
          <button className="btn btn-outline-dark mt-3" onClick={() => setShowLessonForm(true)}>
            Aggiungi Lezione
          </button>
        </div>
      )}

      {showLessonForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h3 className="text-center mb-4">Aggiungi Nuova Lezione</h3>
            <form onSubmit={handleAddLesson}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  name="titolo"
                  value={newLesson.titolo}
                  onChange={(e) =>
                    setNewLesson({ ...newLesson, titolo: e.target.value })
                  }
                  placeholder="Titolo"
                  required
                />
              </div>
              <div className="mb-3">
                <textarea
                  className="form-control"
                  name="descrizione"
                  value={newLesson.descrizione}
                  onChange={(e) =>
                    setNewLesson({ ...newLesson, descrizione: e.target.value })
                  }
                  placeholder="Descrizione"
                  required
                ></textarea>
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  className="form-control"
                  name="durata"
                  value={newLesson.durata}
                  onChange={(e) =>
                    setNewLesson({
                      ...newLesson,
                      durata: e.target.value,
                    })
                  }
                  placeholder="Durata lezione (in minuti)"
                  min="0"
                  step="1"
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="file"
                  className="form-control"
                  name="videoUrl"
                  onChange={(e) =>
                    setNewLesson({ ...newLesson, videoUrl: e.target.files[0] })
                  }
                  accept="video/*"
                  required
                />
              </div>
              <div className="text-center mt-4">
                <FaCheck className="icon-button text-success me-3" onClick={handleAddLesson} />
                <FaTimes className="icon-button text-danger" onClick={() => setShowLessonForm(false)} />
              </div>
            </form>
          </div>
        </div>
      )}

      {editingLesson && (
        <div className="card mb-4">
          <div className="card-body">
            <h3 className="text-center mb-4">Modifica Lezione</h3>
            <form onSubmit={handleUpdateLesson}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  name="titolo"
                  value={editingLesson.titolo}
                  onChange={(e) =>
                    setEditingLesson({
                      ...editingLesson,
                      titolo: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <textarea
                  className="form-control"
                  name="descrizione"
                  value={editingLesson.descrizione}
                  onChange={(e) =>
                    setEditingLesson({
                      ...editingLesson,
                      descrizione: e.target.value,
                    })
                  }
                  required
                ></textarea>
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  className="form-control"
                  name="durata"
                  value={editingLesson.durata}
                  onChange={(e) =>
                    setEditingLesson({
                      ...editingLesson,
                      durata: e.target.value,
                    })
                  }
                  min="0"
                  step="1"
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="file"
                  className="form-control"
                  name="newVideo"
                  onChange={(e) =>
                    setEditingLesson({
                      ...editingLesson,
                      newVideo: e.target.files[0],
                    })
                  }
                  accept="video/*"
                />
              </div>
              <div className="text-center mt-4">
                <FaCheck className="icon-button text-success me-3" onClick={handleUpdateLesson} />
                <FaTimes className="icon-button text-danger" onClick={() => setEditingLesson(null)} />
              </div>
            </form>
          </div>
        </div>
      )}

      {playingLesson && (
        <div className="modal fade show" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{playingLesson.titolo}</h5>
                <button type="button" className="btn-close" onClick={() => setPlayingLesson(null)}></button>
              </div>
              <div className="modal-body">
                <video controls width="100%">
                  <source src={playingLesson.videoUrl} type="video/mp4" />
                  Il tuo browser non supporta il tag video.
                </video>
              </div>
            </div>
          </div>
        </div>
      )}

      {!showCourseForm && !selectedCourse && !viewingCourse && (
        <div className="row justify-content-center">
          {courses.map((course) => (
            <div key={course._id} className="col-md-4 mb-4">
              <div className="card course-card h-100">
                <img
                  src={course.immagine}
                  className="card-img-top"
                  alt={course.titolo}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-img-overlay d-flex flex-column justify-content-between">
                  <h5 className="card-title text-white">{course.titolo}</h5>
                  <div className="course-icons">
                    <FaTrash
                      className="icon"
                      onClick={() => handleDeleteCourse(course._id)}
                    />
                    <FaEdit
                      className="icon"
                      onClick={() => setSelectedCourse(course)}
                    />
                    <FaEye
                      className="icon"
                      onClick={() => fetchCourseDetails(course._id)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!showCourseForm &&
        !selectedCourse &&
        !viewingCourse &&
        courses.length > 0 && (
          <div className="d-flex justify-content-center mt-4">
            <button
              className="btn btn-outline-dark me-2"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span className="align-self-center mx-2">
              Pagina {currentPage} of {totalPages}
            </span>
            <button
              className="btn btn-outline-dark ms-2"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
    </div>
  );
};

export default CourseManagement;
