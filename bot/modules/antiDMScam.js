import { getGuildConfig } from './guildConfigCache.js';

function extractLinks(text) {
  const urlRegex = /https?:\/\/[\w.-]+(?:\.[\w\.-]+)+(?:[\w\-\._~:/?#[\]@!$&'()*+,;=]*)?/gi;
  return text.match(urlRegex) || [];
}

const dmSpamWindow = 60 * 1000; // 1 phút
const dmSpamThreshold = 3; // 3 người trong 1 phút
const dmUserSendMap = new Map(); // key: userId, value: { targets: Set, last: timestamp }

export default async function antiDMScam(message) {
  if (message.author.bot || message.guild) return; // Chỉ xử lý DM
  const userId = message.author.id;
  const now = Date.now();
  // Tìm tất cả guild chung giữa bot và user
  const mutualGuilds = message.client.guilds.cache.filter(g => g.members.cache.has(userId));
  for (const guild of mutualGuilds.values()) {
    const config = await getGuildConfig(guild.id);
    if (!config || !config.modules.antiDMScam) continue;
    // Kiểm tra link blacklist
    const links = extractLinks(message.content);
    const isBlacklisted = links.some(link => config.blacklistDomains.some(domain => link.includes(domain)));
    // Kiểm tra từ khoá scam
    const isScamKeyword = config.scamKeywords.some(keyword => new RegExp(keyword, 'i').test(message.content));
    // Kiểm tra spam DM
    let spamData = dmUserSendMap.get(userId) || { targets: new Set(), last: now };
    spamData.targets.add(message.channel.recipient.id);
    if (now - spamData.last > dmSpamWindow) {
      spamData = { targets: new Set([message.channel.recipient.id]), last: now };
    }
    dmUserSendMap.set(userId, spamData);
    const isSpam = spamData.targets.size >= dmSpamThreshold;
    // Nếu phát hiện DM scam hoặc spam
    if (isBlacklisted || isScamKeyword || isSpam) {
      // Lưu log DM scam
      config.dmScamLogs.push({ userId, targetId: message.channel.recipient.id, content: message.content });
      // Đếm số lần vi phạm
      const count = (config.dmScamCounts.get(userId) || 0) + 1;
      config.dmScamCounts.set(userId, count);
      await config.save();
      // Gửi cảnh báo admin (modLogChannel)
      if (config.modLogChannel) {
        const channel = guild.channels.cache.get(config.modLogChannel);
        if (channel) {
          channel.send(`⚠️ <@${userId}> nghi ngờ spam DM scam tới <@${message.channel.recipient.id}>: "${message.content}" (vi phạm ${count}/2)`);
        }
      }
      // Nếu vi phạm >=2 lần thì mute 5 phút
      if (count >= 2) {
        const member = await guild.members.fetch(userId).catch(() => null);
        if (member && member.moderatable) {
          await member.timeout(5 * 60 * 1000, 'DM scam/spam').catch(() => {});
        }
        config.dmScamCounts.set(userId, 0);
        await config.save();
      }
    }
  }
} 