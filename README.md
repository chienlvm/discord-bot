# Discord Multi-Guild Bot System with Web Admin

## 🛠 Tech Stack
- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **Bot:** Node.js, discord.js v14+
- **Frontend:** React.js
- **Auth:** Discord OAuth2, JWT

## 📦 Project Structure
```
/bot      # Discord bot
/server   # Express backend
/client   # React frontend
.env.example
README.md
```

## 🌟 Main Features
- **Bot:** XP & Level system, Twitter feed per guild, role rewards, module toggles (antiSpam, antiLink, ...)
- **Web Admin:** Discord OAuth2 login, manage guild configs, toggle modules, set Twitter feed/channel/roles
- **Backend:** REST API, per-guild config, secure with OAuth2 & JWT, MongoDB storage

## 🔄 Flow
1. Admin login via Discord OAuth2 on web
2. Frontend sends token to backend, backend verifies & fetches user guilds
3. User selects guild, views/edits config
4. Frontend PATCH/POST config to backend
5. Backend saves config to MongoDB
6. Bot reads config from MongoDB and applies (XP, Twitter, modules...)

## 🗂️ MongoDB Schema Example
```json
{
  "guildId": "123456789",
  "twitterFeed": "@example",
  "feedChannel": "987654321",
  "roleRewards": { "5": "roleIdA", "10": "roleIdB" },
  "modules": {
    "antiSpam": true,
    "antiLink": false,
    "autoWarn": true,
    "autoMute": false
  },
  "users": {
    "userId1": { "xp": 120, "level": 3 }
  }
}
```

## 🚀 Quick Start
1. Copy `.env.example` to `.env` and fill in your secrets
2. Install dependencies in each folder (`bot/`, `server/`, `client/`)
3. Start MongoDB
4. Run backend, bot, and frontend

## 📖 See each folder for more details and setup instructions. 