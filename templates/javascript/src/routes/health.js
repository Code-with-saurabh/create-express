const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

router.get('/live', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

module.exports = router;
