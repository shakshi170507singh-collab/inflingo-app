const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Student applies to become CR
router.post('/request', auth, async (req, res) => {
  try {
    const existing = await prisma.cRRequest.findFirst({
      where: { userId: req.user.userId, status: 'pending' }
    });
    if (existing) return res.status(400).json({ error: 'Request already pending' });

    await prisma.cRRequest.create({
      data: { userId: req.user.userId }
    });
    res.status(201).json({ message: 'CR request submitted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Admin sees all pending requests
router.get('/requests', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admins only' });
  try {
    const requests = await prisma.cRRequest.findMany({
      where: { status: 'pending' },
      include: { user: { select: { name: true, email: true, course: true, department: true, year: true } } }
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Admin approves CR
router.patch('/approve/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admins only' });
  try {
    const request = await prisma.cRRequest.update({
      where: { id: req.params.id },
      data: { status: 'approved' }
    });
    await prisma.user.update({
      where: { id: request.userId },
      data: { role: 'cr' }
    });
    res.json({ message: 'CR approved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Admin rejects CR
router.patch('/reject/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admins only' });
  try {
    await prisma.cRRequest.update({
      where: { id: req.params.id },
      data: { status: 'rejected' }
    });
    res.json({ message: 'CR request rejected' });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;