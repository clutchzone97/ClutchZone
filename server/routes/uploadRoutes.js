import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { protect } from "../middleware/authMiddleware.js";
import { slugify } from "../utils/slugify.js";

const router = express.Router();

// Use memory storage to stream directly to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 10 },
});

const uploadMiddleware = (req, res, next) => {
  upload.array("images", 10)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: `خطأ في رفع الملفات: ${err.message}` });
    } else if (err) {
      return res.status(500).json({ message: `خطأ غير معروف في الرفع: ${err.message}` });
    }
    next();
  });
};

// POST /api/upload  -> returns { urls: string[] }
router.post("/", protect, uploadMiddleware, async (req, res) => {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
       console.error("Missing Cloudinary credentials");
       return res.status(500).json({ message: "خطأ في إعدادات الخادم: بيانات Cloudinary مفقودة" });
    }

    const files = req.files || [];
    if (!files.length) return res.status(400).json({ message: "لا توجد ملفات مرفوعة" });
    
    const title = req.query.title || req.body.title || "upload";
    const baseSlug = slugify(title);

    const urls = await Promise.all(
      files.map(
        (file, index) =>
          new Promise((resolve, reject) => {
            // Create a unique public_id: slug + index + short-hash to avoid collisions if multiple files
            const uniqueSuffix = Date.now().toString().slice(-4) + Math.round(Math.random() * 100);
            const publicId = `${baseSlug}-${index + 1}-${uniqueSuffix}`;
            
            const stream = cloudinary.uploader.upload_stream(
              {
                folder: "clutchzone/uploads",
                public_id: publicId,
                resource_type: "image",
                overwrite: false,
                format: "auto",     // Automatically optimize format (webp/avif)
                quality: "auto",    // Automatically optimize quality
              },
              (error, result) => {
                if (error) return reject(error);
                // Return secure_url directly as transformation is handled by auto:format/quality
                resolve(result.secure_url);
              }
            );
            stream.end(file.buffer);
          })
      )
    );

    res.json({ urls });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: `فشل رفع الصور: ${err.message}` });
  }
});

export default router;