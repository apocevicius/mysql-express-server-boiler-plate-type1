const express = require('express');
const { dbAction, dbFail, dbSuccess } = require('../../utils/dbHelper');
const { authenticateToken } = require('../../utils/middleware');
// const { validateRegister } = require('../../utils/validateHelper');

const router = express.Router();

// POST api/auth/listings/new
router.post('/api/auth/listings/new', async (req, res) => {
  // after validation
  const sql = 'INSERT INTO listings (title, body, price, image, userId) VALUES (?, ?, ?, ?, ?)';
  const { title, body, price, image, userId } = req.body;
  const dbResult = await dbAction(sql, [title, body, price, image, userId]);
  if (dbResult === false) {
    return res.status(500).json({ error: 'sideways' });
  }
  res.json({ msg: 'listing created', dbResult });
});


router.get('/api/auth/listings', authenticateToken, async (req, res) => {
  const sql = `
  SELECT listings.postId, listings.title, listings.body, listings.timeStamp, users.email AS userId
  FROM listings
  INNER JOIN users
  ON users.id = listings.id
  WHERE users.email = ?
  `;
  const dbResult = await dbAction(sql, [req.email]);
  if (dbResult === false) return dbFail(res);
  dbSuccess(res, dbResult);
});

module.exports = router;
