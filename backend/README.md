🚀 Backend README
Benvenuti nel backend di LearnEasily! Questo README vi guiderà attraverso la struttura e lo scopo dei nostri file di back-end.

- Config

--cloudinary.js: Configura Cloudinary per i caricamenti di immagini e video.
--tokenGenerator.js: Genera token sicuri per l'autenticazione.

- I controllers

--admin.js: : - Gesti operazioni admin-specifiche.
--auth.js: Gestisce l'autenticazione utente.
--course.js: Controlli operazioni relative al corso.
--student.js: Gestisce le operazioni specifiche degli studenti.

- I media

--auth.js: 🚦 Autentica e autorizza le richieste.
--errorHandler.js: Gesti e forma le risposte agli errori.
--Verifica roleCheck.jsi ruoli utente per il controllo degli access.

- Models

--Admin.js: Definisce lo schema per gli utenti di amministrazione.
--Course.js: 📘 Structures the course data model.
--Student.js: Outlines il modello di dati degli studenti.
--User.js: - Rappresenta lo schema generale dell'utente.

- Routes

--auth.js: Definisce le rotte di autenticazione.
--course.js: - Imposta percorsi relativi alla rotta.
--notFound.js: - Maniglie 404 errori.
--user.js: Gestisce le rotte relative agli utenti.

- Punto di ingresso: 🚀 Il file del server principale app.js.


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



