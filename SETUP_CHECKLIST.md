# Telegram Bot Setup Checklist

Follow these steps to set up your Telegram bot with the order system.

## ✅ Step 1: Create Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Follow the prompts to name your bot
4. Copy the **bot token** (looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

## ✅ Step 2: Get Your Chat ID

**Option A: Personal Chat**
1. Start your bot (search for it in Telegram)
2. Send any message to the bot
3. The bot will log your user ID when you start it

**Option B: Group Chat**
1. Create a group in Telegram
2. Add your bot to the group
3. Send a message in the group
4. Check bot logs for the group ID (negative number)

## ✅ Step 3: Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy the key (starts with `sk-proj-`)

## ✅ Step 4: Get Order System Auth Token

1. Log in to your order system
2. Open browser DevTools (F12)
3. Go to Application/Storage → Local Storage
4. Find the `token` or `auth_token` value
5. Copy it

## ✅ Step 5: Generate Webhook Secret

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Copy the output - you'll use it in both projects.

## ✅ Step 6: Configure Telegram Bot .env

Edit `/ordersystem-telegram-bot/.env` and add:

```env
TELEGRAM_BOT_TOKEN=<your-bot-token-from-step-1>
TELEGRAM_NOTIFICATION_CHAT_ID=<your-chat-id-from-step-2>
OPENAI_API_KEY=<your-openai-key-from-step-3>
ORDER_SYSTEM_API_URL=http://localhost:3000/api
ORDER_SYSTEM_AUTH_TOKEN=<your-auth-token-from-step-4>
WEBHOOK_PORT=3001
WEBHOOK_SECRET=<your-secret-from-step-5>
```

## ✅ Step 7: Configure Order System .env

Edit `/ordersystem/.env` and add these lines:

```env
ENABLE_TELEGRAM_NOTIFICATIONS=true
TELEGRAM_BOT_WEBHOOK_URL=http://localhost:3001/webhook/notification
TELEGRAM_BOT_WEBHOOK_SECRET=<same-secret-from-step-5>
```

**IMPORTANT**: The `TELEGRAM_BOT_WEBHOOK_SECRET` must match the `WEBHOOK_SECRET` from Step 6!

## ✅ Step 8: Configure User Mapping

Edit `/ordersystem-telegram-bot/src/config/userMapping.js`:

```javascript
export const TELEGRAM_TO_ORDERSYSTEM_USER = {
  '<your-telegram-user-id>': {
    username: '<your-order-system-username>',
    userId: <your-order-system-user-id>,
    isAdmin: true
  }
};
```

## ✅ Step 9: Start Both Services

**Terminal 1 - Order System:**
```bash
cd "/Users/yin/Documents/Codes/Webapp Projects/ordersystem"
npm run dev
```

**Terminal 2 - Telegram Bot:**
```bash
cd "/Users/yin/Documents/Codes/Webapp Projects/ordersystem-telegram-bot"
npm start
```

## ✅ Step 10: Test the Bot

1. Open Telegram and find your bot
2. Send: `/start`
3. Send: `list orders`
4. You should see a response!

## ✅ Step 11: Test Notifications

1. Create or update an order in the order system
2. You should receive a notification in Telegram
3. If not, check the troubleshooting section below

## 🔧 Troubleshooting

### Bot not responding
- Check `TELEGRAM_BOT_TOKEN` is correct
- Verify bot is running (check terminal for errors)
- Make sure you started the bot with `/start` in Telegram

### Notifications not working
- Verify `ENABLE_TELEGRAM_NOTIFICATIONS=true` in order system
- Check `TELEGRAM_BOT_WEBHOOK_SECRET` matches `WEBHOOK_SECRET`
- Ensure both services are running
- Check webhook URL is correct: `http://localhost:3001/webhook/notification`

### "Not authorized" errors
- Check `ORDER_SYSTEM_AUTH_TOKEN` is valid and not expired
- Make sure user mapping is configured correctly
- Verify your Telegram user ID is in the mapping

### OpenAI errors
- Verify `OPENAI_API_KEY` is correct
- Check you have credits in your OpenAI account
- Try a simpler command first

## 📚 Additional Resources

- [ENV_TEMPLATE.md](./ENV_TEMPLATE.md) - Complete .env template
- [ENV_SETUP.md](./ENV_SETUP.md) - Detailed environment setup guide
- [QUICK_START.md](./QUICK_START.md) - Quick start guide
- [USER_MAPPING_SETUP.md](./USER_MAPPING_SETUP.md) - User mapping guide
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Testing guide

## ✨ You're Done!

Your Telegram bot should now be fully integrated with your order system!
