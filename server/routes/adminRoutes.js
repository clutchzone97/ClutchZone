import express from "express";
import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "البريد الإلكتروني غير صحيح" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "كلمة المرور غير صحيحة" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "مشكلة إعدادات الخادم: JWT_SECRET غير مضبوط" });
    }
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "تم تسجيل الدخول بنجاح ✅",
      token,
      admin: { id: admin._id, email: admin.email },
    });
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ في الخادم", error: error.message });
  }
};

const router = express.Router();
router.post('/login', login);
export default router;
