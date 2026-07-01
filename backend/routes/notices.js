const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const auth = require('../middleware/auth');

const VALID_CATEGORIES = [
  'academics', 'exams', 'events', 'placements',
  'sports', 'scholarships', 'lost-found', 'general',
];

router.get('/', auth, async (req, res) => {
  try {
    const { course, year } = req.user;
    const notices = await prisma.notice.findMany({
      where: {
        OR: [
          { targetCourses: { has: 'ALL' } },
          {
            AND: [
              { targetCourses: { has: course } },
              {
                OR: [
                  { targetYears: { has: 'ALL' } },
                  { targetYears: { has: String(year) } },
                ],
              },
            ],
          },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(notices);
  } catch (err) {
    console.error('NOTICES GET ERROR:', err);
    res.status(500).json({ error: 'Failed to load notices' });
  }
});

router.post('/', auth, async (req, res) => {
  const allowed = ['cr', 'event_manager', 'admin'];
  if (!allowed.includes(req.user.role)) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  const { title, content, category, targetCourses, targetDepartment, targetYears } = req.body;

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
        targetCourses: Array.isArray(targetCourses) && targetCourses.length > 0 ? targetCourses : ['ALL'],
        targetDepartment: targetDepartment || 'ALL',
        targetYears: Array.isArray(targetYears) && targetYears.length > 0 ? targetYears : ['ALL'],
        authorId: req.user.userId,
      },
    });
    res.status(201).json(notice);
  } catch (err) {
    console.error('NOTICES POST ERROR:', err);
    res.status(500).json({ error: 'Failed to publish notice' });
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
    console.error('NOTICES DELETE ERROR:', err);
    res.status(500).json({ error: 'Failed to delete notice' });
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
    console.error('NOTICES GET BY ID ERROR:', err);
    res.status(500).json({ error: 'Failed to load notice' });
  }
});

module.exports = router;