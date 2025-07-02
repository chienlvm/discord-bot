const jwt = require('jsonwebtoken');
const axios = require('axios');
const { jwtSecret, discord } = require('../config');

// Middleware xác thực JWT và kiểm tra quyền quản trị guild
module.exports = async function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, jwtSecret);
    req.user = payload;
    // Lấy access_token từ payload (lưu khi login OAuth2)
    const accessToken = payload.access_token;
    // Lấy danh sách guilds user quản lý từ Discord API
    const guildsRes = await axios.get('https://discord.com/api/v10/users/@me/guilds', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const adminGuilds = guildsRes.data.filter(g => (g.owner || (g.permissions & 0x20) === 0x20));
    // Kiểm tra user có quyền quản trị guildId không
    const { guildId } = req.params;
    if (!adminGuilds.some(g => g.id === guildId)) {
      return res.status(403).json({ error: 'You are not an admin of this guild' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}; 