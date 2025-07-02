import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 }
}, { _id: false });

const dmScamLogSchema = new mongoose.Schema({
  userId: String,
  targetId: String,
  content: String,
  timestamp: { type: Date, default: Date.now }
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
    autoMute: { type: Boolean, default: false },
    antiScam: { type: Boolean, default: false },
    antiDMScam: { type: Boolean, default: false }
  },
  users: {
    type: Map,
    of: userSchema,
    default: {}
  },
  blacklistDomains: {
    type: [String],
    default: []
  },
  scamKeywords: {
    type: [String],
    default: []
  },
  scamCounts: {
    type: Map,
    of: Number,
    default: {}
  },
  modLogChannel: {
    type: String,
    default: ''
  },
  dmScamLogs: {
    type: [dmScamLogSchema],
    default: []
  },
  dmScamCounts: {
    type: Map,
    of: Number,
    default: {}
  }
});

const GuildConfig = mongoose.model('GuildConfig', guildConfigSchema);
export default GuildConfig; 