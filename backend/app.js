const express = require('express');
const cors = require('cors');
const db = require('./db'); 
require('dotenv').config(); 

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());


// Routes
const studentRoutes = require('./routes/studentRoutes');
const authRoutes = require('./routes/authRoutes');
const studyLoungeRoutes = require('./routes/studyLoungeRoutes');
app.use('/api/study-lounge', studyLoungeRoutes);

app.use('/api/student', studentRoutes); 
app.use('/api/auth', authRoutes);


// Health check
app.get('/', (req, res) => {
  res.send('UniCon backend is running');
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
