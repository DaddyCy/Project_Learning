import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
}, {
    timestamps: true,
    collection: "admins"
});

export default mongoose.model("Admin", adminSchema);

