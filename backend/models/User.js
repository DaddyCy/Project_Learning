import mongoose from 'mongoose';
// import { hashPassword } from '../middlewares/hashPassword.js';
import bcrypt from 'bcryptjs';

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
  refreshToken: { type: String }
}, {
  timestamps: true,
  collection: "users"
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);





















