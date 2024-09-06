
BACKEND:

# Analisi dettagliata del codice backend

## 1. cloudinary.js

Questo file configura e esporta il servizio Cloudinary per la gestione dei file multimediali.

- Importa le dipendenze necessarie: multer, cloudinary, CloudinaryStorage e dotenv.
- Configura Cloudinary con le credenziali dell'ambiente.
- Crea un'istanza di CloudinaryStorage per gestire l'upload dei file.
- Configura multer per utilizzare CloudinaryStorage, impostando un limite di dimensione file a 100 MB.
- Esporta cloudinaryService e l'istanza di cloudinary.

## 2. tokenGenerator.js

Questo file genera una chiave crittografica casuale.

- Utilizza il modulo crypto di Node.js.
- Genera e stampa una stringa esadecimale casuale di 64 byte.

## 3. admin.js (controller)

Questo file contiene le funzioni del controller per le operazioni dell'amministratore.

Funzioni principali:
- `updateAdmin`: Aggiorna i dati dell'amministratore, inclusa la possibilità di cambiare la password.
- `deleteAdmin`: Elimina l'account dell'amministratore.
- `getAllStudents`: Recupera tutti gli studenti con paginazione.
- `deleteStudent`: Elimina un account studente.
- `getAdminDetails`: Recupera i dettagli dell'amministratore.

## 4. auth.js (controller)

Gestisce l'autenticazione degli utenti.

Funzioni principali:
- `register`: Registra un nuovo utente (studente o admin).
- `login`: Autentica un utente e genera token di accesso e refresh.
- `refreshToken`: Rinnova il token di accesso usando il refresh token.
- `logout`: Invalida il refresh token dell'utente.

## 5. course.js (controller)

Gestisce le operazioni relative ai corsi.

Funzioni principali:
- `getAllCourses`: Recupera tutti i corsi con paginazione.
- `getCourse`: Recupera i dettagli di un corso specifico.
- `createCourse`: Crea un nuovo corso.
- `updateCourse`: Aggiorna un corso esistente.
- `deleteCourse`: Elimina un corso e le relative risorse.
- `addLesson`: Aggiunge una lezione a un corso.
- `updateLesson`: Aggiorna una lezione esistente.
- `deleteLesson`: Rimuove una lezione da un corso.
- `enrollCourse`: Iscrive uno studente a un corso.
- `unenrollCourse`: Cancella l'iscrizione di uno studente da un corso.
- `getEnrolledCourses`: Recupera i corsi a cui uno studente è iscritto.

## 6. student.js (controller)

Gestisce le operazioni relative agli studenti.

Funzioni principali:
- `updateStudent`: Aggiorna i dati dello studente.
- `uploadAvatar`: Carica un nuovo avatar per lo studente.
- `updateAvatar`: Aggiorna l'avatar esistente dello studente.
- `deleteAvatar`: Rimuove l'avatar dello studente.
- `getStudentDetails`: Recupera i dettagli dello studente.

## 7. auth.js (middleware)

Middleware per l'autenticazione.

- `authenticateToken`: Verifica il token JWT nell'header della richiesta.

## 8. errorHandler.js

Middleware per la gestione centralizzata degli errori.

- Gestisce vari tipi di errori (400, 401, 500) e invia risposte appropriate.

## 9. hashPassword.js

Middleware per l'hashing delle password.

- `hashPassword`: Funzione che utilizza bcrypt per hashare le password prima del salvataggio.

## 10. roleCheck.js

Middleware per il controllo dei ruoli.

- `roleCheck`: Verifica se l'utente ha il ruolo richiesto per accedere a una risorsa.

## 11. Admin.js (model)

Schema Mongoose per il modello Admin.

- Definisce la struttura dati per gli amministratori.

## 12. Course.js (model)

Schema Mongoose per il modello Course.

- Definisce la struttura dati per i corsi e le lezioni.

## 13. Student.js (model)

Schema Mongoose per il modello Student.

- Definisce la struttura dati per gli studenti.

## 14. User.js (model)

Schema Mongoose per il modello User.

- Definisce la struttura dati per gli utenti, inclusi studenti e amministratori.

## 15. auth.js (route)

Definisce le rotte per l'autenticazione.

- Gestisce registrazione, login, refresh token e logout.

## 16. course.js (route)

Definisce le rotte per la gestione dei corsi.

- Include rotte per CRUD dei corsi, gestione delle lezioni, iscrizione ai corsi.

## 17. notFound.js (route)

Gestisce le richieste a rotte non esistenti.

- Invia una risposta 404 per tutte le rotte non definite.

## 18. user.js (route)

Definisce le rotte per la gestione degli utenti.

- Include rotte per aggiornamento profilo, gestione avatar, operazioni admin.

## 19. app.js

File principale dell'applicazione.

- Configura l'applicazione Express.
- Connette al database MongoDB.
- Imposta le rotte principali.
- Configura middleware globali come gestione errori e autenticazione.
- Avvia il server e stampa le rotte disponibili.



## Rotte Backend

| 0       │ '/api/auth/register'                       │ 'POST'              │
│ 1       │ '/api/auth/login'                          │ 'POST'              │
│ 2       │ '/api/auth/refresh-token'                  │ 'POST'              │
│ 3       │ '/api/auth/logout'                         │ 'POST'              │
│ 4       │ '/api/users/student/details'               │ 'GET'               │
│ 5       │ '/api/users/student/update'                │ 'PUT'               │
│ 6       │ '/api/users/student/avatar'                │ 'POST, PUT, DELETE' │
│ 7       │ '/api/users/admin/update'                  │ 'PUT'               │
│ 8       │ '/api/users/admin'                         │ 'DELETE'            │
│ 9       │ '/api/users/admin/student/:id'             │ 'DELETE'            │
│ 10      │ '/api/users/admin/students'                │ 'GET'               │
│ 11      │ '/api/users/admin/details'                 │ 'GET'               │
│ 12      │ '/api/courses'                             │ 'GET'               │
│ 13      │ '/api/courses/:id'                         │ 'GET'               │
│ 14      │ '/api/courses/:id/lessons/:lessonId'       │ 'GET'               │
│ 15      │ '/api/courses/student/:id/enroll'          │ 'POST'              │
│ 16      │ '/api/courses/student/:id/unenroll'        │ 'POST'              │
│ 17      │ '/api/courses/student/my-courses'          │ 'GET'               │
│ 18      │ '/api/courses/admin'                       │ 'POST'              │
│ 19      │ '/api/courses/admin/:id'                   │ 'PUT, DELETE'       │
│ 20      │ '/api/courses/admin/:id/lessons'           │ 'POST'              │
│ 21      │ '/api/courses/admin/:id/lessons/:lessonId' │ 'PUT, DELETE'      



## Esempio scrittura import ed export diversa
// const jwt = require('jsonwebtoken');

// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (token == null) return res.sendStatus(401);

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// };

// const comparePassword = async (enteredPassword, storedPassword) => {
//   return await bcrypt.compare(enteredPassword, storedPassword);
// };

// module.exports = { authenticateToken, comparePassword };