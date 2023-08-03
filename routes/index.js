const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const NotFoundError = require('../custom_errors/NotFoundError');

router.use(userRouter);
router.use(movieRouter);
router.use('*', (req, res, next) => next(new NotFoundError('Страница не найдена')));

module.exports = router;
