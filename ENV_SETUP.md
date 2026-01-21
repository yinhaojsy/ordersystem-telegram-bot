# Environment Variables Setup

This guide explains all the environment variables needed for the Telegram bot.

## Required Variables

Create a `.env` file in the root of the bot project with the following variables:

### Telegram Configuration

```env
# Your bot token from @BotFather
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz

# Chat ID where notifications will be sent
# For personal chat: use your user ID (e.g., 123456789)
# For group chat: use group ID (negative number, e.g., -987654321)
TELEGRAM_NOTIFICATION_CHAT_ID=123456789
```

**How to get these values:**

1. **TELEGRAM_BOT_TOKEN**:
   - Open Telegram and search for `@BotFather`
   - Send `/newbot` and follow the prompts
   - Copy the token provided

2. **TELEGRAM_NOTIFICATION_CHAT_ID**:
   - For personal chat: Start your bot and send a message, check logs for your user ID
   - For group chat: Add bot to group, send a message, check logs for group ID

### OpenAI Configuration

```env
# Your OpenAI API key for GPT-4 conversational features
OPENAI_API_KEY=sk-...your-key-here
```

**How to get:**
- Go to https://platform.openai.com/api-keys
- Create a new API key
- Copy and paste it here

### Order System API Configuration

```env
# URL of your order system backend API
ORDER_SYSTEM_API_URL=http://localhost:3000/api

# Authentication token for the order system
# This should match a valid user token from your order system
ORDER_SYSTEM_AUTH_TOKEN=your_auth_token_here
```

**How to get:**
- `ORDER_SYSTEM_API_URL`: The base URL of your running order system
- `ORDER_SYSTEM_AUTH_TOKEN`: Generate from your order system's authentication

### Webhook Server Configuration

```env
# Port for the webhook server (receives notifications from order system)
WEBHOOK_PORT=3001

# Secret key for webhook authentication
# IMPORTANT: This must match TELEGRAM_BOT_WEBHOOK_SECRET in order system .env
WEBHOOK_SECRET=your-secure-random-secret-key-here
```

**Security Notes:**
- Use a strong random secret (32+ characters)
- Keep this secret the same in both bot and order system configs
- Never commit your `.env` file to git (it's in `.gitignore`)

## Complete Example

Here's a complete example `.env` file:

```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_NOTIFICATION_CHAT_ID=123456789

# OpenAI
OPENAI_API_KEY=sk-proj-abc123def456ghi789...

# Order System API
ORDER_SYSTEM_API_URL=http://localhost:3000/api
ORDER_SYSTEM_AUTH_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Webhook Server
WEBHOOK_PORT=3001
WEBHOOK_SECRET=super-secret-random-key-change-this-in-production
```

## Order System Configuration

Your order system also needs these variables in its `.env` file:

```env
# Enable notifications to Telegram
ENABLE_TELEGRAM_NOTIFICATIONS=true

# Webhook URL of the Telegram bot
TELEGRAM_BOT_WEBHOOK_URL=http://localhost:3001/webhook/notification

# Must match the bot's WEBHOOK_SECRET
TELEGRAM_BOT_WEBHOOK_SECRET=super-secret-random-key-change-this-in-production
```

## Validation

After creating your `.env` file, run:

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

If you see any errors, check:
1. All required variables are set
2. Bot token is valid
3. Chat ID is correct
4. No extra spaces or quotes around values

## Production Considerations

For production deployment:

1. **Use HTTPS** for webhook URL if bot and order system are on different servers
2. **Strong secrets** - Use a password generator for WEBHOOK_SECRET
3. **Secure storage** - Use environment variables or secret management service
4. **No commits** - Never commit `.env` to version control
5. **Backup** - Keep a secure backup of your configuration

## Troubleshooting

### Bot won't start

**Error: Missing TELEGRAM_BOT_TOKEN**
- Solution: Add bot token from BotFather to `.env`

**Error: OpenAI API key invalid**
- Solution: Check your OpenAI API key is correct and active

### Notifications not working

**Check:**
1. `TELEGRAM_NOTIFICATION_CHAT_ID` is set
2. `WEBHOOK_SECRET` matches in both bot and order system
3. Order system has `ENABLE_TELEGRAM_NOTIFICATIONS=true`
4. Both services are running

### Webhook errors

**401 Unauthorized**
- Webhook secret mismatch - check both `.env` files

**Connection refused**
- Check `WEBHOOK_PORT` is correct and not blocked by firewall

## Need Help?

See other documentation:
- [Quick Start Guide](QUICK_START.md) - Complete setup walkthrough
- [Notification Setup](NOTIFICATION_SETUP.md) - Notification system details
- [Testing Guide](TESTING_GUIDE.md) - Test your configuration
