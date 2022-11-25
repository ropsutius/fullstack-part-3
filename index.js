require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('build'));

morgan.token('person', (req) => {
  console.log(req.body);
  if (
    req.body &&
    Object.keys(req.body).length === 0 &&
    Object.getPrototypeOf(req.body) === Object.prototype
  )
    return '';
  else return JSON.stringify(req.body);
});
const s = `:method :url :status :res[content-length] - :response-time ms :person`;
app.use(morgan(s));

app.get('/api/persons', (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then((person) => {
    if (person) res.json(person);
    else res.status(404).json({ error: 'person not found' });
  });
});

app.post('/api/persons', (req, res, next) => {
  const body = req.body;
  new Person({
    name: body.name,
    number: body.number,
  })
    .save()
    .then((person) => res.json(person))
    .catch((error) => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
  const { number } = req.body;

  Person.findByIdAndUpdate(
    req.params.id,
    { number },
    {
      new: true,
      runValidators: true,
      context: 'query',
    }
  )
    .then((person) => {
      if (person) res.json(person);
      else res.status(404).json({ error: 'person not found' });
    })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((person) => {
      if (person) res.status(204).end();
      else res.status(404).json({ error: 'person not found' });
    })
    .catch((error) => next(error));
});

app.get('/info', (req, res) => {
  Person.find({}).then((persons) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`);
  });
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};
app.use(errorHandler);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
