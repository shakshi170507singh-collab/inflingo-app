const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
  ],
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