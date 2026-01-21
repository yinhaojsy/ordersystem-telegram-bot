# Environment Setup Summary

## 📁 Files Created

I've created several helper files to guide you through setting up your `.env` files:

### 1. **ENV_TEMPLATE.md** 
Complete `.env` template with detailed comments for the Telegram bot

### 2. **ENV_QUICK_REFERENCE.md**
Quick reference table showing all environment variables at a glance

### 3. **SETUP_CHECKLIST.md**
Step-by-step checklist to set up everything from scratch

### 4. **check-env.js**
Automated script to validate your `.env` configuration

### 5. **TELEGRAM_ENV_TEMPLATE.md** (in ordersystem folder)
Template for adding Telegram integration to your order system

---

## 🚀 Quick Start

### Step 1: Edit Your .env Files

Since `.env` files are protected (which is good!), you need to manually edit them:

**Telegram Bot** (`/ordersystem-telegram-bot/.env`):
```env
TELEGRAM_BOT_TOKEN=<get-from-@BotFather>
TELEGRAM_NOTIFICATION_CHAT_ID=<your-telegram-user-id>
OPENAI_API_KEY=<from-openai.com>
ORDER_SYSTEM_API_URL=http://localhost:3000/api
ORDER_SYSTEM_AUTH_TOKEN=<from-browser-devtools>
WEBHOOK_PORT=3001
WEBHOOK_SECRET=<generate-with-openssl>
```

**Order System** (`/ordersystem/.env` - add to existing file):
```env
ENABLE_TELEGRAM_NOTIFICATIONS=true
TELEGRAM_BOT_WEBHOOK_URL=http://localhost:3001/webhook/notification
TELEGRAM_BOT_WEBHOOK_SECRET=<same-as-bot-WEBHOOK_SECRET>
```

### Step 2: Generate Secure Secret

```bash
openssl rand -base64 32
```

Use the output for both:
- Bot: `WEBHOOK_SECRET`
- Order System: `TELEGRAM_BOT_WEBHOOK_SECRET`

### Step 3: Validate Configuration

```bash
cd "/Users/yin/Documents/Codes/Webapp Projects/ordersystem-telegram-bot"
npm run check-env
```

This will check if all your environment variables are properly configured.

### Step 4: Start Services

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

---

## 🔑 Critical Information

### Where to Get Each Value

| Variable | Where to Get It |
|----------|----------------|
| `TELEGRAM_BOT_TOKEN` | Telegram → @BotFather → /newbot |
| `TELEGRAM_NOTIFICATION_CHAT_ID` | Start bot, send message, check logs |
| `OPENAI_API_KEY` | https://platform.openai.com/api-keys |
| `ORDER_SYSTEM_AUTH_TOKEN` | Browser DevTools → Application → Local Storage → token |
| `WEBHOOK_SECRET` | Generate: `openssl rand -base64 32` |

### Important Rules

1. ⚠️ **Secrets must match**: 
   - Bot's `WEBHOOK_SECRET` = Order System's `TELEGRAM_BOT_WEBHOOK_SECRET`

2. ⚠️ **Never commit .env files** (already in .gitignore)

3. ⚠️ **Use strong secrets** (32+ characters)

---

## 📚 Documentation Index

| File | Purpose |
|------|---------|
| [ENV_TEMPLATE.md](./ENV_TEMPLATE.md) | Complete template with all variables |
| [ENV_QUICK_REFERENCE.md](./ENV_QUICK_REFERENCE.md) | Quick lookup table |
| [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) | Step-by-step setup guide |
| [ENV_SETUP.md](./ENV_SETUP.md) | Detailed environment guide |
| [QUICK_START.md](./QUICK_START.md) | Quick start guide |
| [USER_MAPPING_SETUP.md](./USER_MAPPING_SETUP.md) | Configure user mappings |
| [TESTING_GUIDE.md](./TESTING_GUIDE.md) | Test your setup |

---

## 🧪 Testing Your Setup

1. **Check environment variables:**
   ```bash
   npm run check-env
   ```

2. **Start both services** (see Step 4 above)

3. **Test bot commands:**
   - Open Telegram
   - Find your bot
   - Send: `/start`
   - Send: `list orders`

4. **Test notifications:**
   - Create/update an order in the order system
   - You should receive a Telegram notification

---

## 🐛 Troubleshooting

### Bot not responding
- ✅ Check `TELEGRAM_BOT_TOKEN` is correct
- ✅ Verify bot is running (no errors in terminal)
- ✅ Send `/start` to the bot first

### No notifications
- ✅ Check `ENABLE_TELEGRAM_NOTIFICATIONS=true`
- ✅ Verify secrets match in both .env files
- ✅ Ensure both services are running
- ✅ Check logs for errors

### Authentication errors
- ✅ Update `ORDER_SYSTEM_AUTH_TOKEN` (may have expired)
- ✅ Check user mapping is configured
- ✅ Verify API URL is correct

---

## ✅ Next Steps

After setting up your `.env` files:

1. Run `npm run check-env` to validate
2. Configure user mapping (see [USER_MAPPING_SETUP.md](./USER_MAPPING_SETUP.md))
3. Start both services
4. Test the integration
5. Check [TESTING_GUIDE.md](./TESTING_GUIDE.md) for comprehensive tests

---

## 💡 Tips

- Keep your `.env` files backed up securely (not in git!)
- Regenerate secrets periodically for security
- Use different secrets for development and production
- Monitor logs when testing to catch issues early

---

## 🆘 Need Help?

1. Read [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) for detailed steps
2. Check [ENV_QUICK_REFERENCE.md](./ENV_QUICK_REFERENCE.md) for quick lookup
3. Review [TESTING_GUIDE.md](./TESTING_GUIDE.md) for common issues
4. Run `npm run check-env` to diagnose configuration problems
