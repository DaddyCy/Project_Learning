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
