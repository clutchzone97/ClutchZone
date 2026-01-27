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
  upload.array("image", 10)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: `خطأ في رفع الملفات: ${err.message}` });
    } else if (err) {
      return res.status(500).json({ message: `خطأ غير معروف في الرفع: ${err.message}` });
    }
    next();
  });
};

// Diagnostics: Check environment/config readiness without exposing secrets
router.get("/status", (req, res) => {
  const hasCloudName = !!process.env.CLOUDINARY_CLOUD_NAME;
  const hasApiKey = !!process.env.CLOUDINARY_API_KEY;
  const hasApiSecret = !!process.env.CLOUDINARY_API_SECRET;
  res.json({
    cloudinary: {
      cloud_name_set: hasCloudName,
      api_key_set: hasApiKey,
      api_secret_set: hasApiSecret,
    },
    multerLimits: { fileSize: 10 * 1024 * 1024, files: 10 },
    requiresAuth: true,
  });
});

// POST /api/upload  -> returns { urls: string[] }
router.post("/", protect, uploadMiddleware, async (req, res) => {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
       console.error("Missing Cloudinary credentials");
       return res.status(500).json({ message: "خطأ في إعدادات الخادم: بيانات Cloudinary مفقودة" });
    }

    const files = req.files || [];
    if (!files.length) {
       // Check if a single file was uploaded just in case (though we use array('image'))
       if (req.file) files.push(req.file);
       else return res.status(400).json({ message: "Image file is required" });
    }
    
    // Title validation (now from body)
    const title = req.body.title;
    console.log("Upload request - Files:", files.length, "Title:", title, "Body:", req.body);
    
    if (!title || !String(title).trim()) {
      return res.status(400).json({ message: "Title is required" });
    }
    const baseSlug = slugify(title);

    const urls = await Promise.all(
      files.map(
        (file, index) =>
          new Promise((resolve, reject) => {
            // SEO-friendly filename: title-slug-index
            // We use the slugified title as the public_id base.
            // Cloudinary will handle the extension if we don't include it in public_id, 
            // but we want readable names.
            const publicId = `${baseSlug}-${Date.now()}-${index + 1}`;
            
            const stream = cloudinary.uploader.upload_stream(
              {
                folder: "clutchzone",
                public_id: publicId,
                resource_type: "image",
                overwrite: false,
              },
              (error, result) => {
                if (error) return reject(error);
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
