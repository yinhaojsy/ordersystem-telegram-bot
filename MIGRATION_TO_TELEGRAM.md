# Migration from Matrix to Telegram - Complete Guide

This document explains the migration from Matrix/Synapse to Telegram Bot.

## What Changed

### 1. Bot Platform
- **Before:** Matrix Bot SDK with Synapse server
- **After:** Telegram Bot API with node-telegram-bot-api

### 2. Dependencies
- **Removed:** `matrix-bot-sdk`
- **Added:** `node-telegram-bot-api`
- **Kept:** `openai`, `axios`, `dotenv`, `express`

### 3. Configuration Changes

#### Environment Variables

**Old (.env):**
```env
MATRIX_HOMESERVER=https://your-matrix-server.com
MATRIX_ACCESS_TOKEN=your_bot_access_token
MATRIX_USER_ID=@botname:server.com
MATRIX_NOTIFICATION_ROOM_ID=!roomid:server.com
```

**New (.env):**
```env
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_NOTIFICATION_CHAT_ID=123456789
```

#### User Mapping

**Old (userMapping.js):**
```javascript
export const USER_MAPPING = {
  '@admin:103.106.229.35': {
    userId: 1,
    name: 'Admin User',
    email: 'admin@test.com'
  },
};

export const ADMIN_USERS = [
  '@admin:103.106.229.35',
];
```

**New (userMapping.js):**
```javascript
export const USER_MAPPING = {
  '123456789': {  // Telegram user ID (string)
    userId: 1,
    name: 'Admin User',
    email: 'admin@test.com'
  },
};

export const ADMIN_USERS = [
  '123456789',  // Telegram user ID (string)
];
```

### 4. Code Changes

#### Main Entry Point (src/index.js)
- Replaced Matrix client initialization with Telegram bot
- Changed from Matrix room-based messages to Telegram chat messages
- Updated polling and error handling for Telegram

#### Notification Pusher (src/services/notificationPusher.js)
- Changed from Matrix `sendHtmlText` to Telegram `sendMessage` with Markdown
- Updated message formatting for Telegram Markdown syntax
- Changed room ID to chat ID

#### User Mapping (src/config/userMapping.js)
- Changed Matrix user IDs to Telegram user IDs
- Updated user ID format (string numbers instead of @username:server)
- Maintained same permission structure

#### Webhook Server (src/webhookServer.js)
- Updated service name references
- Kept same webhook endpoint structure
- No major changes needed

### 5. Message Handling
- **Matrix:** Used room IDs, sender IDs in format `@user:server`
- **Telegram:** Uses chat IDs, user IDs as numbers
- **Both:** Same AI processing, same conversation state, same handlers

## Migration Steps for Existing Users

### Step 1: Create Telegram Bot
1. Open Telegram and find `@BotFather`
2. Send `/newbot` command
3. Follow prompts to create your bot
4. Save the bot token

### Step 2: Get Your Telegram User ID
1. Start your bot (send `/start`)
2. Send any message
3. Check bot logs for your user ID
4. Save this ID for configuration

### Step 3: Update Configuration
1. Create new `.env` file with Telegram variables (see ENV_SETUP.md)
2. Update `src/config/userMapping.js` with Telegram user IDs
3. Add users to `USER_MAPPING` and `ADMIN_USERS`

### Step 4: Install Dependencies
```bash
npm install
```

### Step 5: Update Order System
In your order system's `.env`, update the webhook variables:
```env
ENABLE_TELEGRAM_NOTIFICATIONS=true
TELEGRAM_BOT_WEBHOOK_URL=http://localhost:3001/webhook/notification
TELEGRAM_BOT_WEBHOOK_SECRET=your-secret-key
```

### Step 6: Start the Bot
```bash
npm start
```

### Step 7: Test
1. Send `/start` to your bot on Telegram
2. Try: "show recent orders"
3. If admin, try: "create order"
4. Test notifications by creating an order in web system

## What Stayed the Same

✅ **All bot functionality**
- Conversational AI with GPT-4
- Order/expense/transfer management
- Admin-only creation permissions
- Natural language understanding
- Smart filtering and queries

✅ **Architecture**
- Webhook server for notifications
- Order system API integration
- Conversation state management
- AI service and handlers

✅ **User Experience**
- Same conversational interface
- Same commands and features
- Same permission model
- Same notification types

## Benefits of Telegram

1. **Easier Setup:** No need to run your own Matrix server
2. **Better Mobile App:** Native Telegram apps on all platforms
3. **More Reliable:** Telegram's infrastructure is very stable
4. **Better UX:** Faster, more polished user experience
5. **Bot Features:** Rich bot features and inline keyboards (future)

## Potential Future Enhancements

Now that we're on Telegram, we can add:
- 📱 Inline keyboards for quick actions
- 📸 Image support for receipts/proofs
- 📍 Location sharing for physical transactions
- 🔘 Custom keyboards for common commands
- 📊 Rich media in notifications

## Troubleshooting

### Can't find bot token
- Search for `@BotFather` on Telegram
- Send `/mybots` to see your bots
- Select bot → API Token

### User ID not working
- Ensure it's a string: `'123456789'` not `123456789`
- Check bot logs when you message the bot
- User IDs are shown in format: `Message from Name (123456789)`

### Notifications not working
- Check `TELEGRAM_NOTIFICATION_CHAT_ID` is set
- Ensure bot has started (you've sent `/start`)
- For groups: Bot must be added as member
- Verify webhook secret matches

## Support

For help:
- See [QUICK_START.md](QUICK_START.md) for setup
- See [ENV_SETUP.md](ENV_SETUP.md) for environment variables
- See [TESTING_GUIDE.md](TESTING_GUIDE.md) for testing
- Check bot console logs for errors
- Verify all environment variables are set

---

**Migration Complete!** 🎉

Your bot now runs on Telegram instead of Matrix, with all the same great features plus better reliability and user experience.
