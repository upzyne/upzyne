// src/index.js
const express = require('express');
const app = express();
const PORT = 4000;

require('dotenv').config();

const licenseRoutes = require('./routes/licenseRoutes');
const authRoutes = require('./routes/authRoutes');

app.use(express.json());

// Public
app.use('/api', authRoutes);

// Protected
app.use('/api', licenseRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
