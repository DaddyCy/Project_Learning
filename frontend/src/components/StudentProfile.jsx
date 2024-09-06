import React, { useState, useEffect } from 'react';
import { getStudentDetails, updateStudent, uploadAvatar, updateAvatar, deleteAvatar } from '../services/AxiosApi';

const StudentProfile = () => {
  const [studentDetails, setStudentDetails] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    currentPassword: '',
    newPassword: '',
  });
  const [avatar, setAvatar] = useState(null);

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
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateStudent(formData);
      if (avatar) {
        const formData = new FormData();
        formData.append('avatar', avatar);
        if (studentDetails.avatar) {
          await updateAvatar(formData);
        } else {
          await uploadAvatar(formData);
        }
      }
      fetchStudentDetails();
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      await deleteAvatar();
      fetchStudentDetails();
    } catch (error) {
      console.error('Error deleting avatar:', error);
    }
  };

  if (!studentDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Student Profile</h2>
      {!editing ? (
        <div>
          <p><strong>Name:</strong> {studentDetails.nome} {studentDetails.cognome}</p>
          <p><strong>Email:</strong> {studentDetails.email}</p>
          <p><strong>Username:</strong> {studentDetails.username}</p>
          {studentDetails.avatar && (
            <div>
              <img src={studentDetails.avatar} alt="Avatar" className="img-thumbnail mb-2" style={{maxWidth: '200px'}} />
              <br />
              <button className="btn btn-danger mb-2" onClick={handleDeleteAvatar}>Delete Avatar</button>
            </div>
          )}
          <button className="btn btn-primary" onClick={() => setEditing(true)}>Edit Profile</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
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
          <div className="mb-3">
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
          <div className="mb-3">
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
          <div className="mb-3">
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
          <div className="mb-3">
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
          <div className="mb-3">
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
          <button type="submit" className="btn btn-primary me-2">Save Changes</button>
          <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
        </form>
      )}
    </div>
  );
};

export default StudentProfile;