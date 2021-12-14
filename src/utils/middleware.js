const { dbFail } = require('./dbHelper');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');

function showBody(req, res, next) {
  if (req.method === 'POST') {
    console.log('The body we got: ', req.body);
  }
  next();
}

function authenticateToken(req, res, next) {
  const result = req.get('Authorization');
  console.log('authenticateToken', result);
  if (!result) return dbFail(res, 'not authenticated', 400);
  const token = result.split(' ')[1];
  jwt.verify(token, jwtSecret, (err, data) => {
    if (err) {
      return dbFail(res, 'token expired/invalid', 400);
    }
    // token valid and present
    req.email = data.email;
    next();
  });
}

module.exports = {
  showBody,
  authenticateToken,
};
