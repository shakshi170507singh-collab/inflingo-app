const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const jwt = require('jsonwebtoken');

const VALID_CATEGORIES = [
  'academics', 'exams', 'events', 'placements',
  'sports', 'scholarships', 'lost-found', 'general',
];

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

router.get('/', auth, async (req, res) => {
  try {
    const { course, year } = req.user;
    const notices = await prisma.notice.findMany({
      where: {
        OR: [
          { targetCourse: 'ALL' },
          { targetCourse: course, targetYear: 'ALL' },
          { targetCourse: course, targetYear: String(year) },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(notices);
  } catch (err) {
    console.error('NOTICES ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  const allowed = ['cr', 'event_manager', 'admin'];
  if (!allowed.includes(req.user.role)) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  const { title, content, category, targetCourse, targetDepartment, targetYear } = req.body;

  if (!title || !content || !category) {
    return res.status(400).json({ error: 'title, content, and category are required' });
  }
  if (!VALID_CATEGORIES.includes(category)) {
    return res.status(400).json({ error: 'Invalid category' });
  }

  try {
    const notice = await prisma.notice.create({
      data: {
        title,
        content,
        category,
        targetCourse: targetCourse || 'ALL',
        targetDepartment: targetDepartment || 'ALL',
        targetYear: targetYear || 'ALL',
        authorId: req.user.userId,
      },
    });
    res.status(201).json(notice);
  } catch (err) {
    console.error('POST ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admins only' });
  }
  try {
    await prisma.notice.delete({ where: { id: req.params.id } });
    res.json({ message: 'Notice deleted' });
  } catch (err) {
    console.error('DELETE ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const notice = await prisma.notice.findUnique({
      where: { id: req.params.id },
    });
    if (!notice) return res.status(404).json({ error: 'Not found' });
    res.json(notice);
  } catch (err) {
    console.error('GET BY ID ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const jwt = require('jsonwebtoken');

const VALID_CATEGORIES = [
  'academics', 'exams', 'events', 'placements',
  'sports', 'scholarships', 'lost-found', 'general',
];

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

router.get('/', auth, async (req, res) => {
  try {
    const { course, year } = req.user;
    const notices = await prisma.notice.findMany({
      where: {
        OR: [
          { targetCourse: 'ALL' },
          { targetCourse: course, targetYear: 'ALL' },
          { targetCourse: course, targetYear: String(year) },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(notices);
  } catch (err) {
    console.error('NOTICES ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  const allowed = ['cr', 'event_manager', 'admin'];
  if (!allowed.includes(req.user.role)) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  const { title, content, category, targetCourse, targetDepartment, targetYear } = req.body;

  if (!title || !content || !category) {
    return res.status(400).json({ error: 'title, content, and category are required' });
  }
  if (!VALID_CATEGORIES.includes(category)) {
    return res.status(400).json({ error: 'Invalid category' });
  }

  try {
    const notice = await prisma.notice.create({
      data: {
        title,
        content,
        category,
        targetCourse: targetCourse || 'ALL',
        targetDepartment: targetDepartment || 'ALL',
        targetYear: targetYear || 'ALL',
        authorId: req.user.userId,
      },
    });
    res.status(201).json(notice);
  } catch (err) {
    console.error('POST ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admins only' });
  }
  try {
    await prisma.notice.delete({ where: { id: req.params.id } });
    res.json({ message: 'Notice deleted' });
  } catch (err) {
    console.error('DELETE ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const notice = await prisma.notice.findUnique({
      where: { id: req.params.id },
    });
    if (!notice) return res.status(404).json({ error: 'Not found' });
    res.json(notice);
  } catch (err) {
    console.error('GET BY ID ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;