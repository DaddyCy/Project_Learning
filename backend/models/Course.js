import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  titolo: { type: String, required: true },
  descrizione: { type: String, required: true },
  videoUrl: { type: String , required: true },
  durata: { type: Number, required: true }
}, 
{
  timestamps: true,
  collection:"lessons"
},
);

const courseSchema = new mongoose.Schema({
  titolo: { type: String, required: true },
  descrizione: { type: String, required: true },
  immagine: { type: String },
  lezioni: [lessonSchema]
  },
  {
    timestamps: true,
    collection: "courses"
  }
);

export default mongoose.model('Course', courseSchema);
















