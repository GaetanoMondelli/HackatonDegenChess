const cors = require('cors');
const bodyParser = require('body-parser');

const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const degenEndpoint = 'http://localhost:3000';
const corsOptions = {
  origin: degenEndpoint,
  optionsSuccessStatus: 200,
};

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());
const port = process.env.PORT;

const player1 = {
  name: 'Irina',
  degenElo: 1000,
};

const player2 = {
  name: 'Gaetano',
  degenElo: 1000,
};

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

app.get('/users/player1', (req, res) => {
  res.send(player1);
});

app.get('/users/player2', (req, res) => {
    res.send(player2);
  });
  