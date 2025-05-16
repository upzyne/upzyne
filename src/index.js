const express = require('express');
const app = express();
const PORT = 4000;
const licenseRoutes = require('./routes/licenseRoutes');

require('dotenv').config();

app.use(express.json());

// Routes
app.use('/api', licenseRoutes);

app.get('/', (req, res) => {
  res.send('Upzyne API Running...');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
