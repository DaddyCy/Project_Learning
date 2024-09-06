import express from 'express';
import {
  updateStudent,
  uploadAvatar,
  updateAvatar,
  deleteAvatar,
  getStudentDetails,
} from '../controllers/student.js';
import {
  updateAdmin,
  deleteAdmin,
  deleteStudent,
  getAllStudents,
  getAdminDetails
} from '../controllers/admin.js';
import { roleCheck } from '../middlewares/roleCheck.js';
import { cloudinaryService } from '../config/cloudinary.js';

const router = express.Router();



// Rotte per studenti
router.get('/student/details', roleCheck(['student']), getStudentDetails)
router.put('/student/update', roleCheck(['student']), updateStudent);
router.post('/student/avatar', roleCheck(['student']), cloudinaryService.single('avatar'), uploadAvatar);
router.put('/student/avatar', roleCheck(['student']), cloudinaryService.single('avatar'), updateAvatar);
router.delete('/student/avatar', roleCheck(['student']), deleteAvatar);

// Rotte per admin
router.put('/admin/update', roleCheck(['admin']), updateAdmin);
router.delete('/admin', roleCheck(['admin']), deleteAdmin);
router.delete('/admin/student/:id', roleCheck(['admin']), deleteStudent);
router.get('/admin/students', roleCheck(['admin']), getAllStudents);
router.get('/admin/details', roleCheck(['admin']), getAdminDetails);
export default router;












// import express from 'express';
// import { updateStudent, updateAvatar, deleteAvatar, getStudentDetails,} from '../controllers/student.js';
// import { updateAdmin, deleteAdmin, deleteStudent,getAllStudents } from '../controllers/admin.js';
// import { roleCheck } from '../middlewares/roleCheck.js';
// import {cloudinaryService} from '../config/cloudinary.js';

// const router = express.Router();

// // Rotte per studenti
// router.put('/student/update', roleCheck(['student']), updateStudent);
// router.put('/student/avatar', roleCheck(['student']), cloudinaryService.single('avatar'), updateAvatar);
// router.delete('/student/avatar', roleCheck(['student']), deleteAvatar);
// router.get('/student/details', roleCheck(['student']), getStudentDetails);

// // Rotte per admin
// router.put('/admin/update', roleCheck(['admin']), updateAdmin);
// router.delete('/admin', roleCheck(['admin']), deleteAdmin);
// router.delete('/student/:id', roleCheck(['admin']), deleteStudent);
// router.get('/students', roleCheck(['admin']), getAllStudents);

// export default router;



// const express = require('express');
// const router = express.Router();
// const usersController = require('../controllers/usersController');
// const { authenticateToken } = require('../middlewares/auth');

// router.get('/', authenticateToken, usersController.getAllUsers);
// router.delete('/:id', authenticateToken, usersController.deleteUser);
// router.put('/:id', authenticateToken, usersController.updateUser);

// module.exports = router;