import Course from '../models/Course.js';
import Student from '../models/Student.js';
import User from '../models/User.js';
import { cloudinary } from '../config/cloudinary.js'

// Funzioni accessibili a tutti gli utenti autenticati
export const getAllCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    const totalCourses = await Course.countDocuments();
    const courses = await Course.find()
      .select('titolo descrizione immagine')
      .skip(startIndex)
      .limit(limit);

    res.json({
      courses,
      currentPage: page,
      totalPages: Math.ceil(totalCourses / limit),
      totalCourses
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Corso non trovato' });
    
    if (req.user.role === 'student') {
      const student = await Student.findOne({ user: req.user.userId });
      if (!student.corsiIscritti.includes(course._id)) {
        return res.status(403).json({ message: 'Non sei iscritto a questo corso' });
      }
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLessonDetail = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Corso non trovato' });

    const lesson = course.lezioni.id(req.params.lessonId);
    if (!lesson) return res.status(404).json({ message: 'Lezione non trovata' });

    // Restituisci solo il video URL della lezione
    res.json({ videoUrl: lesson.videoUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Funzioni accessibili Admin
export const createCourse = async (req, res) => {
  try {
    const course = new Course(req.body);
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      course.immagine = result.secure_url;
    }
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Corso non trovato' });

    if (req.file) {
      if (course.immagine) {
        const oldPublicId = course.immagine.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(oldPublicId);
      }
      const result = await cloudinary.uploader.upload(req.file.path);
      course.immagine = result.secure_url;
    }

    Object.assign(course, req.body);
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Corso non trovato' });
    
    if (course.immagine) {
      const publicId = course.immagine.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    for (const lezione of course.lezioni) {
      if (lezione.videoUrl) {
        const publicId = lezione.videoUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
      }
    }

    await Course.findByIdAndDelete(req.params.id);
    
    await Student.updateMany(
      { corsiIscritti: course._id },
      { $pull: { corsiIscritti: course._id } }
    );
    
    res.json({ message: 'Corso eliminato con successo' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addLesson = async (req, res) => {
  try {
    console.log('Inizio addLesson');
    console.log('Body ricevuto:', req.body);
    console.log('File ricevuto:', req.file);

    const course = await Course.findById(req.params.id);
    if (!course) {
      console.log('Corso non trovato');
      return res.status(404).json({ message: 'Corso non trovato' });
    }

    const { titolo, descrizione, durata } = req.body;

    if (!titolo || !descrizione || !durata) {
      console.log('Dati mancanti');
      return res.status(400).json({ message: 'Titolo, descrizione e durata sono campi obbligatori' });
    }

    const newLesson = {
      titolo,
      descrizione,
      durata: parseInt(durata, 10)
    };

    if (req.file) {
      try {
        console.log('Caricamento file su Cloudinary');
        const result = await cloudinary.uploader.upload(req.file.path, { 
          resource_type: 'video',
          folder: 'lessons_courses',
          allowed_formats: ['mp4', 'mov', 'avi']
        });
        console.log('Risultato caricamento Cloudinary:', result);
        newLesson.videoUrl = result.secure_url;
      } catch (uploadError) {
        console.error('Errore caricamento Cloudinary:', uploadError);
        return res.status(500).json({ message: 'Errore durante il caricamento del video', error: uploadError.message });
      }
    } else {
      console.log('Nessun file video caricato');
      return res.status(400).json({ message: 'Nessun file video caricato' });
    }

    course.lezioni.push(newLesson);
    await course.save();

    console.log('Lezione aggiunta con successo');
    res.status(201).json(course);
  } catch (error) {
    console.error('Errore in addLesson:', error);
    res.status(500).json({ message: 'Errore interno del server', error: error.message });
  }
};

export const updateLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Corso non trovato' });

    const lesson = course.lezioni.id(req.params.lessonId);
    if (!lesson) return res.status(404).json({ message: 'Lezione non trovata' });

    if (req.file) {
      if (lesson.videoUrl) {
        const oldPublicId = lesson.videoUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(oldPublicId, { resource_type: 'video' });
      }
      const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'video' });
      lesson.videoUrl = result.secure_url;
    }

    Object.assign(lesson, req.body);
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// export const deleteLesson = async (req, res) => {
//   try {
//     const course = await Course.findById(req.params.id);
//     if (!course) return res.status(404).json({ message: 'Corso non trovato' });

//     const lessonIndex = course.lezioni.findIndex(
//       (lezione) => lezione._id.toString() === req.params.lessonId
//     );

//     if (lessonIndex === -1) return res.status(404).json({ message: 'Lezione non trovata' });

//     const lesson = course.lezioni[lessonIndex];
//     if (lesson.videoUrl) {
//       const publicId = lesson.videoUrl.split('/').pop().split('.')[0];
//       await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
//     }

//     course.lezioni.splice(lessonIndex, 1);
//     await course.save();

//     res.json({ message: 'Lezione eliminata con successo' });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

export const deleteLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Corso non trovato' });

    const lesson = course.lezioni.id(req.params.lessonId);
    if (!lesson) return res.status(404).json({ message: 'Lezione non trovata' });

    if (lesson.videoUrl) {
      const publicId = lesson.videoUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
    }

    course.lezioni.pull({ _id: req.params.lessonId });
    await course.save();

    res.json({ message: 'Lezione eliminata con successo' });
  } catch (error) {
    console.error('Errore in deleteLesson:', error);
    res.status(400).json({ message: error.message });
  }
};



// Funzioni accessibili Studenti

export const enrollCourse = async (req, res) => {
  try {
    const { username } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Corso non trovato' });

    const student = await Student.findOne({ username, user: req.user.userId });
    if (!student) return res.status(404).json({ message: 'Studente non trovato o username non corretto' });

    if (student.corsiIscritti.includes(course._id)) {
      return res.status(400).json({ message: 'Sei già iscritto a questo corso' });
    }

    student.corsiIscritti.push(course._id);
    await student.save();

    res.json({ message: 'Iscrizione al corso avvenuta con successo' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unenrollCourse = async (req, res) => {
  try {
    const { username } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Corso non trovato' });

    const student = await Student.findOne({ username, user: req.user.userId });
    if (!student) return res.status(404).json({ message: 'Studente non trovato o username non corretto' });

    const index = student.corsiIscritti.indexOf(course._id);
    if (index > -1) {
      student.corsiIscritti.splice(index, 1);
      await student.save();
      res.json({ message: 'Cancellazione dal corso avvenuta con successo' });
    } else {
      res.status(400).json({ message: 'Non sei iscritto a questo corso' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getEnrolledCourses = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.userId }).populate('corsiIscritti');
    if (!student) return res.status(404).json({ message: 'Studente non trovato' });
    
    res.json(student.corsiIscritti);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
























