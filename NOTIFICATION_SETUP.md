# Telegram Bot Notification System Setup

This guide explains how to set up push notifications from the Order System to Telegram.

## Overview

The notification system allows the Order System to push real-time notifications to a Telegram chat when important events occur (orders created, expenses added, approvals needed, etc.).

## Architecture

```
Order System → Webhook → Telegram Bot → Telegram Chat
```

1. **Order System**: Creates notifications and sends them via webhook
2. **Telegram Bot**: Receives webhook, formats notification, sends to Telegram chat
3. **Telegram Chat**: Users see formatted notifications in real-time

## Setup Instructions

### 1. Create Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Follow prompts to create your bot
4. Copy the bot token

### 2. Get Your Chat ID

**For Personal Chat:**
1. Start your bot on Telegram (send `/start`)
2. Send any message
3. Check bot console logs - it will show your chat ID

**For Group Chat:**
1. Add bot to your group
2. Send a message in the group
3. Check bot console logs - it will show the group chat ID (negative number)

### 3. Telegram Bot Configuration

Add these environment variables to your Telegram bot's `.env` file:

```bash
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
TELEGRAM_NOTIFICATION_CHAT_ID=your_chat_id_or_group_id

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Order System API
ORDER_SYSTEM_API_URL=http://localhost:3000/api
ORDER_SYSTEM_AUTH_TOKEN=your_auth_token

# NEW: Webhook Server Configuration
WEBHOOK_PORT=3001
WEBHOOK_SECRET=your-secure-random-secret-key-here
```

**Important**: 
- `TELEGRAM_NOTIFICATION_CHAT_ID`: Your personal chat ID or group chat ID (use negative number for groups)
- `WEBHOOK_SECRET`: Generate a strong random secret for security. Use the same value in both bot and order system.

### 4. Order System Configuration

Add these environment variables to your Order System's `.env` file:

```bash
# NEW: Telegram Bot Webhook Configuration
ENABLE_TELEGRAM_NOTIFICATIONS=true
TELEGRAM_BOT_WEBHOOK_URL=http://localhost:3001/webhook/notification
TELEGRAM_BOT_WEBHOOK_SECRET=your-secure-random-secret-key-here
```

**Important**:
- `ENABLE_TELEGRAM_NOTIFICATIONS`: Set to `true` to enable notifications
- `TELEGRAM_BOT_WEBHOOK_URL`: URL of the Telegram bot webhook endpoint
- `TELEGRAM_BOT_WEBHOOK_SECRET`: Must match the secret in the bot's configuration

### 5. Install Dependencies

For the Telegram bot:
```bash
cd ordersystem-telegram-bot
npm install
```

### 6. Start Services

Start both services:

```bash
# Terminal 1: Start Order System
cd ordersystem
npm run server

# Terminal 2: Start Telegram Bot (includes webhook server)
cd ordersystem-telegram-bot
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

## Admin-Only Creation Features

### User Permissions

- **Admin Users**: Can create orders, expenses, and transfers via bot (for testing)
- **Regular Users**: Can only query and view data; directed to web system for creation

### Configuration

Edit `src/config/userMapping.js` to add admin users:

```javascript
export const ADMIN_USERS = [
  '123456789',  // Your Telegram user ID
  '987654321',  // Another admin's Telegram user ID
  // Add more admin Telegram user IDs here
];
```

### Non-Admin User Experience

When a non-admin user tries to create something:

```
User: create order for John
Bot: 🔒 I'm sorry, but I can only help you view and query data right now.

To create orders, please use the web system at your convenience.

I can still help you:
• Check order status
• List recent orders
• View expenses
• Check transfers

What would you like to know?
```

## Notification Types

The system sends notifications for these events:

### Orders
- `order_created`: New order created
- `order_completed`: Order marked complete
- `order_cancelled`: Order cancelled
- `order_deleted`: Order deleted
- `order_assigned`: Order assigned to handler
- `order_unassigned`: Order unassigned

### Expenses
- `expense_created`: New expense added
- `expense_deleted`: Expense deleted

### Transfers
- `transfer_created`: New transfer created
- `transfer_deleted`: Transfer deleted

### Approvals
- `approval_pending`: New approval request
- `approval_approved`: Approval granted
- `approval_rejected`: Approval rejected

## Testing

### Test Notification Webhook

Send a test notification:

```bash
curl -X POST http://localhost:3001/webhook/notification \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: your-secret-key" \
  -d '{
    "type": "order_created",
    "title": "Test Order Created",
    "message": "This is a test notification",
    "entityType": "order",
    "entityId": 123,
    "userId": 1,
    "userName": "Admin User"
  }'
```

You should see the notification appear in your Telegram chat.

### Test Admin vs Non-Admin

1. **Admin User**: Send "create order" - bot will help create the order
2. **Non-Admin User**: Send "create order" - bot will redirect to web system
3. **Any User**: Send "list orders" - bot will show recent orders

## Troubleshooting

### Bot not receiving notifications

1. Check `ENABLE_TELEGRAM_NOTIFICATIONS=true` in Order System
2. Verify webhook URL is correct and reachable
3. Check webhook secret matches in both systems
4. Check bot webhook server is running on correct port

### Notifications not appearing in chat

1. Verify `TELEGRAM_NOTIFICATION_CHAT_ID` is correct
2. Ensure bot has started (sent `/start`)
3. For groups: Ensure bot is a member and can send messages
4. Check bot logs for errors

### Webhook authentication errors

- Ensure `WEBHOOK_SECRET` matches in both Order System and Telegram Bot
- Check `X-Webhook-Secret` header is being sent correctly

### Can't get Chat ID

- Start the bot and send any message
- Check bot console output - it will print your user ID and chat ID
- For groups: Add bot to group, send message, check console

## Security Notes

1. **Webhook Secret**: Use a strong random secret (min 32 characters)
2. **Network**: If bot and order system are on different servers, use HTTPS
3. **Firewall**: Only allow webhook connections from trusted IPs
4. **Bot Token**: Keep your bot token secret - never commit to git
5. **Group Chats**: Only add trusted users to notification groups

## Production Deployment

For production:

1. Use HTTPS for webhook URL
2. Set strong webhook secret
3. Configure proper firewall rules
4. Use process manager (PM2, systemd) for both services
5. Set up monitoring and alerts
6. Configure log rotation

Example PM2 setup:

```bash
# Start Order System
pm2 start npm --name "order-system" -- run server

# Start Telegram Bot
pm2 start npm --name "telegram-bot" -- start

# Save configuration
pm2 save

# Setup auto-restart on reboot
pm2 startup
```

## Support

If you encounter issues:
1. Check logs in both Order System and Telegram Bot
2. Verify all environment variables are set correctly
3. Test webhook connectivity manually with curl
4. Ensure bot is running and has proper permissions
5. Check that chat ID is correct (negative for groups)
