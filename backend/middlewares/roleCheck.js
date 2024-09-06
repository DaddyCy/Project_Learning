import User from '../models/User.js';

export const roleCheck = (roles) => {
  return async (req, res, next) => {
    try {
      // Assumiamo che il ruolo sia già presente in req.user dal middleware authenticateToken
      const userRole = req.user.ruolo;  // Cambiato da 'role' a 'ruolo' per corrispondere al tuo schema User

      console.log('User role:', userRole);  // Log per debugging
      console.log('Allowed roles:', roles);  // Log per debugging

      if (roles.includes(userRole)) {
        next();
      } else {
        res.status(403).json({ message: 'Accesso negato. Non hai i permessi necessari.' });
      }
    } catch (error) {
      console.error('Error in roleCheck:', error);  // Log per debugging
      res.status(500).json({ message: 'Errore nel controllo dei permessi' });
    }
  };
};










