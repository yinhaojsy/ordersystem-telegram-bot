# Railway Deployment Guide - Telegram Bot

Complete guide to deploy your Order System Telegram Bot to Railway.

## Prerequisites

- Railway account (sign up at https://railway.app)
- GitHub account (optional, but recommended)
- Bot configured and tested locally

## Option 1: Deploy via GitHub (Recommended)

### Step 1: Push Code to GitHub

1. **Create a new GitHub repository**
2. **Push your bot code:**
   ```bash
   cd /Users/yin/Documents/Codes/Webapp\ Projects/ordersystem-telegram-bot
   git init
   git add .
   git commit -m "Initial commit - Telegram bot"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/ordersystem-telegram-bot.git
   git push -u origin main
   ```

### Step 2: Create Railway Project

1. Go to https://railway.app
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub
5. Select your `ordersystem-telegram-bot` repository

### Step 3: Configure Environment Variables

In Railway dashboard, go to **Variables** tab and add:

```
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_NOTIFICATION_CHAT_ID=your_chat_id
OPENAI_API_KEY=your_openai_key
ORDER_SYSTEM_API_URL=https://your-ordersystem.railway.app
ORDER_SYSTEM_API_KEY=your_api_key
WEBHOOK_PORT=3001
WEBHOOK_SECRET=your_webhook_secret
```

**Important Notes:**
- `ORDER_SYSTEM_API_URL`: Use your Railway order system URL (no `/api` at end)
- Make sure `ORDER_SYSTEM_API_KEY` matches `BOT_API_KEY` in order system
- Make sure `WEBHOOK_SECRET` matches in both bot and order system

### Step 4: Deploy

Railway will automatically:
1. Detect it's a Node.js project
2. Run `npm install`
3. Start with `npm start`

The bot will be live in ~2-3 minutes!

## Option 2: Deploy via Railway CLI

### Step 1: Install Railway CLI

```bash
npm i -g @railway/cli
```

### Step 2: Login

```bash
railway login
```

### Step 3: Initialize Project

```bash
cd /Users/yin/Documents/Codes/Webapp\ Projects/ordersystem-telegram-bot
railway init
```

Select: **"Create new project"**

### Step 4: Add Environment Variables

```bash
railway variables set TELEGRAM_BOT_TOKEN="your_token"
railway variables set TELEGRAM_NOTIFICATION_CHAT_ID="your_chat_id"
railway variables set OPENAI_API_KEY="your_key"
railway variables set ORDER_SYSTEM_API_URL="https://your-ordersystem.railway.app"
railway variables set ORDER_SYSTEM_API_KEY="your_key"
railway variables set WEBHOOK_PORT="3001"
railway variables set WEBHOOK_SECRET="your_secret"
```

### Step 5: Deploy

```bash
railway up
```

## Verify Deployment

### 1. Check Logs

In Railway dashboard:
- Go to **Deployments** tab
- Click on latest deployment
- View logs to see:
  ```
  ✅ Order System Telegram Bot started successfully!
  🤖 Bot is listening for messages...
  ```

### 2. Test the Bot

Send a message to your bot on Telegram:
- `/start` - Should respond with welcome message
- `/chatid` - Should show your chat ID
- `list orders` - Should list orders from your system

### 3. Test Webhook (if configured)

Create an order in your order system - notification should appear in Telegram.

## Configuration Files

Railway will use these npm scripts from `package.json`:

```json
{
  "scripts": {
    "start": "node src/index.js",
    "dev": "node --watch src/index.js"
  }
}
```

Railway automatically runs `npm start` in production.

## Updating Your Bot

### Via GitHub:
```bash
git add .
git commit -m "Update bot"
git push
```
Railway auto-deploys on push!

### Via Railway CLI:
```bash
railway up
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `TELEGRAM_BOT_TOKEN` | Bot token from BotFather | `123456:ABCdef...` |
| `TELEGRAM_NOTIFICATION_CHAT_ID` | Chat for notifications | `7748430219` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-proj-...` |
| `ORDER_SYSTEM_API_URL` | Order system URL | `https://ordersystem.railway.app` |
| `ORDER_SYSTEM_API_KEY` | API key for order system | `your-secret-key` |
| `WEBHOOK_PORT` | Webhook server port | `3001` |
| `WEBHOOK_SECRET` | Webhook auth secret | `your-secret` |

## Connecting to Your Order System

### If Order System is Also on Railway:

1. **Get Order System URL:**
   - Go to order system project in Railway
   - Copy the public domain (e.g., `https://ordersystem-production.up.railway.app`)

2. **Update Bot Environment:**
   ```
   ORDER_SYSTEM_API_URL=https://ordersystem-production.up.railway.app
   ```

3. **Update Order System Environment:**
   - Get bot's Railway URL (if using webhooks)
   - Or use bot webhook URL: `https://bot-production.up.railway.app/webhook/notification`

### If Order System is Elsewhere:

Just use the public URL of your order system:
```
ORDER_SYSTEM_API_URL=https://your-domain.com
```

## Troubleshooting

### Bot Not Starting

**Check logs in Railway:**
1. Missing environment variables?
2. Wrong Node.js version?

**Fix:**
- Verify all required env vars are set
- Check package.json has correct start script

### Bot Can't Connect to Order System

**Error:** `Network error: Cannot reach order system`

**Check:**
1. `ORDER_SYSTEM_API_URL` is correct (no trailing slash, no `/api`)
2. Order system is running
3. `ORDER_SYSTEM_API_KEY` matches order system's `BOT_API_KEY`
4. Order system allows connections (CORS, firewall)

### Webhook Not Working

**Check:**
1. `WEBHOOK_PORT` is set to `3001`
2. `WEBHOOK_SECRET` matches in both systems
3. Order system's `MATRIX_BOT_WEBHOOK_URL` points to bot
4. Both services are deployed and running

### Out of Memory

**Railway default:** 512MB RAM

**If bot crashes:**
- Upgrade Railway plan for more memory
- Or optimize bot code (reduce conversation history, etc.)

## Monitoring

### View Logs:
```bash
railway logs
```

### Check Status:
```bash
railway status
```

### Restart Bot:
```bash
railway restart
```

## Cost Estimate

**Railway Pricing (as of 2026):**
- Hobby Plan: $5/month (500 hours)
- One bot = ~$5/month if running 24/7
- Plus order system = ~$10/month total

**Optimization:**
- Use single Railway project for both bot and order system
- Or use free tier (limited hours)

## Security Best Practices

1. **Never commit `.env` file** - it's in `.gitignore`
2. **Use Railway's environment variables** - encrypted at rest
3. **Rotate secrets regularly:**
   - Bot token (via BotFather)
   - API keys
   - Webhook secrets
4. **Use HTTPS** for all connections
5. **Set strong webhook secrets** (32+ characters)

## Backup Strategy

1. **Environment Variables:**
   - Export from Railway UI
   - Keep secure backup locally

2. **Code:**
   - GitHub is your backup
   - Tag important versions:
     ```bash
     git tag v1.0.0
     git push --tags
     ```

## Next Steps

After deployment:
1. ✅ Test all bot commands
2. ✅ Test notifications
3. ✅ Monitor logs for 24 hours
4. ✅ Set up error alerts (Railway notifications)
5. ✅ Document your deployment for team

## Support

**Railway Issues:**
- Railway Discord: https://discord.gg/railway
- Railway Docs: https://docs.railway.app

**Bot Issues:**
- Check bot logs
- Review environment variables
- Test locally first

---

**Your bot should now be running 24/7 on Railway!** 🚀
