import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js"; // تأكد إن الاسم هنا مطابق لاسم الملف داخل مجلد models

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const hashedPassword = await bcrypt.hash("maxstorm@012", 10);

    const admin = await User.create({
      name: "Admin",
      email: "admin@clutchzone.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ Admin user created successfully:", admin.email);
    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
  }
};

createAdmin();
