const express = require('express');
const { v4: uuid } = require('uuid');

const app = express();
app.use(express.json());

const customers = [];

const checkAccountExists = (req, res, next) => {
  const { cpf } = req.headers;
  const customer = customers.find((customer) => customer.cpf === cpf);
  if (!customer) {
    return res.status(400).json({ error: 'Customer not found' });
  }
  req.customer = customer;
  return next();
};

const getBalance = (statement) => {
  const balance = statement.reduce((acc, operation) => {
    if (operation.type === 'credit') {
      return acc + operation.amount;
    }
    return acc - operation.amount;
  }, 0);

  return balance;
};

app.get('/account/balance', checkAccountExists, (req, res) => {
  const { statement } = req.customer;
  const balance = getBalance(statement);

  return res.status(200).json(balance);
});

app.get('/account/statement', checkAccountExists, (req, res) => {
  const { statement } = req.customer;
  const { date } = req.query;

  // if there's no date query param
  if (!date) {
    return res.status(200).json(statement);
  }

  const dateFormat = new Date(date + ' 00:00');
  const filteredStatement = statement.filter(
    (statement) =>
      statement.created_at.toDateString() ===
      new Date(dateFormat).toDateString()
  );

  return res.status(200).json(filteredStatement);
});

app.get('/account', checkAccountExists, (req, res) => {
  const { customer } = req;
  return res.status(200).json(customer);
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

  const customer = customers.find((customer) => customer.cpf === cpf);

  return res.status(201).send('Account created');
});

app.post('/account/deposit', checkAccountExists, (req, res) => {
  const { customer } = req;
  const { description, amount } = req.body;
  const balance = getBalance(customer.statement);

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: 'credit',
  };

  customer.statement.push(statementOperation);

  return res
    .status(201)
    .json({ message: 'Operation successful', new_balance: balance + amount });
});

app.post('/account/withdraw', checkAccountExists, (req, res) => {
  const { customer } = req;
  const { amount } = req.body;
  const balance = getBalance(customer.statement);

  if (balance < amount) {
    return res.status(400).json({ error: 'Insufficient funds' });
  }

  const statementOperation = {
    amount,
    created_at: new Date(),
    type: 'debit',
  };

  customer.statement.push(statementOperation);
  return res
    .status(201)
    .json({ message: 'Operation successful', new_balance: balance - amount });
});

app.put('/account', checkAccountExists, (req, res) => {
  const { customer } = req;
  const { name: newName } = req.body;

  customer.name = newName;

  return res.status(201).json({ message: 'Account updated', newName: newName });
});

app.delete('/account/delete', checkAccountExists, (req, res) => {
  const { customer } = req;

  customers.splice(customer, 1);

  return res.status(200).json({ message: 'Account deleted', customers });
});

const PORT = 3333;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
