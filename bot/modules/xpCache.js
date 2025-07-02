import GuildConfig from '../models/GuildConfig.js';

// Cache user XP/level trên RAM
const userCache = new Map(); // key: guildId-userId, value: { user, config, isNewConfig }
const dirtyUsers = new Set(); // key: guildId-userId
const lastXPTime = new Map(); // key: guildId-userId, value: timestamp

// Chỉ cho phép cộng XP mỗi 30s/user
export function shouldGainXP(guildId, userId) {
  const cacheKey = `${guildId}-${userId}`;
  const now = Date.now();
  if (!lastXPTime.get(cacheKey) || now - lastXPTime.get(cacheKey) > 30000) {
    lastXPTime.set(cacheKey, now);
    return true;
  }
  return false;
}

// Lấy dữ liệu user từ cache hoặc DB
export async function getUserData(guildId, userId) {
  const cacheKey = `${guildId}-${userId}`;
  let cached = userCache.get(cacheKey);
  if (cached) return cached;
  let config = await GuildConfig.findOne({ guildId });
  let isNewConfig = false;
  if (!config) {
    config = await GuildConfig.create({ guildId });
    isNewConfig = true;
  }
  let user = config.users.get(userId) || { xp: 0, level: 1 };
  cached = { user, config, isNewConfig };
  userCache.set(cacheKey, cached);
  return cached;
}

// Đánh dấu user cần ghi DB
export function markUserDirty(guildId, userId, user, config, isNewConfig) {
  const cacheKey = `${guildId}-${userId}`;
  userCache.set(cacheKey, { user, config, isNewConfig });
  dirtyUsers.add(cacheKey);
}

// Định kỳ batch update cache lên DB
export async function flushXPToDB() {
  for (const cacheKey of dirtyUsers) {
    const { user, config, isNewConfig } = userCache.get(cacheKey) || {};
    if (user && config) {
      config.users.set(cacheKey.split('-')[1], user);
      await config.save();
    }
    // Sau khi ghi DB xong, xóa khỏi dirty set
    dirtyUsers.delete(cacheKey);
  }
}

export function updateUserData(guildId, userId, newUserData) {
    const cacheKey = `${guildId}-${userId}`;
    let cached = userCache.get(cacheKey);
    if (cached) {
      cached.user = { ...cached.user, ...newUserData };
      userCache.set(cacheKey, cached);
      dirtyUsers.add(cacheKey);
    }
  }

// Tự động flush mỗi 5 phút
setInterval(flushXPToDB, 5 * 60 * 1000); 