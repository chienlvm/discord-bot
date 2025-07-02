const express = require('express');
const router = express.Router();
const GuildConfig = require('../models/GuildConfig');
const auth = require('../middleware/auth');

// Lấy config của guild
router.get('/:guildId', auth, async (req, res) => {
  try {
    const config = await GuildConfig.findOne({ guildId: req.params.guildId });
    if (!config) return res.status(404).json({ error: 'Config not found' });
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Cập nhật config của guild
router.patch('/:guildId', auth, async (req, res) => {
  try {
    const update = req.body;
    const config = await GuildConfig.findOneAndUpdate(
      { guildId: req.params.guildId },
      { $set: update },
      { new: true, upsert: true }
    );
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 