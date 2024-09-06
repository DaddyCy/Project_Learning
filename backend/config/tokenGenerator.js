import crypto from 'crypto';

// Creazione Key

console.log(crypto.randomBytes(64).toString('hex'));