require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('build'));
morgan.token('person', (req, res) => {
  console.log(req.body);
  if (
    req.body &&
    Object.keys(req.body).length === 0 &&
    Object.getPrototypeOf(req.body) === Object.prototype
  )
    return '';
  else return JSON.stringify(req.body);
});
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :person'
  )
);

let phonebook = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

const getRandomId = () => Math.round(Math.random() * 1000000);

app.get('/api/persons', (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = phonebook.find((person) => person.id === id);
  if (person) res.json(person);
  else res.status(404).end();
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = phonebook.find((person) => person.id === id);
  if (person) {
    phonebook = phonebook.filter((person) => person.id !== id);
    res.status(204).end();
  } else res.status(404).end();
});

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name) return res.status(400).json({ error: 'Name is required' });
  let person = phonebook.find((person) => person.name === body.name);
  if (person) return res.status(400).json({ error: 'Name must be unique' });
  if (!body.number)
    return res.status(400).json({ error: 'Number is required' });
  res.json(phonebook);

  console.log(getRandomId());
  person = {
    name: body.name,
    number: body.number,
    id: getRandomId(),
  };

  phonebook = phonebook.concat(person);
  res.status(200).end();
});

app.get('/info', (req, res) => {
  res.send(`<p>Phonebook has info for ${phonebook.length} people</p>
            <p>${new Date()}</p>`);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
