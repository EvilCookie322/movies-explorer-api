require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
// const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimiter = require('./middlewares/rateLimiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const handleError = require('./middlewares/handleError');
const router = require('./routes/index');

const { PORT = 4000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

const app = express();

// app.use(cors({ origin: ['https://cookie.nomoredomains.xyz', 'http://localhost:3000'], credentials: true }));

mongoose.connect(DB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log('Db connected');
  })
  .catch((error) => {
    console.log('Db connection failed');
    console.error(error);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestLogger);
app.use(rateLimiter);
app.use(router);
app.use(errorLogger);

app.use(errors());
app.use((err, req, res, next) => {
  handleError(err, res, next);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
