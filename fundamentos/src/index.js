const express = require('express');

const app = express();

app.get('/', (req, res) => {
  return res.json({ message: 'Hello, World!', test: 'tested!' });
});

// localhost:3333
const PORT = 3333;
app.listen(PORT);
