const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { jwtSecret } = require('../config');
const router = express.Router();

// Lấy danh sách guilds user quản lý
router.get('/guilds', async (req, res) => {
  console.log("co vao day khong")
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, jwtSecret);
    const accessToken = payload.access_token;
    const guildsRes = await axios.get('https://discord.com/api/v10/users/@me/guilds', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    // Chỉ trả về guilds mà user là owner hoặc có quyền quản trị (0x20 = MANAGE_GUILD)
    const adminGuilds = guildsRes.data.filter(g => (g.owner || (g.permissions & 0x20) === 0x20));
    res.json(adminGuilds);
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

module.exports = router; 