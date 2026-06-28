const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/notices', require('./routes/notices'));
app.use('/api/auth', require('./routes/auth'));  
app.use('/api/cr', require('./routes/crrequest'));

app.listen(3000, () => console.log('Server running on port 3000'));