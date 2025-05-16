const express = require('express');
const app = express();
const PORT = 4000;

require('dotenv').config();

const licenseRoutes = require('./routes/licenseRoutes');
const authRoutes = require('./routes/authRoutes');

app.use(express.json());

app.use('/api', authRoutes);       // /api/login
app.use('/api', licenseRoutes);    // /api/licenses (secured)

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
