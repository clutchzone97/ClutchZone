import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export const protect = async (req, res, next) => {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ message: "مشكلة إعدادات الخادم: JWT_SECRET غير مضبوط" });

    let token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "غير مصرح" });

    const decoded = jwt.verify(token, secret);
    req.admin = await Admin.findById(decoded.id).select("-password");
    if (!req.admin) return res.status(401).json({ message: "غير مصرح" });
    next();
  } catch (err) {
    return res.status(401).json({ message: "غير مصرح" });
  }
};
