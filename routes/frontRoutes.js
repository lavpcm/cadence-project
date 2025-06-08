const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('pages/home');
});

router.get('/habits', (req, res) => {
  res.render('pages/habits');
});

router.get('/tracker', (req, res) => {
  res.render('pages/tracker');
});

module.exports = router;