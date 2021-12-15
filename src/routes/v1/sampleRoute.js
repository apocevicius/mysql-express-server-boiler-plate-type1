const express = require('express');


const router = express.Router();

router.get('/', async (req, res) => {
  res.json('sample route');
});

router.post('/api/auth/login', async (req, res) => {
  res.json('login');
  console.log('login success', req.body);
});

router.post('/api/auth/register', async (req, res) => {
  res.json('register');
  console.log('register success', req.body);
});

module.exports = router;
