const express = require('express');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../dbConfig');

const router = express.Router();

// POST /api/auth/register
router.post('/api/auth/register', async (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
  };
  console.log(newUser);
});

// POST /api/auth/login
router.post('/api/auth/login', async (req, res) => {
  console.log(req.body);
});
