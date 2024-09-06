import Student from '../models/Student.js';
import User from '../models/User.js';
import { cloudinary } from '../config/cloudinary.js';



export const updateStudent = async (req, res) => {
  try {
    const { nome, cognome, email, currentPassword, newPassword } = req.body;
    const student = await Student.findOne({ user: req.user.userId }).populate('user');
    
    if (!student) {
      return res.status(404).json({ message: 'Studente non trovato' });
    }

    // Update basic info
    student.user.nome = nome || student.user.nome;
    student.user.cognome = cognome || student.user.cognome;
    student.user.email = email || student.user.email;

    // Handle password change if requested
    if (currentPassword && newPassword) {
      // Verify current password
      const isMatch = await student.user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Password attuale non corretta' });
      }
      
      // Set new password
      student.user.password = newPassword;
    } else if ((currentPassword && !newPassword) || (!currentPassword && newPassword)) {
      return res.status(400).json({ message: 'Per cambiare la password, fornire sia la password attuale che la nuova password' });
    }

    await student.user.save();
    res.json({ message: 'Dati studente aggiornati con successo' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nessun file caricato' });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'avatars',
      width: 150,
      height: 150,
      crop: 'fill'
    });

    const student = await Student.findOneAndUpdate(
      { user: req.user.userId },
      { avatar: result.secure_url },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Studente non trovato' });
    }

    res.json({ 
      message: 'Avatar caricato con successo',
      avatar: student.avatar 
    });
  } catch (error) {
    console.error('Errore durante il caricamento dell\'avatar:', error);
    res.status(500).json({ message: 'Errore durante il caricamento dell\'avatar' });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nessun file caricato' });
    }

    const student = await Student.findOne({ user: req.user.userId });

    if (!student) {
      return res.status(404).json({ message: 'Studente non trovato' });
    }

    // Se esiste già un avatar, elimina quello vecchio da Cloudinary
    if (student.avatar) {
      const publicId = student.avatar.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'avatars',
      width: 150,
      height: 150,
      crop: 'fill'
    });

    student.avatar = result.secure_url;
    await student.save();

    res.json({ 
      message: 'Avatar aggiornato con successo',
      avatar: student.avatar 
    });
  } catch (error) {
    console.error('Errore durante l\'aggiornamento dell\'avatar:', error);
    res.status(500).json({ message: 'Errore durante l\'aggiornamento dell\'avatar' });
  }
};

export const deleteAvatar = async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { user: req.user.userId },
      { $unset: { avatar: "" } },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Studente non trovato' });
    }

    res.json({ message: 'Avatar eliminato con successo' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentDetails = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.userId })
      .populate('user', '-password')
      .populate('corsiIscritti', 'titolo descrizione');
    
    if (!student) {
      return res.status(404).json({ message: 'Studente non trovato' });
    }
    
    const studentDetails = {
      id: student._id,
      nome: student.user.nome,
      cognome: student.user.cognome,
      email: student.user.email,
      avatar: student.avatar,
      username: student.username,
      corsiIscritti: student.corsiIscritti.map(corso => ({
        id: corso._id,
        titolo: corso.titolo,
        descrizione: corso.descrizione
      })),
      dataDiIscrizione: student.createdAt
    };
    
    res.json(studentDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

