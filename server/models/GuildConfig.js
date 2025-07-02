const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 }
}, { _id: false });

const guildConfigSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  twitterFeed: { type: String, default: '' },
  feedChannel: { type: String, default: '' },
  roleRewards: {
    type: Map,
    of: String,
    default: {}
  },
  modules: {
    antiSpam: { type: Boolean, default: false },
    antiLink: { type: Boolean, default: false },
    autoWarn: { type: Boolean, default: false },
    autoMute: { type: Boolean, default: false }
  },
  users: {
    type: Map,
    of: userSchema,
    default: {}
  }
});

module.exports = mongoose.model('GuildConfig', guildConfigSchema); 