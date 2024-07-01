const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;

const DB_FILE = path.join(__dirname, '../db.json');

// Helper function to read and write to db.json
const readDb = async () => {
  try {
    const data = await fs.readFile(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading db.json:', err);
    return [];
  }
};

const writeDb = async (data) => {
  try {
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing to db.json:', err);
  }
};

// GET all notes
router.get('/', async (req, res) => {
  try {
    const notes = await readDb();
    res.json(notes);
  } catch (err) {
    console.error('Error fetching notes:', err);
    res.status(500).send('Server Error');
  }
});

// POST a new note
router.post('/', async (req, res) => {
  try {
    const notes = await readDb();
    const newNote = {
      id: notes.length + 1,
      title: req.body.title,
      text: req.body.text
    };
    notes.push(newNote);
    await writeDb(notes);
    res.status(201).json(newNote);
  } catch (err) {
    console.error('Error saving note:', err);
    res.status(500).send('Server Error');
  }
});

// DELETE a note by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let notes = await readDb();
    notes = notes.filter(note => note.id !== parseInt(id));
    await writeDb(notes);
    res.sendStatus(204);
  } catch (err) {
    console.error('Error deleting note:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
