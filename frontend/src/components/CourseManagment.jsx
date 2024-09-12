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
import { FaPlus, FaEdit, FaTrash, FaEye, FaPlay, FaArrowLeft, FaCheck, FaTimes } from 'react-icons/fa';
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

    useEffect(() => {
    fetchCourses();
  }, [currentPage]);

  const fetchCourses = async () => {
    try {
      const response = await getAllCourses(currentPage, 3); // Changed to 3 courses per page
      setCourses(response.data.courses);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching courses:", error);
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
    }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
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
    }
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteCourse(id);
        fetchCourses();
      } catch (error) {
        console.error("Error deleting course:", error);
      }
    }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("titolo", newLesson.titolo);
      formData.append("descrizione", newLesson.descrizione);
      formData.append(
        "durata",
        newLesson.durata === "" ? "0" : newLesson.durata
      );
      if (newLesson.videoUrl) {
        formData.append("videoUrl", newLesson.videoUrl);
      }
      await addLesson(viewingCourse._id, formData);
      setNewLesson({ titolo: "", descrizione: "", videoUrl: null, durata: "" });
      setShowLessonForm(false);
      const updatedCourse = await getCourse(viewingCourse._id);
      setViewingCourse(updatedCourse.data);
    } catch (error) {
      console.error("Error adding lesson:", error);
    }
  };

  const handleUpdateLesson = async (e) => {
    e.preventDefault();
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
      const updatedCourse = await getCourse(viewingCourse._id);
      setViewingCourse(updatedCourse.data);
    } catch (error) {
      console.error("Error updating lesson:", error);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      try {
        await deleteLesson(viewingCourse._id, lessonId);
        const updatedCourse = await getCourse(viewingCourse._id);
        setViewingCourse(updatedCourse.data);
      } catch (error) {
        console.error("Error deleting lesson:", error);
      }
    }
  };


  return (
    <div className="container mt-4">
      {!showCourseForm && !selectedCourse && !viewingCourse && (
        <div className="text-center mb-4">
          <FaPlus className="icon-button" onClick={() => setShowCourseForm(true)} />
        </div>
      )}

      {showCourseForm && (
        <div className="card mb-4 form-card">
          <div className="card-body">
            <h3 className="text-center mb-4">Create New Course</h3>
            <form onSubmit={handleCreateCourse}>
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
              <div className="text-center mt-4">
                <FaCheck className="icon-button text-success me-3" onClick={handleCreateCourse} />
                <FaTimes className="icon-button text-danger" onClick={() => setShowCourseForm(false)} />
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedCourse && (
        <div className="card mb-4 form-card">
          <div className="card-body">
            <h3 className="text-center mb-4">Edit Course: {selectedCourse.titolo}</h3>
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
                <FaCheck className="icon-button text-success me-3" onClick={handleUpdateCourse} />
                <FaTimes className="icon-button text-danger" onClick={() => setSelectedCourse(null)} />
              </div>
            </form>
          </div>
        </div>
      )}

      {viewingCourse && (
        <div className="mb-4">
          <div className="d-flex align-items-center mb-4">
            <FaArrowLeft className="icon-button me-3" onClick={() => setViewingCourse(null)} />
            <h2 className="mb-0">{viewingCourse.titolo}</h2>
          </div>
          <p className="lead mb-4">{viewingCourse.descrizione}</p>
          <FaPlus className="icon-button mb-4" onClick={() => setShowLessonForm(true)} />
          <div className="row">
            {viewingCourse.lezioni && viewingCourse.lezioni.map((lesson, index) => (
              <div key={lesson._id} className="col-md-4 mb-3">
                <div className="card h-100">
                  <div className="card-body position-relative">
                    <h5 className="card-title">{lesson.titolo}</h5>
                    <p className="card-text">{lesson.descrizione}</p>
                    <p className="card-text"><small className="text-muted">Duration: {lesson.durata} minutes</small></p>
                    <div className="lesson-icons">
                      <FaTrash className="icon delete-icon" onClick={() => handleDeleteLesson(lesson._id)} />
                      <FaEdit className="icon edit-icon" onClick={() => setEditingLesson(lesson)} />
                      <FaPlay className="icon play-icon" onClick={() => setViewingLesson(lesson)} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showLessonForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h3 className="text-center mb-4">Add New Lesson</h3>
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
                  placeholder="Lesson Title"
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
                  placeholder="Lesson Description"
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
                  placeholder="Lesson Duration (in minutes)"
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
            <h3>Edit Lesson</h3>
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
                      durata: parseInt(e.target.value),
                    })
                  }
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

              <button type="submit" className="btn btn-primary">
                Update Lesson
              </button>
              <button
                type="button"
                className="btn btn-secondary ml-2"
                onClick={() => setEditingLesson(null)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {viewingLesson && (
        <div className="full-screen-video">
          <video controls width="100%" height="100%">
            <source src={viewingLesson.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <button
            className="btn btn-secondary close-video"
            onClick={() => setViewingLesson(null)}
          >
            Close
          </button>
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
                      onClick={() => setViewingCourse(course)}
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
              Previous
            </button>
            <span className="align-self-center mx-2">
              Page {currentPage} of {totalPages}
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

// import React, { useState, useEffect } from "react";
// import {
//   getAllCourses,
//   getCourse,
//   createCourse,
//   updateCourse,
//   deleteCourse,
//   addLesson,
//   updateLesson,
//   deleteLesson,
//   getLessonDetail,
// } from "../services/AxiosApi.js";
// import {
//   FaPlus,
//   FaEdit,
//   FaTrash,
//   FaEye,
//   FaPlay,
//   FaArrowLeft,
// } from "react-icons/fa";
// import "./CourseManagment.css";

// const CourseManagement = () => {
//   const [courses, setCourses] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [newCourse, setNewCourse] = useState({
//     titolo: "",
//     descrizione: "",
//     immagine: null,
//   });
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [newLesson, setNewLesson] = useState({
//     titolo: "",
//     descrizione: "",
//     videoUrl: null,
//     durata: "",
//   });
//   const [editingLesson, setEditingLesson] = useState(null);
//   const [showCourseForm, setShowCourseForm] = useState(false);
//   const [showLessonForm, setShowLessonForm] = useState(false);
//   const [viewingCourse, setViewingCourse] = useState(null);
//   const [viewingLesson, setViewingLesson] = useState(null);

//   useEffect(() => {
//     fetchCourses();
//   }, [currentPage]);

//   const fetchCourses = async () => {
//     try {
//       const response = await getAllCourses(currentPage, 3); // Changed to 3 courses per page
//       setCourses(response.data.courses);
//       setTotalPages(response.data.totalPages);
//     } catch (error) {
//       console.error("Error fetching courses:", error);
//     }
//   };

//   const handleNewCourseChange = (e) => {
//     if (e.target.name === "immagine") {
//       setNewCourse({ ...newCourse, immagine: e.target.files[0] });
//     } else {
//       setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
//     }
//   };

//   const handleCreateCourse = async (e) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();
//       formData.append("titolo", newCourse.titolo);
//       formData.append("descrizione", newCourse.descrizione);
//       if (newCourse.immagine) {
//         formData.append("immagine", newCourse.immagine);
//       }
//       await createCourse(formData);
//       setNewCourse({ titolo: "", descrizione: "", immagine: null });
//       setShowCourseForm(false);
//       fetchCourses();
//     } catch (error) {
//       console.error("Error creating course:", error);
//     }
//   };

//   const handleUpdateCourse = async (e) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();
//       formData.append("titolo", selectedCourse.titolo);
//       formData.append("descrizione", selectedCourse.descrizione);
//       if (selectedCourse.newImage) {
//         formData.append("immagine", selectedCourse.newImage);
//       }
//       await updateCourse(selectedCourse._id, formData);
//       setSelectedCourse(null);
//       fetchCourses();
//     } catch (error) {
//       console.error("Error updating course:", error);
//     }
//   };

//   const handleDeleteCourse = async (id) => {
//     if (window.confirm("Are you sure you want to delete this course?")) {
//       try {
//         await deleteCourse(id);
//         fetchCourses();
//       } catch (error) {
//         console.error("Error deleting course:", error);
//       }
//     }
//   };

//   const handleAddLesson = async (e) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();
//       formData.append("titolo", newLesson.titolo);
//       formData.append("descrizione", newLesson.descrizione);
//       formData.append(
//         "durata",
//         newLesson.durata === "" ? "0" : newLesson.durata
//       );
//       if (newLesson.videoUrl) {
//         formData.append("videoUrl", newLesson.videoUrl);
//       }
//       await addLesson(viewingCourse._id, formData);
//       setNewLesson({ titolo: "", descrizione: "", videoUrl: null, durata: "" });
//       setShowLessonForm(false);
//       const updatedCourse = await getCourse(viewingCourse._id);
//       setViewingCourse(updatedCourse.data);
//     } catch (error) {
//       console.error("Error adding lesson:", error);
//     }
//   };

//   const handleUpdateLesson = async (e) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();
//       formData.append("titolo", editingLesson.titolo);
//       formData.append("descrizione", editingLesson.descrizione);
//       formData.append("durata", editingLesson.durata);
//       if (editingLesson.newVideo) {
//         formData.append("videoUrl", editingLesson.newVideo);
//       }
//       await updateLesson(viewingCourse._id, editingLesson._id, formData);
//       setEditingLesson(null);
//       const updatedCourse = await getCourse(viewingCourse._id);
//       setViewingCourse(updatedCourse.data);
//     } catch (error) {
//       console.error("Error updating lesson:", error);
//     }
//   };

//   const handleDeleteLesson = async (lessonId) => {
//     if (window.confirm("Are you sure you want to delete this lesson?")) {
//       try {
//         await deleteLesson(viewingCourse._id, lessonId);
//         const updatedCourse = await getCourse(viewingCourse._id);
//         setViewingCourse(updatedCourse.data);
//       } catch (error) {
//         console.error("Error deleting lesson:", error);
//       }
//     }
//   };

//   return (
//     <div className="container mt-4">
//       {!showCourseForm && !selectedCourse && !viewingCourse && (
//         <div className="text-center mb-4">
//           <button
//             className="btn btn-outline-light"
//             onClick={() => setShowCourseForm(true)}
//           >
//             <FaPlus className="mb-1 me-1" /> Create Course
//           </button>
//         </div>
//       )}

//       {showCourseForm && (
//         <div className="card mb-4">
//           <div className="card-body">
//             <h3>Create New Course</h3>
//             <form onSubmit={handleCreateCourse}>
//               <div className="mb-3">
//                 <input
//                   type="text"
//                   className="form-control"
//                   name="titolo"
//                   value={newCourse.titolo}
//                   onChange={handleNewCourseChange}
//                   placeholder="Course Title"
//                   required
//                 />
//               </div>

//               <div className="mb-3">
//                 <textarea
//                   className="form-control"
//                   name="descrizione"
//                   value={newCourse.descrizione}
//                   onChange={handleNewCourseChange}
//                   placeholder="Course Description"
//                   required
//                 ></textarea>
//               </div>

//               <div className="mb-3">
//                 <input
//                   type="file"
//                   className="form-control"
//                   name="immagine"
//                   onChange={handleNewCourseChange}
//                   accept="image/*"
//                 />
//               </div>
//               <button type="submit" className="btn btn-success">
//                 Create Course
//               </button>
//               <button
//                 type="button"
//                 className="btn btn-secondary ml-2"
//                 onClick={() => setShowCourseForm(false)}
//               >
//                 Cancel
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {selectedCourse && (
//         <div className="card mb-4">
//           <div className="card-body">
//             <h3>Edit Course: {selectedCourse.titolo}</h3>
//             <form onSubmit={handleUpdateCourse}>
//               <div className="mb-3">
//                 <input
//                   type="text"
//                   className="form-control"
//                   name="titolo"
//                   value={selectedCourse.titolo}
//                   onChange={(e) =>
//                     setSelectedCourse({
//                       ...selectedCourse,
//                       titolo: e.target.value,
//                     })
//                   }
//                   required
//                 />
//               </div>

//               <div className="mb-3">
//                 <textarea
//                   className="form-control"
//                   name="descrizione"
//                   value={selectedCourse.descrizione}
//                   onChange={(e) =>
//                     setSelectedCourse({
//                       ...selectedCourse,
//                       descrizione: e.target.value,
//                     })
//                   }
//                   required
//                 ></textarea>
//               </div>

//               <div className="mb-3">
//                 <input
//                   type="file"
//                   className="form-control"
//                   name="newImage"
//                   onChange={(e) =>
//                     setSelectedCourse({
//                       ...selectedCourse,
//                       newImage: e.target.files[0],
//                     })
//                   }
//                   accept="image/*"
//                 />
//               </div>
//               <button type="submit" className="btn btn-primary">
//                 Update Course
//               </button>
//               <button
//                 type="button"
//                 className="btn btn-secondary ml-2"
//                 onClick={() => setSelectedCourse(null)}
//               >
//                 Cancel
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {viewingCourse && (
//         <div className="mb-4">
//           <button
//             className="btn btn-secondary mb-3"
//             onClick={() => setViewingCourse(null)}
//           >
//             <FaArrowLeft /> Back to Courses
//           </button>
//           <h2>{viewingCourse.titolo}</h2>
//           <p className="lead">{viewingCourse.descrizione}</p>
//           <button
//             className="btn btn-outline-dark mb-3"
//             onClick={() => setShowLessonForm(true)}
//           >
//            Add Lesson <FaPlus className="mb-1 ms-1"/> 
//           </button>
//           <div className="row">
//             {viewingCourse.lezioni &&
//               viewingCourse.lezioni.map((lesson, index) => (
//                 <div key={lesson._id} className="col-md-4 mb-3">
//                   <div className="card h-100">
//                     <div className="card-body position-relative">
//                       <h5 className="card-title">{lesson.titolo}</h5>
//                       <p className="card-text">{lesson.descrizione}</p>
//                       <div className="lesson-icons">
//                         <FaTrash
//                           className="icon delete-icon"
//                           onClick={() => handleDeleteLesson(lesson._id)}
//                         />
//                         <FaEdit
//                           className="icon edit-icon"
//                           onClick={() => setEditingLesson(lesson)}
//                         />
//                         <FaPlay
//                           className="icon play-icon"
//                           onClick={() => setViewingLesson(lesson)}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//           </div>
//         </div>
//       )}

//       {showLessonForm && (
//         <div className="card mb-4">
//           <div className="card-body">
//             <form onSubmit={handleAddLesson}>
//               <div className="mb-3">
//                 <input
//                   type="text"
//                   className="form-control"
//                   name="titolo"
//                   value={newLesson.titolo}
//                   onChange={(e) =>
//                     setNewLesson({ ...newLesson, titolo: e.target.value })
//                   }
//                   placeholder="Lesson Title"
//                   required
//                 />
//               </div>

//               <div className="mb-3">
//                 <textarea
//                   className="form-control"
//                   name="descrizione"
//                   value={newLesson.descrizione}
//                   onChange={(e) =>
//                     setNewLesson({ ...newLesson, descrizione: e.target.value })
//                   }
//                   placeholder="Lesson Description"
//                   required
//                 ></textarea>
//               </div>

//               <div className="mb-3">
//                 <input
//                   type="number"
//                   className="form-control"
//                   name="durata"
//                   value={newLesson.durata}
//                   onChange={(e) =>
//                     setNewLesson({
//                       ...newLesson,
//                       durata: e.target.value,
//                     })
//                   }
//                   placeholder="Lesson Duration (in minutes)"
//                   min="0"
//                   step="1"
//                   required
//                 />
//               </div>

//               <div className="mb-3">
//                 <input
//                   type="file"
//                   className="form-control"
//                   name="videoUrl"
//                   onChange={(e) =>
//                     setNewLesson({ ...newLesson, videoUrl: e.target.files[0] })
//                   }
//                   accept="video/*"
//                   required
//                 />
//               </div>
//               <button type="submit" className="btn btn-success">
//                 Add Lesson
//               </button>
//               <button
//                 type="button"
//                 className="btn btn-secondary ml-2"
//                 onClick={() => setShowLessonForm(false)}
//               >
//                 Cancel
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {editingLesson && (
//         <div className="card mb-4">
//           <div className="card-body">
//             <h3>Edit Lesson</h3>
//             <form onSubmit={handleUpdateLesson}>
//               <div className="mb-3">
//                 <input
//                   type="text"
//                   className="form-control"
//                   name="titolo"
//                   value={editingLesson.titolo}
//                   onChange={(e) =>
//                     setEditingLesson({
//                       ...editingLesson,
//                       titolo: e.target.value,
//                     })
//                   }
//                   required
//                 />
//               </div>

//               <div className="mb-3">
//                 <textarea
//                   className="form-control"
//                   name="descrizione"
//                   value={editingLesson.descrizione}
//                   onChange={(e) =>
//                     setEditingLesson({
//                       ...editingLesson,
//                       descrizione: e.target.value,
//                     })
//                   }
//                   required
//                 ></textarea>
//               </div>

//               <div className="mb-3">
//                 <input
//                   type="number"
//                   className="form-control"
//                   name="durata"
//                   value={editingLesson.durata}
//                   onChange={(e) =>
//                     setEditingLesson({
//                       ...editingLesson,
//                       durata: parseInt(e.target.value),
//                     })
//                   }
//                   required
//                 />
//               </div>

//               <div className="mb-3">
//                 <input
//                   type="file"
//                   className="form-control"
//                   name="newVideo"
//                   onChange={(e) =>
//                     setEditingLesson({
//                       ...editingLesson,
//                       newVideo: e.target.files[0],
//                     })
//                   }
//                   accept="video/*"
//                 />
//               </div>

//               <button type="submit" className="btn btn-primary">
//                 Update Lesson
//               </button>
//               <button
//                 type="button"
//                 className="btn btn-secondary ml-2"
//                 onClick={() => setEditingLesson(null)}
//               >
//                 Cancel
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {viewingLesson && (
//         <div className="full-screen-video">
//           <video controls width="100%" height="100%">
//             <source src={viewingLesson.videoUrl} type="video/mp4" />
//             Your browser does not support the video tag.
//           </video>
//           <button
//             className="btn btn-secondary close-video"
//             onClick={() => setViewingLesson(null)}
//           >
//             Close
//           </button>
//         </div>
//       )}

//       {!showCourseForm && !selectedCourse && !viewingCourse && (
//         <div className="row justify-content-center">
//           {courses.map((course) => (
//             <div key={course._id} className="col-md-4 mb-4">
//               <div className="card course-card h-100">
//                 <img
//                   src={course.immagine}
//                   className="card-img-top"
//                   alt={course.titolo}
//                   style={{ height: "200px", objectFit: "cover" }}
//                 />
//                 <div className="card-img-overlay d-flex flex-column justify-content-between">
//                   <h5 className="card-title text-white">{course.titolo}</h5>
//                   <div className="course-icons">
//                     <FaTrash
//                       className="icon"
//                       onClick={() => handleDeleteCourse(course._id)}
//                     />
//                     <FaEdit
//                       className="icon"
//                       onClick={() => setSelectedCourse(course)}
//                     />
//                     <FaEye
//                       className="icon"
//                       onClick={() => setViewingCourse(course)}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {!showCourseForm &&
//         !selectedCourse &&
//         !viewingCourse &&
//         courses.length > 0 && (
//           <div className="d-flex justify-content-center mt-4">
//             <button
//               className="btn btn-outline-dark me-2"
//               onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//               disabled={currentPage === 1}
//             >
//               Previous
//             </button>
//             <span className="align-self-center mx-2">
//               Page {currentPage} of {totalPages}
//             </span>
//             <button
//               className="btn btn-outline-dark ms-2"
//               onClick={() =>
//                 setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//               }
//               disabled={currentPage === totalPages}
//             >
//               Next
//             </button>
//           </div>
//         )}
//     </div>
//   );
// };

// export default CourseManagement;
