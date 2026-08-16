import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import pkg from 'multer-storage-cloudinary';

const CloudinaryStorage = (pkg as any).CloudinaryStorage || pkg;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'app_uploads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    public_id: (_req: any, _file: any) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      return `${uniqueSuffix}`;
    },
  } as any,
});

export const upload = multer({ 
  storage: storage as unknown as multer.StorageEngine,
  limits: { fileSize: 10 * 1024 * 1024 }
});