import jwt from 'jsonwebtoken';




export const authenticateToken = (req, res, next) => {
  console.log('Inizio autenticazione token');
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('Token mancante');
    return res.status(401).json({ message: 'Accesso negato. Token mancante.' });
  }

  try {
    console.log('Verifica token');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log('Token decodificato:', decoded);

    req.user = {
      userId: decoded.userId,
      ruolo: decoded.ruolo
    };

    console.log('Utente autenticato:', req.user);
    next();
  } catch (error) {
    console.error('Errore verifica token:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token scaduto. Effettua nuovamente il login.' });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: 'Token non valido.' });
    }

    res.status(500).json({ message: 'Errore interno del server durante la verifica del token.' });
  }
};

