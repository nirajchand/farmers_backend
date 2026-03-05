// src/middleware/upload.ts
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { Request } from "express";
import { HttpError } from "../errors/http-error";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: "project_farmers",        
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 500, height: 500, crop: "limit" }], 
    public_id: `profile_${Date.now()}`,
  }),
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new HttpError(400, "Only image files are allowed!"));
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,       
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadsCloudinary = {
  single: (fieldName: string) => upload.single(fieldName),
  array: (fieldName: string, maxCount: number) => upload.array(fieldName, maxCount),
  fields: (fieldsArray: { name: string; maxCount?: number }[]) => upload.fields(fieldsArray),
};