import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (admin && (await admin.matchPassword(password))) {
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token });
  } else res.status(401).json({ message: "بيانات الدخول غير صحيحة" });
};

// optional: create admin (only for initial setup)
export const createAdmin = async (req, res) => {
  const { email, password } = req.body;
  const exists = await Admin.findOne({ email });
  if (exists) return res.status(400).json({ message: "المشرف موجود بالفعل" });
  const admin = await Admin.create({ email, password });
  res.status(201).json({ email: admin.email });
};
