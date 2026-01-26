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

// POST /api/upload  -> returns { urls: string[] }
router.post("/", protect, upload.array("images", 10), async (req, res) => {
  try {
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
    res.status(500).json({ message: "فشل رفع الصور" });
  }
});

export default router;