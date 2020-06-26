const express = require('express');
const cors = require('cors');

const { uuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const errorMessages = {
  notFound: 'Repository not found',
};

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;
  const newRepository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(newRepository);

  return response.json(newRepository);
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const index = repositories.findIndex((element) => element.id === id);

  if (index < 0) {
    return response.status(400).json({ error: errorMessages.notFound });
  }

  const oldRepository = repositories[index];
  const updatedRepository = { ...oldRepository, title, url, techs };
  repositories[index] = updatedRepository;

  return response.json(updatedRepository);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const index = repositories.findIndex((element) => element.id === id);

  if (index < 0) {
    return response.status(400).json({ error: errorMessages.notFound });
  }

  repositories.splice(index, 1);

  return response.status(204).json();
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;
  const index = repositories.findIndex((element) => element.id === id);

  if (index < 0) {
    return response.status(400).json({ error: errorMessages.notFound });
  }

  const { likes, ...others } = repositories[index];
  const updatedRepository = { ...others, likes: likes + 1 };
  repositories[index] = updatedRepository;

  return response.json(updatedRepository);
});

module.exports = app;
