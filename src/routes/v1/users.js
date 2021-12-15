const express = require('express');
const { dbAction, dbFail, dbSuccess } = require('../../utils/dbHelper');
const { hashValue, verifyHash } = require('../../utils/hashHelper');
const { validateRegister } = require('../../utils/validateHelper');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../dbConfig');

const router = express.Router();

router.get('/', async (req, res) => {
  res.json('user routes');
});

// POST /api/auth/register
router.post('/api/auth/register', async (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
  };
  const sql = `
  INSERT INTO users (email, password)
  VALUES ( ?, ? )
  `;
  console.log(newUser);
  const dbResult = await dbAction(sql, [newUser.email, newUser.password]);
  if (dbResult == false) {
    return res.status(500).json({ error: 'something went wrong' });
  }
  if (dbResult.affectedRows === 1) {
    return res.json({ msg: 'register success', newUser: newUser.email });
  }
  res.status(500).json({ error: 'something went wrong' });
});

// POST /api/auth/login
router.post('/api/auth/login', validateRegister, async (req, res) => {
  const sql = 'SELECT * FROM users	 WHERE email = ?';
  const dbResult = await dbAction(sql, [req.body.email]);
  // check if email exsits
  if (dbResult.length !== 1) {
    return dbFail(res, 'email does not exsits', 400);
  }
  // email exists
  // check password
  if (!verifyHash(req.body.password, dbResult[0].password)) {
    return dbFail(res, 'passwords not match');
  }
  // pass match
  const token = jwt.sign({ email: req.body.email }, jwtSecret, {
    expiresIn: '1h',
  });

  const loggeInUser = {
    email: req.body.email,
    token: token,
  };
  dbSuccess(res, loggeInUser);
});

module.exports = router;
