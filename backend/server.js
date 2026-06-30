const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://inflingo-app-new.vercel.app', // your stable production domain
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman, curl, or server-to-server)
    if (!origin) return callback(null, true);

    // allow exact matches from the list above
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // allow any Vercel preview URL matching your project's naming pattern
    if (/^https:\/\/inflingo-app-.*\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }

    // anything else gets blocked
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('🚀 Inflingo Backend is Live!');
});

app.use('/api/notices', require('./routes/notices'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cr', require('./routes/crrequest'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});