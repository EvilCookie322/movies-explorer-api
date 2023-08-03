const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const isUrl = require('validator/lib/isURL');
const {
  getMovies,
  createMovie,
  deleteMovieById,
} = require('../controllers/movies');

const validateUrl = (value, helpers) => {
  if (!isUrl(value)) return helpers.message('Некорректная ссылка');
  return value;
};

router.get('/movies', getMovies);
router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().custom(validateUrl).required(),
    trailerLink: Joi.string().custom(validateUrl).required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().custom(validateUrl).required(),
    movieId: Joi.number().required(),
  }),
}), createMovie);
router.delete('/movies/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex().length(24),
  }),
}), deleteMovieById);

module.exports = router;
