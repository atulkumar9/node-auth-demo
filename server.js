require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());

const articles = [
  {
    id: 1,
    name: "Atul Kumar",
    title: "First Article",
  },
  {
    id: 2,
    name: "John Doe",
    title: "Second Article",
  },
  {
    id: 3,
    name: "Don Joe",
    title: "Third Article",
  },
];

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.sendStatus(401); //Unauthorised
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden to access
    }
    req.user = user.name;
    next();
  });
};

app.get("/articles", authenticateToken, (req, res) => {
  res.json(articles.filter((article) => req.user === article.name));
});

app.listen(4001);
