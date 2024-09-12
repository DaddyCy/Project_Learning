import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudentDetails, updateStudent, uploadAvatar, updateAvatar, deleteAvatar } from '../services/AxiosApi.js';
import { FaEdit, FaTrash, FaCheck, FaArrowLeft } from 'react-icons/fa';
import './StudentProfile.css';

export default function StudentProfile() {
  const [studentDetails, setStudentDetails] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    currentPassword: '',
    newPassword: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudentDetails();
  }, []);

  const fetchStudentDetails = async () => {
    try {
      const response = await getStudentDetails();
      setStudentDetails(response.data);
      setFormData({
        nome: response.data.nome,
        cognome: response.data.cognome,
        email: response.data.email,
        currentPassword: '',
        newPassword: '',
      });
    } catch (error) {
      console.error('Error fetching student details:', error);
      navigate('/student');
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateStudent(formData);
      setStudentDetails(prevDetails => ({...prevDetails, ...response.data.student}));
      
      if (avatarFile) {
        await handleAvatarUpload();
      }
      
      alert('Profilo aggiornato con successo');
    } catch (error) {
      console.error('Errore dettagliato:', error.response || error);
      alert('Errore durante l\'aggiornamento del profilo');
    } finally {
      setEditing(false);
      setAvatarFile(null);
      navigate('/student');
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) {
      alert('Seleziona un file prima di caricare l\'avatar.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      await uploadAvatar(formData);
      await fetchStudentDetails();
      alert('Avatar caricato con successo');
    } catch (error) {
      console.error('Errore nel caricamento dell\'avatar:', error);
      alert('Errore nel caricamento dell\'avatar');
    } finally {
      setAvatarFile(null);
      navigate('/student');
    }
  };

  const handleAvatarUpdate = async () => {
    if (!avatarFile) {
      alert('Seleziona un file prima di aggiornare l\'avatar.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      await updateAvatar(formData);
      await fetchStudentDetails();
      alert('Avatar aggiornato con successo');
    } catch (error) {
      console.error('Errore nell\'aggiornamento dell\'avatar:', error);
      alert('Errore nell\'aggiornamento dell\'avatar');
    } finally {
      setAvatarFile(null);
      navigate('/student');
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      await deleteAvatar();
      await fetchStudentDetails();
      alert('Avatar eliminato con successo');
    } catch (error) {
      console.error('Errore nell\'eliminazione dell\'avatar:', error);
      alert('Errore nell\'eliminazione dell\'avatar');
    } finally {
      navigate('/student');
    }
  };

  if (!studentDetails) {
    return <div>Loading...</div>;
  }

  return (
<div className="container mt-5">
      {!editing ? (
        <div className="profile-container">
          <div className="profile-data">
            <p><strong>Name:</strong> {studentDetails.nome} {studentDetails.cognome}</p>
            <p><strong>Email:</strong> {studentDetails.email}</p>
            <p><strong>Username:</strong> {studentDetails.username}</p>
          </div>
          <div className="avatar-container">
            {studentDetails.avatar ? (
              <div className="avatar-wrapper">
                <img src={studentDetails.avatar} alt="Avatar" className="avatar-image" />
                <div className="avatar-overlay">
                  <FaEdit className="avatar-icon edit-icon" onClick={() => document.getElementById('avatarInput').click()} />
                  <FaTrash className="avatar-icon delete-icon" onClick={handleDeleteAvatar} />
                </div>
              </div>
            ) : (
              <div className="no-avatar">
                <p>Nessun avatar caricato</p>
                <button className="btn btn-outline-primary" onClick={() => document.getElementById('avatarInput').click()}>Carica Avatar</button>
              </div>
            )}
            <input
              type="file"
              id="avatarInput"
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
              accept="image/*"
            />
            {avatarFile && (
              <button className="btn btn-success mt-2" onClick={studentDetails.avatar ? handleAvatarUpdate : handleAvatarUpload}>
                {studentDetails.avatar ? 'Aggiorna Avatar' : 'Carica Avatar'}
              </button>
            )}
          </div>
          <div className="edit-profile-button">
            <button className="btn btn-outline-dark" onClick={() => setEditing(true)}>Modifica Profilo</button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="edit-form">
        <div className="row mb-3">
      <div className="col-md-6">
        <label htmlFor="nome" className="form-label">First Name</label>
        <input
          type="text"
          className="form-control"
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="col-md-6">
        <label htmlFor="cognome" className="form-label">Last Name</label>
        <input
          type="text"
          className="form-control"
          id="cognome"
          name="cognome"
          value={formData.cognome}
          onChange={handleInputChange}
          required
        />
      </div>
    </div>
    <div className="row mb-3">
      <div className="col-md-6">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          type="email"
          className="form-control"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="col-md-6">
        <label htmlFor="avatar" className="form-label">Avatar</label>
        <input
          type="file"
          className="form-control"
          id="avatar"
          name="avatar"
          onChange={handleAvatarChange}
          accept="image/*"
        />
      </div>
    </div>
    <div className="row mb-3">
      <div className="col-md-6">
        <label htmlFor="currentPassword" className="form-label">Current Password</label>
        <input
          type="password"
          className="form-control"
          id="currentPassword"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleInputChange}
        />
      </div>
      <div className="col-md-6">
        <label htmlFor="newPassword" className="form-label">New Password</label>
        <input
          type="password"
          className="form-control"
          id="newPassword"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleInputChange}
        />
      </div>
    </div>
          <div className="form-actions">
            <FaCheck className="form-icon confirm-icon" onClick={handleSubmit} />
            <FaArrowLeft className="form-icon return-icon" onClick={() => setEditing(false)} />
          </div>
        </form>
      )}
    </div>
  );
}

