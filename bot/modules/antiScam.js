import { getGuildConfig } from './guildConfigCache.js';

function extractLinks(text) {
  const urlRegex = /https?:\/\/[\w.-]+(?:\.[\w\.-]+)+(?:[\w\-\._~:/?#[\]@!$&'()*+,;=]*)?/gi;
  return text.match(urlRegex) || [];
}

export default async function antiScam(message) {
  if (message.author.bot || !message.guild) return;
  const guildId = message.guild.id;
  const userId = message.author.id;
  const config = await getGuildConfig(guildId);
  if (!config || !config.modules.antiScam) return;

  // Kiểm tra link blacklist
  const links = extractLinks(message.content);
  const isBlacklisted = links.some(link => config.blacklistDomains.some(domain => link.includes(domain)));
  // Kiểm tra từ khoá scam
  const isScamKeyword = config.scamKeywords.some(keyword => new RegExp(keyword, 'i').test(message.content));

  if (isBlacklisted || isScamKeyword) {
    await message.delete().catch(() => {});
    // Đếm số lần vi phạm
    const count = (config.scamCounts.get(userId) || 0) + 1;
    config.scamCounts.set(userId, count);
    await config.save();
    // Gửi cảnh báo mod-log
    if (config.modLogChannel) {
      const channel = message.guild.channels.cache.get(config.modLogChannel);
      if (channel) {
        channel.send(`⚠️ <@${userId}> gửi link/từ khoá scam: "${message.content}" (vi phạm ${count}/2)`);
      }
    }
    // Nếu vi phạm >=2 lần thì mute 5 phút
    if (count >= 2) {
      const member = await message.guild.members.fetch(userId).catch(() => null);
      if (member && member.moderatable) {
        await member.timeout(5 * 60 * 1000, 'Scam/spam link').catch(() => {});
      }
      config.scamCounts.set(userId, 0);
      await config.save();
    }
  }
} 