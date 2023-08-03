const Movie = require('../models/movie');
const ValidationError = require('../custom_errors/ValidationError');
const NotFoundError = require('../custom_errors/NotFoundError');
const ForbiddenError = require('../custom_errors/ForbiddenError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  Movie.create({ owner: req.user._id, ...req.body })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') return next(new ValidationError('Некорректные данные для создания фильма'));
      return next(err);
    });
};

module.exports.deleteMovieById = (req, res, next) => {
  Movie.findById({ _id: req.params._id })
    .then((movie) => {
      if (!movie) return next(new NotFoundError('Фильм не найден'));
      if (String(movie.owner) !== req.user._id) return next(new ForbiddenError('Вы не можете удалять фильмы других пользователей'));
      return Movie.deleteOne({ _id: movie._id })
        .then(() => res.status(200).send({ message: 'Фильм успешно удалён' }));
    })
    .catch(next);
};
