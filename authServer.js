require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
const refreshTokens = [];

app.use(express.json());

const generateAccessToken = (user) =>
  jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30s" });

const generateRefreshToken = (user) =>
  jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

app.post("/login", (req, res) => {
  // after authentication
  const { username } = req.body;
  const user = { name: username };
  const accesToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  refreshTokens.push(refreshToken);
  res.json({ accesToken, refreshToken });
});

app.post("/token", (req, res) => {
  const { token: refreshToken } = req.body;
  if (!refreshToken) {
    return res.sendStatus(401);
  }
  if (!refreshTokens.includes(refreshToken)) {
    return res.sendStatus(403);
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    const accessToken = generateAccessToken({ name: user.name });
    res.json({ accessToken });
  });
});

app.listen(5001);
