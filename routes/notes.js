const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;

const { v4: uuidv4 } = require('uuid'); // Import uuid

const DB_FILE = path.join(__dirname, '../db/db.json');

// Helper function to read and write to db.json
const readDb = async () => {
  try {
    const data = await fs.readFile(DB_FILE, 'utf8');
    return data;
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
    res.send(notes);
  } catch (err) {
    console.error('Error fetching notes:', err);
    res.status(500).send('Server Error');
  }
});

// POST a new note with UUID
router.post('/', async (req, res) => {
  try {
    let notes = await readDb();
    const newNote = {
      id: uuidv4(), // Generate a UUID for the new note
      title: req.body.title,
      text: req.body.text
    };
    notes = JSON.parse(notes)
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
    notes = notes.filter(note => note.id !== id); // Use strict comparison since IDs are UUIDs
    await writeDb(notes);
    res.sendStatus(204);
  } catch (err) {
    console.error('Error deleting note:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
