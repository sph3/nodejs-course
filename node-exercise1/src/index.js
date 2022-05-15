const express = require("express");
const cors = require("cors");

const { v4: uuid } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

const checksExistsUserAccount = (req, res, next) => {
  const { username } = req.headers;

  const user = users.find(
    (user) => user.username.toLowerCase() === username.toLowerCase()
  );
  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }
  req.user = user;
  return next();
};

app.post("/users", (req, res) => {
  const { name, username } = req.body;

  if (
    users.some((user) => user.username.toLowerCase() === username.toLowerCase())
  ) {
    return res.status(400).json({ error: "Username taken" });
  }

  const newUser = {
    id: uuid(),
    name,
    username: username.toLowerCase(),
    todos: [],
  };

  users.push(newUser);
  console.log(newUser);
  return res.status(201).json(newUser);
});

app.get("/todos", checksExistsUserAccount, (req, res) => {
  const { todos } = req.user;
  return res.status(200).json(todos);
});

app.post("/todos", checksExistsUserAccount, (req, res) => {
  const { title, deadline } = req.body;
  const { todos } = req.user;

  const newTodo = {
    id: uuid(),
    title,
    deadline: new Date(deadline),
    done: false,
    created_at: new Date(),
  };

  todos.push(newTodo);
  return res.status(201).json(newTodo);
});

app.put("/todos/:id", checksExistsUserAccount, (req, res) => {
  const { id } = req.params;
  const { todos } = req.user;
  const { title, deadline } = req.body;

  const updatedTodo = todos.find((todo) => todo.id === id);
  if (!updatedTodo) {
    return res.status(404).json({ error: "Todo not found" });
  }

  updatedTodo.title = title;
  updatedTodo.deadline = new Date(deadline);

  return res.status(200).json(updatedTodo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (req, res) => {
  const { id } = req.params;
  const { todos } = req.user;

  const doneTodo = todos.find((todo) => todo.id === id);
  if (!doneTodo) {
    return res.status(404).json({ error: "Todo not found" });
  }

  doneTodo.done = true;
  return res.status(200).json(doneTodo);
});

app.delete("/todos/:id", checksExistsUserAccount, (req, res) => {
  const { id } = req.params;
  const { todos } = req.user;

  const todoToDelete = todos.find((todo) => todo.id === id);
  if (!todoToDelete) {
    return res.status(404).json({ error: "Todo not found" });
  }

  todos.splice(todoToDelete, 1);
  return res.status(204).json(todoToDelete);
});

module.exports = app;
