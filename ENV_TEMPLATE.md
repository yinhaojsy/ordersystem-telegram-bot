# .env File Template for Telegram Bot

Copy this template to your `.env` file and fill in your actual values.

```env
# ============================================
# TELEGRAM BOT CONFIGURATION
# ============================================

# Your bot token from @BotFather on Telegram
# How to get: Open Telegram → Search @BotFather → Send /newbot
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz

# Chat ID where notifications will be sent
# For personal chat: use your user ID (e.g., 123456789)
# For group chat: use group ID (negative number, e.g., -987654321)
# How to get: Start bot → Send a message → Check logs for your user ID
TELEGRAM_NOTIFICATION_CHAT_ID=123456789


# ============================================
# OPENAI CONFIGURATION
# ============================================

# Your OpenAI API key for GPT-4 conversational features
# Get from: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-proj-your-openai-api-key-here


# ============================================
# ORDER SYSTEM API CONFIGURATION
# ============================================

# URL of your order system backend API
ORDER_SYSTEM_API_URL=http://localhost:4000/api

# Authentication token for the order system
# Generate this from your order system's authentication
ORDER_SYSTEM_AUTH_TOKEN=your_auth_token_here


# ============================================
# WEBHOOK SERVER CONFIGURATION
# ============================================

# Port for the webhook server (receives notifications from order system)
WEBHOOK_PORT=3001

# Secret key for webhook authentication
# IMPORTANT: This must match TELEGRAM_BOT_WEBHOOK_SECRET in order system .env
# Use a strong random secret (32+ characters)
# Example: openssl rand -base64 32
WEBHOOK_SECRET=your-secure-random-secret-key-change-this-in-production
```

## Instructions

1. Copy the content above to your `.env` file
2. Replace all placeholder values with your actual values
3. Make sure `WEBHOOK_SECRET` matches in both bot and order system
4. Never commit your `.env` file to git (it's already in `.gitignore`)

## Generate Secure Secret

To generate a secure random secret, run:

```bash
openssl rand -base64 32
```

Use the same secret in both the bot's `WEBHOOK_SECRET` and order system's `TELEGRAM_BOT_WEBHOOK_SECRET`.
