import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { protect } from "../middleware/authMiddleware.js";

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

    const urls = await Promise.all(
      files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                folder: "clutchzone/uploads",
                resource_type: "image",
                overwrite: false,
              },
              (error, result) => {
                if (error) return reject(error);
                const wmId = process.env.CLOUDINARY_WATERMARK_ID;
                if (wmId) {
                  const wmOpacity = parseInt(process.env.CLOUDINARY_WATERMARK_OPACITY || "60", 10);
                  const wmGravity = process.env.CLOUDINARY_WATERMARK_GRAVITY || "south_east";
                  const wmWidthRatio = parseFloat(process.env.CLOUDINARY_WATERMARK_WIDTH_RATIO || "0.18");
                  const wmX = parseInt(process.env.CLOUDINARY_WATERMARK_X || "15", 10);
                  const wmY = parseInt(process.env.CLOUDINARY_WATERMARK_Y || "15", 10);

                  const transformedUrl = cloudinary.url(result.public_id, {
                    secure: true,
                    sign_url: true,
                    type: "upload",
                    transformation: [
                      {
                        overlay: { public_id: wmId, type: "upload" },
                        gravity: wmGravity,
                        opacity: wmOpacity,
                        flags: "relative",
                        width: wmWidthRatio,
                        x: wmX,
                        y: wmY,
                      },
                    ],
                  });
                  resolve(transformedUrl);
                } else {
                  resolve(result.secure_url);
                }
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