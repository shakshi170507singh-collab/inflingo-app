const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // decoded = { userId, email, role, course, department, year }
    req.user = decoded;
    next();
  } catch (err) {
    console.error('AUTH MIDDLEWARE ERROR:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = auth;