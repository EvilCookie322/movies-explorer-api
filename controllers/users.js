const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictError = require('../custom_errors/ConflictError');
const NotFoundError = require('../custom_errors/NotFoundError');
const ValidationError = require('../custom_errors/ValidationError');
const AuthorizationError = require('../custom_errors/AuthorizationError');
const { NODE_ENV, JWT_SECRET, DEV_JWT } = require('../constants/env');

const SALT_ROUNDS = 10;

const handleValidationError = (err) => {
  if (err.name === 'ValidationError') return new ValidationError('Некорректные данные');
  return err;
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({ email, password: hash, name })
      .then((newUser) => res.status(200).send(newUser)))
    .catch((err) => {
      if (err.code === 11000 || err.name === 'MongoServerError') return next(new ConflictError('Пользователь уже существует'));
      return next(handleValidationError(err));
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ValidationError('Не передана почта или пароль'));
  }
  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) return next(new AuthorizationError('Неправильная почта или пароль'));
      return bcrypt.compare(password, user.password)
        .then((isMatch) => {
          if (!isMatch) return next(new AuthorizationError('Неправильная почта или пароль'));
          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : DEV_JWT, { expiresIn: '7d' });
          return res.cookie('jwt', token, {
            httpOnly: true,
            sameSite: true,
            maxAge: 3600000 * 24 * 7,
          }).status(200).send({ token });
        });
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) return next(new NotFoundError('Пользователь не найден'));
      return res.status(200).send({ email: user.email, name: user.name });
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) return next(new NotFoundError('Пользователь не найден'));
      return res.status(200).send(user);
    })
    .catch((err) => {
      next(handleValidationError(err));
    });
};

module.exports.signOut = (req, res) => res.clearCookie('jwt').status(200).send({ message: 'Выход выполнен успешно' });
