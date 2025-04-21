const express = require('express');
const cors = require('cors');
const db = require('./db'); 
require('dotenv').config(); 

const app = express();
app.use('/uploads', express.static('uploads'));

const fs = require('fs');
const uploadsDir = './uploads';

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}


// Middlewares
app.use(cors());
app.use(express.json());


// Routes
const studentRoutes = require('./routes/studentRoutes');
const authRoutes = require('./routes/authRoutes');
const studyLoungeRoutes = require('./routes/studyLoungeRoutes');
const roomDetailsRoutes = require('./routes/roomDetailsRoutes');
const resourcehubRoutes = require('./routes/resourceRoutes');
const projectRoutes = require('./routes/projectRoutes');
const findProjectsRoutes = require('./routes/findProjectRoutes');




app.use('/api/student', studentRoutes); 
app.use('/api/auth', authRoutes);
app.use('/api/study-lounge', studyLoungeRoutes);
app.use('/api/room-details', roomDetailsRoutes); // Room details routes
app.use('/api/resourcehub', resourcehubRoutes);
app.use('/api/projects', projectRoutes); // Project routes
app.use('/api/find-projects', findProjectsRoutes); // Find Projects routes


// Health check
app.get('/', (req, res) => {
  res.send('UniCon backend is running');
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