//         <div className="container mt-4">
//       {!editing ? (
//         <div>
//           <div className="row" style={{ minHeight: '200px' }}>
//             <div className="col-md-8 d-flex flex-column justify-content-center">
//               <p className="fs-5"><strong>Name:</strong> {studentDetails.nome} {studentDetails.cognome}</p>
//               <p className="fs-5"><strong>Email:</strong> {studentDetails.email}</p>
//               <p className="fs-5"><strong>Username:</strong> {studentDetails.username}</p>
//             </div>
//             <div className="col-md-4 d-flex flex-column justify-content-center align-items-center">
//               {studentDetails.avatar ? (
//                 <div>
//                   <img src={studentDetails.avatar} alt="Avatar" className="img-thumbnail mb-2" style={{maxWidth: '220px'}} />
//                   <br />
//                   <button className="btn btn-outline-primary mb-2 w-100" onClick={() => document.getElementById('avatarInput').click()}>Modifica Avatar</button>
//                   <button className="btn btn-outline-danger mb-2 w-100" onClick={handleDeleteAvatar}>Elimina Avatar</button>
//                 </div>
//               ) : (
//                 <div>
//                   <p>Nessun avatar caricato</p>
//                   <button className="btn btn-outline-primary mb-2" onClick={() => document.getElementById('avatarInput').click()}>Carica Avatar</button>
//                 </div>
//               )}
//               <input
//                 type="file"
//                 id="avatarInput"
//                 style={{ display: 'none' }}
//                 onChange={handleAvatarChange}
//                 accept="image/*"
//               />
//               {avatarFile && (
//                 <button className="btn btn-success w-100" onClick={studentDetails.avatar ? handleAvatarUpdate : handleAvatarUpload}>
//                   {studentDetails.avatar ? 'Aggiorna Avatar' : 'Carica Avatar'}
//                 </button>
//               )}
//             </div>
//           </div>
//           <div className="row mt-3">
//             <div className="col-12 d-flex justify-content-center">
//               <button className="btn btn-outline-dark w-40" onClick={() => setEditing(true)}>Modifica Profilo</button>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <form onSubmit={handleSubmit}>
//     <div className="row mb-3">
//       <div className="col-md-6">
//         <label htmlFor="nome" className="form-label">First Name</label>
//         <input
//           type="text"
//           className="form-control"
//           id="nome"
//           name="nome"
//           value={formData.nome}
//           onChange={handleInputChange}
//           required
//         />
//       </div>
//       <div className="col-md-6">
//         <label htmlFor="cognome" className="form-label">Last Name</label>
//         <input
//           type="text"
//           className="form-control"
//           id="cognome"
//           name="cognome"
//           value={formData.cognome}
//           onChange={handleInputChange}
//           required
//         />
//       </div>
//     </div>
//     <div className="row mb-3">
//       <div className="col-md-6">
//         <label htmlFor="email" className="form-label">Email</label>
//         <input
//           type="email"
//           className="form-control"
//           id="email"
//           name="email"
//           value={formData.email}
//           onChange={handleInputChange}
//           required
//         />
//       </div>
//       <div className="col-md-6">
//         <label htmlFor="avatar" className="form-label">Avatar</label>
//         <input
//           type="file"
//           className="form-control"
//           id="avatar"
//           name="avatar"
//           onChange={handleAvatarChange}
//           accept="image/*"
//         />
//       </div>
//     </div>
//     <div className="row mb-3">
//       <div className="col-md-6">
//         <label htmlFor="currentPassword" className="form-label">Current Password</label>
//         <input
//           type="password"
//           className="form-control"
//           id="currentPassword"
//           name="currentPassword"
//           value={formData.currentPassword}
//           onChange={handleInputChange}
//         />
//       </div>
//       <div className="col-md-6">
//         <label htmlFor="newPassword" className="form-label">New Password</label>
//         <input
//           type="password"
//           className="form-control"
//           id="newPassword"
//           name="newPassword"
//           value={formData.newPassword}
//           onChange={handleInputChange}
//         />
//       </div>
//     </div>
//     <div className="d-flex justify-content-center">
//       <button type="submit" className="btn btn-outline-success me-2">Save Changes</button>
//       <button type="button" className="btn btn-outline-danger" onClick={() => setEditing(false)}>Cancel</button>
//     </div>
//   </form>
//       )} 
//   </div>
//    );
// };

