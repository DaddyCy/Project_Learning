import React, { useState, useEffect } from "react";
import {
  getAllCourses,
  getAllStudents,
  updateAdmin,
  deleteAdmin,
  getAdminDetails,
} from "../services/AxiosApi.js";
import { FaEdit, FaSave, FaUndo } from 'react-icons/fa';

const AdminDashboard = () => {
  const [coursesCount, setCoursesCount] = useState(0);
  const [studentsCount, setStudentsCount] = useState(0);
  const [adminDetails, setAdminDetails] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    email: "",
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const coursesResponse = await getAllCourses(1, 1);
      const studentsResponse = await getAllStudents(1, 1);
      const adminResponse = await getAdminDetails();

      setCoursesCount(coursesResponse.data.totalCourses);
      setStudentsCount(studentsResponse.data.totalStudents);
      setAdminDetails(adminResponse.data);
      setFormData({
        nome: adminResponse.data.nome,
        cognome: adminResponse.data.cognome,
        email: adminResponse.data.email,
        currentPassword: "",
        newPassword: "",
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateAdmin = async (e) => {
    e.preventDefault();
    try {
      await updateAdmin(formData);
      setEditing(false);
      const updatedAdmin = await getAdminDetails();
      setAdminDetails(updatedAdmin.data);
    } catch (error) {
      console.error("Error updating admin profile:", error);
    }
  };

  return (
    <div className="container mt-4">
      {!editing ? (
        <>
          <div className="row justify-content-center mb-5">
            <div className="col-md-8">
              <div className="card">
                <div className="card-body">
                  <table className="table table-borderless fs-4">
                    <tbody>
                      <tr>
                        <th scope="row" className="text-end">Name:</th>
                        <td>{adminDetails?.nome}</td>
                      </tr>
                      <tr>
                        <th scope="row" className="text-end">Surname:</th>
                        <td>{adminDetails?.cognome}</td>
                      </tr>
                      <tr>
                        <th scope="row" className="text-end">Email:</th>
                        <td>{adminDetails?.email}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="text-center mt-3">
                    <FaEdit 
                      className="text-primary" 
                      style={{cursor: 'pointer', fontSize: '1.5em'}} 
                      onClick={() => setEditing(true)}
                      title="Edit Profile"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-4 mb-3 mb-md-0">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title fs-4">Total Courses</h5>
                  <p className="card-text fs-1">{coursesCount}</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title fs-4">Total Students</h5>
                  <p className="card-text fs-1">{studentsCount}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleUpdateAdmin}>
                  <h3 className="card-title text-center mb-4">Edit Profile</h3>
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
                  <div className="text-center mt-4">
                    <FaSave 
                      className="text-success me-3" 
                      style={{cursor: 'pointer', fontSize: '2em'}} 
                      onClick={handleUpdateAdmin}
                      title="Save Changes"
                    />
                    <FaUndo 
                      className="text-warning" 
                      style={{cursor: 'pointer', fontSize: '2em'}} 
                      onClick={() => setEditing(false)}
                      title="Cancel"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;



