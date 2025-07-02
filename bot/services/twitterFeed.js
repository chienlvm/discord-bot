import axios from 'axios';
import cron from 'node-cron';
import GuildConfig from '../models/GuildConfig.js';
import { twitterBearer } from '../config.js';

// Lưu last tweet id cho mỗi guild để tránh spam
const lastTweetIds = new Map();

async function fetchLatestTweet(username) {
  try {
    const userRes = await axios.get(`https://api.twitter.com/2/users/by/username/${username.replace('@', '')}`,
      { headers: { Authorization: `Bearer ${twitterBearer}` } });
    const userId = userRes.data.data.id;
    const tweetsRes = await axios.get(`https://api.twitter.com/2/users/${userId}/tweets?max_results=5&exclude=replies,retweets`,
      { headers: { Authorization: `Bearer ${twitterBearer}` } });
    const tweets = tweetsRes.data.data;
    return tweets && tweets.length > 0 ? tweets[0] : null;
  } catch (err) {
    return null;
  }
}

async function postTweetToChannel(client, guildId, channelId, tweet) {
  try {
    const guild = await client.guilds.fetch(guildId);
    const channel = guild.channels.cache.get(channelId);
    if (channel && tweet) {
      await channel.send(`https://twitter.com/i/web/status/${tweet.id}`);
    }
  } catch {}
}

function handleTwitterFeeds(client) {
  cron.schedule('*/2 * * * *', async () => { // 2 phút/lần
    const configs = await GuildConfig.find({ twitterFeed: { $ne: '' }, feedChannel: { $ne: '' } });
    for (const config of configs) {
      const username = config.twitterFeed;
      const tweet = await fetchLatestTweet(username);
      if (!tweet) continue;
      if (lastTweetIds.get(config.guildId) === tweet.id) continue;
      lastTweetIds.set(config.guildId, tweet.id);
      await postTweetToChannel(client, config.guildId, config.feedChannel, tweet);
    }
  });
}

export default handleTwitterFeeds; 