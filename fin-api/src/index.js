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

app.get('/account/statement/', (req, res) => {
  const { cpf } = req.headers;

  const customer = customers.find((customer) => customer.cpf === cpf);
  if (!customer) {
    return res.status(400).json({ error: "Customer doesn't exist" });
  }

  return res.status(200).json(customer.statement);
});

app.post('/account', (req, res) => {
  const { name, cpf } = req.body;

  const customerAlreadyExists = customers.some(
    (customer) => customer.cpf === cpf
  );

  if (customerAlreadyExists) {
    return res.status(400).json({ error: 'CPF already registered' });
  }

  customers.push({
    cpf,
    name,
    id: uuid(),
    statement: [],
  });

  return res.status(201).send('Account created');
});

const PORT = 3333;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
