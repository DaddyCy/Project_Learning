// app.js
import express from 'express';
import mongoose from 'mongoose';
import {errorHandler} from './middlewares/errorHandler.js';
import dotenv from "dotenv";
import listEndpoints from "express-list-endpoints";
import { authenticateToken } from './middlewares/auth.js';

// Import routes
import notFound from './routes/notFound.js';
import auth from './routes/auth.js';
import course from './routes/course.js';
import user from './routes/user.js';

dotenv.config();
const app = express();

app.use(express.json());


mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connesso"))
    .catch((err) => console.error("Errore di connessione MongoDB:", err));

// Aggiungi questo evento per monitorare lo stato della connessione
mongoose.connection.on('error', err => {
  console.error('Errore di connessione MongoDB:', err);
});



    // Routes
app.use('/api/auth', auth);
app.use('/api/users', authenticateToken, user);
app.use('/api/courses', authenticateToken, course);

const port = process.env.PORT || 5000;

// 404 Not Found
app.use(notFound);
// Error handler
app.use(errorHandler);

// Avvio del server
app.listen(port, () => {
  console.log(`Server in esecuzione sulla porta ${port}`);

  // Stampa tutte le rotte disponibili in formato tabellare
  console.log("Rotte disponibili:");
  console.table(
      listEndpoints(app).map((route) => ({
      path: route.path,
      methods: route.methods.join(", "),
      })),
  );
});