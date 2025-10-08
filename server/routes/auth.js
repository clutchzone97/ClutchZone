import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User.js';

const router = express.Router();

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user;
    if (req.app.locals.isMongoConnected) {
      user = await User.findOne({ email });
    } else {
      // In-memory fallback
      user = req.app.locals.inMemoryUsers.find(u => u.email === email);
    }

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @desc    Register a new user (for admin creation)
// @route   POST /api/auth/register
// @access  Private/Admin (should be protected in a real app)
router.post('/register', async (req, res) => {
    const { email, password, role } = req.body;

    try {
      if (req.app.locals.isMongoConnected) {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = await User.create({ email, password, role });
        res.status(201).json({
            _id: user._id,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
      } else {
        // In-memory fallback
        const userExists = req.app.locals.inMemoryUsers.find(u => u.email === email);
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = {
            _id: new mongoose.Types.ObjectId().toHexString(),
            email,
            password: hashedPassword,
            role: role || 'admin',
            matchPassword: async function(enteredPassword) {
                return await bcrypt.compare(enteredPassword, this.password);
            }
        };
        req.app.locals.inMemoryUsers.push(newUser);
        res.status(201).json({
            _id: newUser._id,
            email: newUser.email,
            role: newUser.role,
            token: generateToken(newUser._id),
        });
      }
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

export default router;