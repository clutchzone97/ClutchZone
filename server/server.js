import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import bcrypt from "bcryptjs";
import connectDB from "./config/db.js";
import carRoutes from "./routes/carRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import Admin from "./models/Admin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });
await connectDB();

async function ensureDefaultAdmin() {
  try {
    const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL;
    const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD;
    const forceReset = String(process.env.DEFAULT_ADMIN_FORCE_RESET || "false").toLowerCase() === "true";

    if (!defaultEmail || !defaultPassword) {
      console.warn("⚠️ لم يتم ضبط DEFAULT_ADMIN_EMAIL/DEFAULT_ADMIN_PASSWORD في البيئة؛ سيتم تخطي إنشاء الأدمن.");
      return;
    }

    const existingAdmin = await Admin.findOne({ email: defaultEmail });

    if (!existingAdmin) {
      // استخدم الـ pre-save hook لتشفير كلمة المرور
      await Admin.create({ email: defaultEmail, password: defaultPassword });
      console.log("✅ تم إنشاء حساب الأدمن الافتراضي بنجاح");
    } else {
      if (forceReset) {
        existingAdmin.password = defaultPassword;
        await existingAdmin.save();
        console.log("🔒 تم إعادة ضبط كلمة مرور الأدمن الافتراضي وفق البيئة");
      } else {
        console.log("ℹ️ حساب الأدمن موجود مسبقًا، لا حاجة لإنشائه.");
      }
    }
  } catch (err) {
    console.error("❌ فشل إنشاء/تحديث حساب الأدمن الافتراضي:", err.message);
  }
}

await ensureDefaultAdmin();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ المسارات (Routes)
app.use("/api/cars", carRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/upload", uploadRoutes);

// ✅ التعامل مع الأخطاء
app.use(errorHandler);

// ✅ تشغيل السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
