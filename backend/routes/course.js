import express from 'express';
import { 
    getAllCourses, 
    getCourse, 
    createCourse, 
    updateCourse, 
    deleteCourse, 
    enrollCourse, 
    unenrollCourse, 
    getEnrolledCourses, 
    addLesson, 
    updateLesson, 
    deleteLesson,
    getLessonDetail
} from '../controllers/course.js';
import { roleCheck } from '../middlewares/roleCheck.js';
import {cloudinaryService} from '../config/cloudinary.js';

const router = express.Router();

// Rotte accessibili a tutti gli utenti autenticati
router.get('/', getAllCourses);
router.get('/:id', getCourse);
router.get('/:id/lessons/:lessonId', roleCheck(['student', 'admin']), getLessonDetail);

// Rotte accessibili solo agli studenti
router.post('/student/:id/enroll', roleCheck(['student']), enrollCourse);
router.post('/student/:id/unenroll', roleCheck(['student']), unenrollCourse);
router.get('/student/my-courses', roleCheck(['student']), getEnrolledCourses);

// Rotte accessibili solo all'admin
router.post('/admin', roleCheck(['admin']), cloudinaryService.single('immagine'), createCourse);
router.put('/admin/:id', roleCheck(['admin']), cloudinaryService.single('immagine'), updateCourse);
router.delete('/admin/:id', roleCheck(['admin']), deleteCourse);
// router.post('/admin/:id/lessons', roleCheck(['admin']), cloudinaryService.single('videoUrl'), addLesson);
router.post('/admin/:id/lessons', roleCheck(['admin']), cloudinaryService.single('videoUrl'), addLesson);
router.put('/admin/:id/lessons/:lessonId', roleCheck(['admin']), cloudinaryService.single('videoUrl'), updateLesson);
router.delete('/admin/:id/lessons/:lessonId', roleCheck(['admin']), deleteLesson);

export default router;

