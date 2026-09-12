const { Router } = require('express');
const passport = require('passport');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(process.env.CLIENT_URL || 'http://localhost:3000');
  }
);

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(process.env.CLIENT_URL || 'http://localhost:3000');
  }
);

router.get('/me', authenticate, (req, res) => {
  res.json({ data: { user: req.user } });
});

router.post('/logout', authenticate, (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: { message: 'Failed to logout' } });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: { message: 'Failed to destroy session' } });
      }
      res.clearCookie('connect.sid');
      res.json({ data: { message: 'Logged out successfully' } });
    });
  });
});

module.exports = router;
