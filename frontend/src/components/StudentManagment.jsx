import React, { useState, useEffect } from 'react';
import { getAllStudents, deleteStudent } from '../services/AxiosApi.js';
import { FaTrash } from 'react-icons/fa';
import './StudentManagment.css';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchStudents();
  }, [currentPage]);

  const fetchStudents = async () => {
    try {
      const response = await getAllStudents(currentPage, 6);
      setStudents(response.data.students);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questo studente?')) {
      try {
        await deleteStudent(id);
        fetchStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  return (
    <div className="student-management">
      <h2 className="student-list-title">Lista Studenti</h2>
      
      {totalPages > 1 && (
        <div className="pagination-container mb-4">
          <nav aria-label="Student list pagination">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
              </li>
              <li className="page-item active">
                <span className="page-link page-number">
                  {currentPage} di {totalPages}
                </span>
              </li>
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
      
      <div className="table-container">
        <div className="table-responsive">
          <table className="table table-hover table-striped">
            <thead className="thead-dark">
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Username</th>
                <th>Corsi Iscritti</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td>{student.nome} {student.cognome}</td>
                  <td>{student.email}</td>
                  <td>{student.username}</td>
                  <td>{student.corsiIscritti}</td>
                  <td>
                    <FaTrash
                      className="text-danger"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleDeleteStudent(student.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentManagement;