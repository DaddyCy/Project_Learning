import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  avatar: { type: String },
  corsiIscritti: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  username: { type: String, unique: true, required: true }
}, {
  timestamps: true,
  collection: "students"
});

export default mongoose.model("Student", studentSchema);

