import dotenv from 'dotenv';
dotenv.config();

export const token = process.env.DISCORD_BOT_TOKEN;
export const mongoUri = process.env.MONGODB_URI;
export const twitterBearer = process.env.TWITTER_BEARER_TOKEN; 