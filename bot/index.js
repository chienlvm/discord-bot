import { Client, GatewayIntentBits, Partials } from 'discord.js';
import connectDB from './db.js';
import { token } from './config.js';
import handleTwitterFeeds from './services/twitterFeed.js';
import handleXP from './modules/handleXP.js';
import antiScam from './modules/antiScam.js';
import antiDMScam from './modules/antiDMScam.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Message, Partials.Channel, Partials.GuildMember]
});

client.on('ready', () => {
  console.log(`Bot logged in as ${client.user.tag}`);
  handleTwitterFeeds(client); // Khởi động cron Twitter feed
});

// bot/index.js
// Main entry point for Discord bot. Sets up client, event handlers, DB connection, and service modules.
// - Initializes Discord client with required intents and partials
// - Handles bot ready event and starts Twitter feed cron
// - Handles XP system on message creation
// - Connects to MongoDB and logs in the bot
client.on('messageCreate', async (message) => {
  await antiScam(message);
  await antiDMScam(message);
  handleXP(message);
});

// Kết nối DB và đăng nhập bot
connectDB().then(() => {
  client.login(token);
}); 