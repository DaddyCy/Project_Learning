import jwt from 'jsonwebtoken';

// export const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (token == null) return res.sendStatus(401);

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// };

// export const comparePassword = async (enteredPassword, storedPassword) => {
//   return await bcrypt.compare(enteredPassword, storedPassword);
// };


export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'Accesso negato. Token mancante.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log('Decoded token:', decoded);  // Log per debugging

    req.user = {
      userId: decoded.userId,
      ruolo: decoded.ruolo  // Assicurati che questo corrisponda al payload del token
    };

    next();
  } catch (error) {
    console.error('Error verifying token:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token scaduto. Effettua nuovamente il login.' });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: 'Token non valido.' });
    }

    res.status(500).json({ message: 'Errore interno del server durante la verifica del token.' });
  }
};




