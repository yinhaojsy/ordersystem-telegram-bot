# Quick Start Guide - Telegram Bot

Get up and running with your Telegram bot in 5 minutes!

## 🚀 Quick Setup

### Step 1: Create Your Telegram Bot (2 minutes)

1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Follow the prompts to name your bot
4. Copy the bot token (looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### Step 2: Install Dependencies (1 minute)

```bash
cd ordersystem-telegram-bot
npm install
```

### Step 3: Configure Environment Variables (2 minutes)

Create a `.env` file with:

```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
TELEGRAM_NOTIFICATION_CHAT_ID=your_chat_id_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Order System API Configuration
ORDER_SYSTEM_API_URL=http://localhost:3000/api
ORDER_SYSTEM_AUTH_TOKEN=your_auth_token

# Webhook Server Configuration
WEBHOOK_PORT=3001
WEBHOOK_SECRET=your-random-secret-key-here
```

**Getting your Chat ID:**
- Start your bot on Telegram (send `/start`)
- Check the bot logs - it will show your user ID
- For groups: Add bot to group, send a message, check logs

### Step 4: Configure Admin Users (1 minute)

Edit `src/config/userMapping.js`:

```javascript
export const USER_MAPPING = {
  '123456789': {  // Your Telegram user ID from logs
    userId: 1,
    name: 'Admin User',
    email: 'admin@test.com'
  },
};

export const ADMIN_USERS = [
  '123456789',  // Your Telegram user ID
];
```

### Step 5: Configure Order System (Optional - for notifications)

**Order System `.env`:**
```env
# Add these lines:
ENABLE_TELEGRAM_NOTIFICATIONS=true
TELEGRAM_BOT_WEBHOOK_URL=http://localhost:3001/webhook/notification
TELEGRAM_BOT_WEBHOOK_SECRET=your-random-secret-key-here
```

> ⚠️ Use the same `WEBHOOK_SECRET` in both files!

### Step 6: Start the Bot (1 minute)

```bash
npm start
```

You should see:
```
✅ Order System Telegram Bot started successfully!
🤖 Bot is listening for messages...
✅ Notification pusher initialized
📢 Notifications will be sent to chat: 123456789
✅ Webhook server listening on port 3001
```

## ✅ Quick Test

### Test Admin User (Can Create)

In Telegram, send to your bot:
```
create order
```

Expected: Bot asks follow-up questions ✅

### Test Regular User (Cannot Create)

Remove your user ID from `ADMIN_USERS`, restart bot, then send:
```
create order
```

Expected: Bot says "please use the web system" ✅

### Test Query (All Users)

Send to your bot:
```
show recent orders
```

Expected: Bot shows order list ✅

### Test Notification Push

In web system: Create a new order

Expected: Notification appears in Telegram chat ✅

## 🎯 What You Can Do Now

### As Admin User:
- ✅ Create orders via bot (for testing)
- ✅ Create expenses via bot
- ✅ Create transfers via bot
- ✅ Query all data

### As Regular User:
- ✅ Check order status
- ✅ List orders, expenses, transfers
- ✅ View details
- ❌ Cannot create (directed to web system)

### Notifications:
- 📢 Order events → Telegram
- 📢 Expense events → Telegram
- 📢 Transfer events → Telegram
- 📢 Approval events → Telegram

## 📚 Full Documentation

- **User Mapping**: See `USER_MAPPING_SETUP.md`
- **Notifications**: See `NOTIFICATION_SETUP.md`
- **Testing Guide**: See `TESTING_GUIDE.md`
- **Conversational Features**: See `CONVERSATIONAL_BOT_GUIDE.md`
- **Filter Options**: See `FILTER_GUIDE.md`

## 🆘 Troubleshooting

**Bot not starting?**
- Check `npm install` completed successfully
- Verify `TELEGRAM_BOT_TOKEN` is correct
- Check for errors in console

**Can't get Telegram user ID?**
- Send `/start` to your bot
- Check bot console logs
- Your user ID will be printed there

**Permissions not working?**
- Verify user ID is a string in config: `'123456789'`
- Restart bot after config changes
- Check bot logs for user identification

**Notifications not appearing?**
- Set `ENABLE_TELEGRAM_NOTIFICATIONS=true` in order system
- Verify webhook secrets match
- Check both services are running
- Ensure `TELEGRAM_NOTIFICATION_CHAT_ID` is set

**Need help?**
- Check logs in both order system and bot
- Review environment variables
- Make sure Telegram user IDs are strings, not numbers

## 🎉 You're Ready!

Your Telegram bot now has:
- ✅ Admin-only creation controls
- ✅ Friendly messages for regular users
- ✅ Real-time notification push to Telegram
- ✅ Conversational AI for natural interactions
- ✅ Full order/expense/transfer management

Test it out and enjoy! 🚀
