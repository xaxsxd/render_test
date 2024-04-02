const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const app = express();

app.use(express.json());
app.use(morgan('tiny'));
app.use(cors())
app.use(express.static('dist'))

let notes = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

app.get('/api/persons', (req, res) => {
    res.json(notes);
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const note = notes.find(n => n.id === id);
    if (note) {
        res.json(note);
    } else {
        res.status(404).send({ error: 'Not found' });
    }
});

app.get('/info', (req, res) => {
    const date = new Date();
    const info = `Phonebook has info for ${notes.length} people<br/>${date}`;
    res.send(info);
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    notes = notes.filter(note => note.id !== id);
    res.status(204).end();
});

app.post('/api/persons', (req, res) => {
    const { name, number } = req.body;

    if (!name || !number) {
        return res.status(400).json({ error: 'The name or number is missing' });
    }

    if (notes.some(note => note.name === name)) {
        return res.status(400).json({ error: 'name must be unique' });
    }

    const newId = Math.floor(Math.random() * 1000000);
    const newNote = {
        id: newId,
        name: name,
        number: number
    };

    notes = notes.concat(newNote);
    res.status(201).json(newNote);
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
