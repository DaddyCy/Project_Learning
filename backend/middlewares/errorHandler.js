// middlewares/errorHandler.js

export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    // 400 - BAD REQUEST - Gestisce errori di richieste mal formate o dati non validi
    if (err.status === 400 || err.name === "ValidationError") {
        return res.status(400).json({ error: 'Errore di validazione', details: err.message });
    }
    // 401 - UNAUTHORIZED - Gestisce errori di autenticazione
    if (err.status === 401 || err.name === 'UnauthorizedError') {
        return res.status(401).json({ error: 'Errore di autenticazione', message: "Richiesta nuova autenticazione",});
    }
  
    // 500 - INTERNAL SERVER ERROR - Gestisce tutti gli altri errori non specificati
    // res.status(500).json({ error: 'Errore interno del server',message: "Errore generico"});
    res.status(500).json({ 
        error: 'Errore interno del server',
        message: err.message || "Errore generico",
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
      });

};

