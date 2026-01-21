# Testing Guide - Telegram Bot Admin Permissions & Notifications

This guide helps you test the new admin-only creation features and notification push system.

## Prerequisites

1. Telegram bot running with webhook server
2. Order system running with notifications enabled
3. At least two Telegram users: one admin, one regular user
4. Access to Telegram to send messages

## Setup for Testing

### 1. Configure Admin Users

Edit `src/config/userMapping.js`:

```javascript
export const ADMIN_USERS = [
  '123456789',  // Your admin Telegram user ID
  // Add test admin here if needed
];

export const USER_MAPPING = {
  '123456789': {
    userId: 1,
    name: 'Admin User',
    email: 'admin@test.com'
  },
  '987654321': {
    userId: 2,
    name: 'Regular User',
    email: 'user@test.com'
  },
};
```

### 2. Environment Setup

**Order System (.env):**
```env
ENABLE_TELEGRAM_NOTIFICATIONS=true
TELEGRAM_BOT_WEBHOOK_URL=http://localhost:3001/webhook/notification
TELEGRAM_BOT_WEBHOOK_SECRET=test-secret-123
```

**Telegram Bot (.env):**
```env
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_NOTIFICATION_CHAT_ID=123456789
WEBHOOK_PORT=3001
WEBHOOK_SECRET=test-secret-123
```

### 3. Start Both Services

```bash
# Terminal 1: Order System
cd ordersystem
npm run server

# Terminal 2: Telegram Bot
cd ordersystem-telegram-bot
npm start
```

## Test Cases

### Test 1: Admin User - Create Order (Should Work)

**User:** Admin user on Telegram  
**Action:** Send message: "Create order for John, buy 500 USDT sell 520 USD, rate 1.04"

**Expected Result:**
- Bot asks follow-up questions for missing info
- Bot successfully creates the order
- Success message shows order details
- Notification appears in Telegram chat

**Success Criteria:**  
✅ Bot processes create request  
✅ Order created in system  
✅ Notification pushed to Telegram

### Test 2: Regular User - Create Order (Should Be Blocked)

**User:** Regular (non-admin) user on Telegram  
**Action:** Send message: "Create order for Sarah"

**Expected Result:**
Bot sends rejection message directing user to web system.

**Success Criteria:**  
✅ Bot rejects create request politely  
✅ No order created  
✅ User directed to web system

### Test 3: Regular User - Query Orders (Should Work)

**User:** Regular (non-admin) user on Telegram  
**Action:** Send message: "Show recent orders"

**Expected Result:**
- Bot lists recent orders
- Shows order IDs, amounts, currencies, status

**Success Criteria:**  
✅ Bot shows order list  
✅ No permission issues for queries

## Troubleshooting

### Bot not responding to admin user

**Check:**
1. Admin Telegram user ID in ADMIN_USERS array
2. User ID as string: '123456789' not 123456789
3. Bot logs show user identification
4. Restart bot after config changes

### Regular user can create (shouldn't happen)

**Check:**
1. User NOT in ADMIN_USERS array
2. Bot restarted after config change
3. Correct Telegram user ID (string format)

### Notifications not appearing

**Check:**
1. ENABLE_TELEGRAM_NOTIFICATIONS=true
2. TELEGRAM_NOTIFICATION_CHAT_ID set correctly
3. Bot token is valid
4. Webhook secret matches both sides
5. Both services running

### Can't get Telegram user ID

**Solution:**
1. Send any message to your bot
2. Check bot console logs
3. Look for: Message from Name (123456789)
4. The number in parentheses is the user ID

## Verification Checklist

After testing, verify:

- ✅ Admin users can create orders/expenses/transfers
- ✅ Regular users CANNOT create via bot
- ✅ Regular users get friendly rejection messages
- ✅ All users can query and view data
- ✅ Help command shows correct info per role
- ✅ Notifications push to Telegram
- ✅ Notification formatting is correct
- ✅ Webhook authentication works
- ✅ Bot handles errors gracefully

## Security Testing

### Test Invalid Webhook Secret

Try sending webhook with wrong secret:

```bash
curl -X POST http://localhost:3001/webhook/notification \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: wrong-secret" \
  -d '{"type": "test"}'
```

**Expected:** 401 Unauthorized

## Next Steps After Testing

Once all tests pass:
1. Deploy to production environment
2. Configure production admin users
3. Set up monitoring and logging
4. Document for end users
5. Train team on bot capabilities
