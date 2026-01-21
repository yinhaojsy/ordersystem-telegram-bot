# Quick Reference: Environment Variables

## 🤖 Telegram Bot (.env)

| Variable | Example | Where to Get |
|----------|---------|--------------|
| `TELEGRAM_BOT_TOKEN` | `123456789:ABCdef...` | @BotFather on Telegram |
| `TELEGRAM_NOTIFICATION_CHAT_ID` | `123456789` | Send message to bot, check logs |
| `OPENAI_API_KEY` | `sk-proj-abc123...` | https://platform.openai.com/api-keys |
| `ORDER_SYSTEM_API_URL` | `http://localhost:3000/api` | Your order system URL |
| `ORDER_SYSTEM_AUTH_TOKEN` | `eyJhbGciOiJ...` | Browser DevTools → Local Storage |
| `WEBHOOK_PORT` | `3001` | Any available port |
| `WEBHOOK_SECRET` | `random-32-char-string` | `openssl rand -base64 32` |

## 🏢 Order System (.env)

| Variable | Example | Notes |
|----------|---------|-------|
| `ENABLE_TELEGRAM_NOTIFICATIONS` | `true` | Enable/disable notifications |
| `TELEGRAM_BOT_WEBHOOK_URL` | `http://localhost:3001/webhook/notification` | Bot's webhook endpoint |
| `TELEGRAM_BOT_WEBHOOK_SECRET` | `random-32-char-string` | **Must match bot's WEBHOOK_SECRET** |

## 🔑 Critical Rules

1. ⚠️ **WEBHOOK_SECRET must match** in both files:
   - Bot: `WEBHOOK_SECRET`
   - Order System: `TELEGRAM_BOT_WEBHOOK_SECRET`

2. ⚠️ **Never commit .env files** to git (already in .gitignore)

3. ⚠️ **Generate secure secrets**:
   ```bash
   openssl rand -base64 32
   ```

## 📋 Copy-Paste Templates

### Telegram Bot .env
```env
TELEGRAM_BOT_TOKEN=
TELEGRAM_NOTIFICATION_CHAT_ID=
OPENAI_API_KEY=
ORDER_SYSTEM_API_URL=http://localhost:3000/api
ORDER_SYSTEM_AUTH_TOKEN=
WEBHOOK_PORT=3001
WEBHOOK_SECRET=
```

### Order System .env (add to existing file)
```env
ENABLE_TELEGRAM_NOTIFICATIONS=true
TELEGRAM_BOT_WEBHOOK_URL=http://localhost:3001/webhook/notification
TELEGRAM_BOT_WEBHOOK_SECRET=
```

## 🧪 Test Your Setup

```bash
# Generate secret
openssl rand -base64 32

# Start order system
cd ordersystem && npm run dev

# Start bot (in new terminal)
cd ordersystem-telegram-bot && npm start

# Test in Telegram
# Send: /start
# Send: list orders
```

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Bot not responding | Check `TELEGRAM_BOT_TOKEN` |
| No notifications | Check secrets match |
| Auth errors | Update `ORDER_SYSTEM_AUTH_TOKEN` |
| OpenAI errors | Check `OPENAI_API_KEY` and credits |

## 📚 Full Documentation

- [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) - Step-by-step setup
- [ENV_TEMPLATE.md](./ENV_TEMPLATE.md) - Complete template with comments
- [ENV_SETUP.md](./ENV_SETUP.md) - Detailed setup guide
