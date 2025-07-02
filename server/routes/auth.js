const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { discord, jwtSecret, frontendUrl } = require('../config');
const router = express.Router();

// Đăng nhập Discord OAuth2: exchange code lấy token, user info, guilds
router.post('/discord', async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'No code provided' });
  try {
    // Exchange code lấy access_token
    const params = new URLSearchParams({
      client_id: discord.clientId,
      client_secret: discord.clientSecret,
      grant_type: 'authorization_code',
      code,
      redirect_uri: discord.redirectUri,
      scope: 'identify guilds'
    });
    const tokenRes = await axios.post('https://discord.com/api/oauth2/token', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    const { access_token, token_type } = tokenRes.data;
    // Lấy user info
    const userRes = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `${token_type} ${access_token}` }
    });
    // Lấy guilds
    const guildsRes = await axios.get('https://discord.com/api/users/@me/guilds', {
      headers: { Authorization: `${token_type} ${access_token}` }
    });
    // Tạo JWT
    const payload = {
      id: userRes.data.id,
      username: userRes.data.username,
      avatar: userRes.data.avatar,
      access_token
    };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '7d' });
    res.json({ token, user: userRes.data });
  } catch (err) {
    res.status(400).json({ error: 'OAuth2 failed', details: err.response?.data || err.message });
  }
});

module.exports = router; 