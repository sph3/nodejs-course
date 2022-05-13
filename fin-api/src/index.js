const express = require('express');
const { v4: uuid } = require('uuid');

const app = express();
app.use(express.json());

const customers = [];
/**
 * account properties
 * cpf - string - user provided
 * name - string - user provided
 * id - uuid
 * statement - []
 */

app.post('/account', (req, res) => {
  const { name, cpf } = req.body;
  const id = uuid();
  customers.push({
    cpf,
    name,
    id,
    statement: [],
  });

  return res.status(201).send('Account created');
});

const PORT = 3333;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
