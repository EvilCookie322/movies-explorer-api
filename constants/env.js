const { PORT = 4000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb', NODE_ENV = 'dev', JWT_SECRET } = process.env;
const DEV_JWT = 'super-secret-banana';

module.exports = {
  PORT,
  DB_URL,
  NODE_ENV,
  JWT_SECRET,
  DEV_JWT,
};
