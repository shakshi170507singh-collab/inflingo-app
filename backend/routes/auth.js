const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

const JWT_SECRET = process.env.JWT_SECRET;

function signToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
      course: user.course,
      department: user.department,
      year: user.year,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// STUDENT SIGNUP
router.post('/signup', async (req, res) => {
  const { name, email, password, course, department, year } = req.body;

  if (!name || !email || !password || !course || !department || !year) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, course, department, year: parseInt(year), role: 'student' }
    });

    const token = signToken(user);
    res.status(201).json({
      token,
      name: user.name,
      role: user.role,
      course: user.course,
      department: user.department,
      year: user.year,
    });
  } catch (err) {
    console.error('SIGNUP ERROR:', err);
    res.status(500).json({ error: 'Something went wrong, please try again' });
  }
});

// ADMIN SIGNUP (protected by secret key)
router.post('/admin-signup', async (req, res) => {
  const { name, email, password, adminKey } = req.body;

  if (!name || !email || !password || !adminKey) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (adminKey !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ error: 'Invalid admin key' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, course: 'ALL', department: 'ALL', year: 0, role: 'admin' }
    });

    const token = signToken(user);
    res.status(201).json({
      token,
      name: user.name,
      role: user.role,
      course: user.course,
      department: user.department,
      year: user.year,
    });
  } catch (err) {
    console.error('ADMIN SIGNUP ERROR:', err);
    res.status(500).json({ error: 'Something went wrong, please try again' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Invalid email or password' });

    const token = signToken(user);
    res.json({
      token,
      role: user.role,
      name: user.name,
      course: user.course,
      department: user.department,
      year: user.year,
    });
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    res.status(500).json({ error: 'Something went wrong, please try again' });
  }
});

module.exports = router;