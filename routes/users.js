const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const authorization = require('../middlewares/authorization');

const {
  createUser,
  login,
  getUser,
  updateUser,
  signOut,
} = require('../controllers/users');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), createUser);

router.use(authorization);

router.get('/users/me', getUser);
router.patch('/users/me', updateUser);
router.get('/signout', signOut);

module.exports = router;
