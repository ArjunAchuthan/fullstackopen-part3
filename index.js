import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json()); // Middleware to parse JSON request body
app.use(cors()); // Enable CORS for frontend communication

// Custom Morgan token to log request body for POST requests
morgan.token('post-data', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : '';
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'));

let persons = [
    { id: "1", name: "Arto Hellas", number: "040-123456" },
    { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
    { id: "3", name: "Dan Abramov", number: "12-43-234345" },
    { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
];

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const person = persons.find(p => p.id === id);
    
    if (person) {
        res.json(person);
    } else {
        res.status(404).json({ error: "Person not found" });
    }
});

app.post('/api/persons', (req, res) => {
    console.log('Received POST request:', req.body); // Log incoming data
    
    const { name, number } = req.body;
    
    if (!name || !number) {
        return res.status(400).json({ error: "Name and number are required" });
    }

    if (persons.some(p => p.name === name)) {
        return res.status(400).json({ error: "Name must be unique" });
    }
    
    let newId;
    do {
        newId = Math.floor(Math.random() * 1000000).toString();
    } while (persons.some(p => p.id === newId)); // Ensure unique ID
    
    const newPerson = { id: newId, name, number };
    
    persons.push(newPerson);
    res.status(201).json(newPerson);
});

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const initialLength = persons.length;
    persons = persons.filter(p => p.id !== id);
    
    if (persons.length < initialLength) {
        res.status(204).end();
    } else {
        res.status(404).json({ error: "Person not found" });
    }
});

app.get('/info', (req, res) => {
    const numberOfEntries = persons.length;
    const currentTime = new Date();
    res.send(
        `<p>Phonebook has info for ${numberOfEntries} people</p>
         <p>${currentTime}</p>`
    );
});

// Serve frontend build
app.use(express.static(path.join(__dirname, 'dist')));

// Handle unknown routes (redirect to frontend)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const errorHandler = (err, req, res, next) => {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
