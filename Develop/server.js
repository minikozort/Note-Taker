const express = require('express');
const path = require('path');
const fs = require('fs').promises; // For file operations
const apiRouter = require('./routes/routes'); // Assuming you'll define API routes in a separate file

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.use('/api', apiRouter); // This will handle routes like '/api/notes'

// Routes for serving HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/assets/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/assets/notes.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
