import mongoose from 'mongoose';
import { hashPassword } from '../middlewares/hashPassword.js';

const userSchema = new mongoose.Schema({
  ruolo: {
    type: String,
    enum: ["student", "admin"],
    default: "student",
    required: true
  },
  nome: { type: String, required: true },
  cognome: { type: String, required: true },
  dataNascita: { type: Date, required: true },
  email: { type: String, required: true, unique: true },
  password: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return /\d/.test(v);
      },
      message: props => `La password deve contenere almeno un numero!`
    }
  },
  googleId: { type: String },
  refreshToken: { type: String }
}, {
  timestamps: true,
  collection: "users"
});

userSchema.pre('save', hashPassword);

export default mongoose.model("User", userSchema);





















