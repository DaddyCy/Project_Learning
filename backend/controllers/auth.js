import User from '../models/User.js';
import Student from '../models/Student.js';
import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';



const generateTokens = (userId, ruolo) => {
  const accessToken = jwt.sign({ userId, ruolo }, process.env.JWT_SECRET, { expiresIn: '2h' });
  const refreshToken = jwt.sign({ userId, ruolo }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};


export const register = async (req, res) => {
  try {
    const { email, password, nome, cognome, dataNascita, ruolo } = req.body;
    // Verifica se esiste già un utente con questa email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Un utente con questa email esiste già' });
    }
    // Se il ruolo è admin, verifica che non esista già un admin
    if (ruolo === 'admin') {
      const adminExists = await Admin.findOne({});
      if (adminExists) {
        return res.status(400).json({ message: 'Un admin è già registrato nel sistema' });
      }
    }
    // Crea il nuovo utente
    const user = new User({ email, password, nome, cognome, dataNascita, ruolo });
    await user.save();
    // Crea il documento corrispondente in base al ruolo
    if (ruolo === 'student') {
      const userId = user._id.toString();
      const idSubstring = userId.substring(6, 10);
      const username = `${nome.toLowerCase()}_${idSubstring}`;
      await Student.create({ user: user._id, username, corsiIscritti: [] });
    } else if (ruolo === 'admin') {
      await Admin.create({ user: user._id });
    }
    res.status(201).json({ message: 'Utente registrato con successo' });
  } catch (error) {
    console.error('Errore durante la registrazione:', error);
    res.status(500).json({ message: 'Errore del server durante la registrazione' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Credenziali non valide' });
    }

    const { accessToken, refreshToken } = generateTokens(user._id, user.ruolo);

    // Salva il refresh token nel database (questo richiede una modifica al modello User)
    user.refreshToken = refreshToken;
    await user.save();

    res.json({ accessToken, refreshToken, ruolo: user.ruolo });
  } catch (error) {
    console.error('Errore durante il login:', error);
    // res.status(400).json({ message: error.message });
    res.status(500).json({ message: 'Errore del server durante il login' });
  }
};

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh Token mancante' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: 'Refresh Token non valido' });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id, user.ruolo);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    res.status(403).json({ message: 'Refresh Token non valido' });
  }
};

export const logout = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    user.refreshToken = null;
    await user.save();
    res.json({ message: 'Logout effettuato con successo' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};











// import  User from '../models/User.js';
// import Student from '../models/Student.js';
// import Admin from '../models/Admin.js';
// import jwt from 'jsonwebtoken';
// import {comparePassword} from '../middlewares/auth.js';

// export const register = async (req, res) => {
//   try {
//     const { role, nome, cognome, dataNascita, email, password } = req.body;

//     const user = new User({ role, nome, cognome, dataNascita, email, password });
//     await user.save();

//     if (role === 'student') {
//       const student = new Student({ user: user._id });
//       await student.save();
//     } else if (role === 'admin') {
//       const admin = new Admin({ user: user._id });
//       await admin.save();
//     }

//     res.status(201).json({ message: 'Utente registrato con successo' });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });

//     if (!user || !(await comparePassword(password, user.password))) {
//       return res.status(400).json({ message: 'Credenziali non valide' });
//     }

//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     res.json({ token });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };


// const User = require('../models/User');
// const Student = require('../models/Student');
// const Admin = require('../models/Admin');
// const jwt = require('jsonwebtoken');
// const { comparePassword } = require('../middlewares/auth');

// exports.register = async (req, res) => {
//   try {
//     const { role, nome, cognome, dataNascita, email, password } = req.body;

//     const user = new User({ role, nome, cognome, dataNascita, email, password });
//     await user.save();

//     if (role === 'student') {
//       const student = new Student({ user: user._id });
//       await student.save();
//     } else if (role === 'admin') {
//       const admin = new Admin({ user: user._id });
//       await admin.save();
//     }

//     res.status(201).json({ message: 'Utente registrato con successo' });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });

//     if (!user || !(await comparePassword(password, user.password))) {
//       return res.status(400).json({ message: 'Credenziali non valide' });
//     }

//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     res.json({ token });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };