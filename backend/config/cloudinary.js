//TODO Modificare grandezza file?

// Importiamo le dipendenze necessarie
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import "dotenv/config";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "lessons_courses",
        allowed_formats: ["jpg", "png", "jpeg", "gif", "mov", "mp4", "avi"],
        resource_type: "auto"
    },
});

const cloudinaryService = multer({ 
    storage: storage,
    limits: { fileSize: 32 * 1024 * 1024 } 
}); 

export { cloudinaryService, cloudinary };