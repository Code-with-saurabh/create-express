const { Router } = require('express');
const { asyncHandler } = require('../utils/asyncHandler');

const router = Router();

router.get('/hello', asyncHandler(async (req, res) => {
  res.json({
    message: 'Welcome to the API',
    version: '1.0.0',
  });
}));

module.exports = router;
