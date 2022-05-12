const express = require('express');
const res = require('express/lib/response');

const app = express();
app.use(express.json());

/**
 * Route params
 * 'route/:param'
 * req.params
 *
 * Query params
 * 'route?param=value&another_param=2'
 * req.query
 *
 * Body params
 * json: { "key": "value" }
 * req.body
 */

app.get('/courses', (req, res) => {
  return res.json(['Curso 1', 'Curso 2', 'Curso 3']);
});

app.post('/courses', (req, res) => {
  const body = req.body;
  console.log(body);
  return res.json(['Curso 1', 'Curso 2', 'Curso 3', 'Curso 4']);
});

app.put('/courses/:id', (req, res) => {
  const { id } = req.params;
  console.log('id:', id);
  return res.json(['Curso 6', 'Curso 2', 'Curso 3', 'Curso 4']);
});

app.patch('/courses/:id', (req, res) => {
  const { page } = req.query;
  console.log('page:', page);
  return res.json(['Curso 6', 'Curso 7', 'Curso 3', 'Curso 4']);
});

app.delete('/courses/:id', (req, res) => {
  return res.json(['Curso 6', 'Curso 7', 'Curso 4']);
});

// localhost:3333
const PORT = 3333;
app.listen(PORT);
