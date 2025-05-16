require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({
  origin: process.env.FRONTEND_URL
}));

app.use(express.json());

const usersRouter = require('./routes/users');
app.use('/api/users', usersRouter);

app.get('/', (req, res) => res.send('API is running!'));

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
