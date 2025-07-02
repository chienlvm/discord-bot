import GuildConfig from '../models/GuildConfig.js';

const guildConfigCache = new Map(); // key: guildId, value: { config, cachedAt }
const TTL = 5 * 60 * 1000; // 5 phút

export async function getGuildConfig(guildId) {
  const now = Date.now();
  const cached = guildConfigCache.get(guildId);
  if (cached && (now - cached.cachedAt < TTL)) {
    return cached.config;
  }
  let config = await GuildConfig.findOne({ guildId });
  if (!config) {
    config = await GuildConfig.create({ guildId });
  }
  guildConfigCache.set(guildId, { config, cachedAt: now });
  return config;
}

export function updateGuildConfigInCache(guildId, newConfig) {
  guildConfigCache.set(guildId, { config: newConfig, cachedAt: Date.now() });
}

export function clearGuildConfigCache(guildId) {
  guildConfigCache.delete(guildId);
} 