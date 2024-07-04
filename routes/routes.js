const express = require('express');
const router = express.Router();
const notesRouter = require('./notes');

// Routes for '/api/notes'
router.use('/notes', notesRouter);

module.exports = router;
