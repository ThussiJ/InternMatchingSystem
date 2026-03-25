import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import path from 'path';
import fs from 'fs';

const uploadDir = path.join(__dirname, '../../uploads');
const cvDir = path.join(__dirname, '../../uploads/cvs');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(cvDir)) {
  fs.mkdirSync(cvDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'cv') {
      cb(null, cvDir);
    } else {
      cb(null, uploadDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.fieldname === 'cv') {
    if (file.mimetype === 'application/pdf' || file.mimetype.includes('word')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and Word documents are allowed') as any, false);
    }
  } else if (file.fieldname === 'profile_picture' || file.fieldname === 'cover_image') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed') as any, false);
    }
  } else {
    cb(new Error('Unexpected field: ' + file.fieldname) as any, false);
  }
};

export const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});
