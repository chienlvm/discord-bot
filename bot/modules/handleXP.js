// bot/modules/handleXP.js
import { getUserData, markUserDirty, shouldGainXP } from './xpCache.js';

// Hàm xử lý XP và lên level cho user khi có tin nhắn mới
export default async function handleXP(message) {
  // Bỏ qua nếu là bot hoặc không phải trong server (guild)
  if (message.author.bot || !message.guild) return;

  const guildId = message.guild.id;
  const userId = message.author.id;

  // Kiểm tra rate limit: chỉ cộng XP mỗi 30s/user
  if (!shouldGainXP(guildId, userId)) return;

  // Lấy dữ liệu user từ cache (hoặc DB nếu chưa có)
  const { user, config, isNewConfig } = await getUserData(guildId, userId);
  if (!user || !config) return;

  // Nếu chưa có modules hoặc modules.antiSpam chưa được định nghĩa thì gán mặc định các module
  if (!config.modules || config.modules.antiSpam === undefined)
    config.modules = { antiSpam: false, antiLink: false, autoWarn: false, autoMute: false };

  // Nếu module antiSpam đang bật thì không cộng XP
  if (config.modules.antiSpam) return;

  // Cộng XP ngẫu nhiên từ 3 đến 10 cho user
  user.xp += Math.floor(Math.random() * 8) + 3;

  // Biến kiểm tra user có lên level không
  let leveledUp = false;
  // Tính XP cần để lên level tiếp theo
  let nextLevelXP = 5 * (user.level ** 2) + 50 * user.level + 100;
  // Nếu đủ XP thì tăng level, có thể lên nhiều level nếu đủ XP
  while (user.xp >= nextLevelXP) {
    user.level++;
    leveledUp = true;
    nextLevelXP = 5 * (user.level ** 2) + 50 * user.level + 100;
  }

  // Đánh dấu user này cần ghi DB
  markUserDirty(guildId, userId, user, config, isNewConfig);

  // Nếu user vừa lên level
  if (leveledUp) {
    // Kiểm tra xem có role thưởng cho level này không
    const roleId = config.roleRewards.get(String(user.level));
    if (roleId) {
      // Lấy thông tin member trong guild
      const member = await message.guild.members.fetch(userId).catch(() => null);
      // Nếu member tồn tại thì gán role thưởng
      if (member) {
        await member.roles.add(roleId).catch(() => { });
      }
    }
    // Gửi tin nhắn chúc mừng lên level mới
    const channelId = config.feedChannel || message.channel.id;
    const channel = message.guild.channels.cache.get(channelId) || message.channel;
    channel.send(`<@${userId}> đã lên level ${user.level}! 🎉`).catch(() => { });
  }
} 