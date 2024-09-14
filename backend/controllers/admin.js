import Admin from '../models/Admin.js';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Course from '../models/Course.js';


export const updateAdmin = async (req, res) => {
  try {
    const { nome, cognome, email, currentPassword, newPassword } = req.body;
    const admin = await Admin.findOne({ user: req.user.userId }).populate('user');
   
    if (!admin) {
      return res.status(404).json({ message: 'Admin non trovato' });
    }

    // Update basic info
    Object.assign(admin.user, {
      nome: nome || admin.user.nome,
      cognome: cognome || admin.user.cognome,
      email: email || admin.user.email,
    });

    // Handle password change if requested
    if (currentPassword && newPassword) {
      // Verify current password
      const isMatch = await admin.user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Password attuale non corretta' });
      }
      
      // Set new password
      admin.user.password = newPassword;
    } else if ((currentPassword && !newPassword) || (!currentPassword && newPassword)) {
      return res.status(400).json({ message: 'Per cambiare la password, fornire sia la password attuale che la nuova password' });
    }

    await admin.user.save();
    res.json({ message: 'Dati admin aggiornati con successo' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findOne({ user: req.user.userId });
    if (!admin) {
      return res.status(404).json({ message: 'Admin non trovato' });
    }

    await Promise.all([
      User.findByIdAndDelete(admin.user),
      Admin.findByIdAndDelete(admin._id)
    ]);

    res.json({ message: 'Account admin eliminato con successo' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const students = await User.find({ ruolo: 'student' })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalStudents = await User.countDocuments({ ruolo: 'student' });

    const formattedStudents = await Promise.all(students.map(async (user) => {
      const student = await Student.findOne({ user: user._id }).lean();
      return {
        id: student._id,
        nome: user.nome,
        cognome: user.cognome,
        email: user.email,
        dataNascita: user.dataNascita,
        username: student.username,
        avatar: student.avatar,
        corsiIscritti: student.corsiIscritti.length
      };
    }));

    res.json({
      students: formattedStudents,
      currentPage: page,
      totalPages: Math.ceil(totalStudents / limit),
      totalStudents
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Studente non trovato' });
    }

    await Promise.all([
      User.findByIdAndDelete(student.user),
      Student.findByIdAndDelete(student._id),
      Course.updateMany(
        { _id: { $in: student.corsiIscritti } },
        { $pull: { studenti: student._id } }
      )
    ]);

    res.json({ message: 'Studente eliminato con successo' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminDetails = async (req, res) => {
  try {
    const admin = await Admin.findOne({ user: req.user.userId }).populate('user', '-password');

    if (!admin) {
      return res.status(404).json({ message: 'Admin non trovato' });
    }

    const adminDetails = {
      id: admin._id,
      nome: admin.user.nome,
      cognome: admin.user.cognome,
      email: admin.user.email,
      dataDiRegistrazione: admin.createdAt
    };

    res.json(adminDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




















