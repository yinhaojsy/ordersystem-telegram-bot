# User Mapping Setup Guide

Your bot now maps Telegram users to Order System users automatically! This ensures orders have the correct handler assigned and accounts are tracked properly.

---

## 🔐 **How It Works**

1. **Telegram User ID** → **Order System User**
2. Bot automatically assigns **handler** when creating orders
3. Bot asks for **buy/sell accounts** during order creation

---

## ⚙️ **Setup Instructions**

### **Step 1: Find Your Telegram User ID**

**Method 1: Use the Bot**
1. Start your bot (send `/start`)
2. Send any message
3. Check the bot console logs - it will show:
   ```
   📩 Message from YourName (123456789) in chat 123456789: hello
   ```
4. The number in parentheses is your user ID: `123456789`

**Method 2: Use @userinfobot**
1. On Telegram, search for `@userinfobot`
2. Start the bot
3. It will show your user ID

### **Step 2: Find Your Order System User ID**

1. Log into your order system web interface
2. Go to user management or check your profile
3. Note your User ID (usually a number like 1, 2, 3, etc.)

### **Step 3: Configure User Mapping**

Edit: `src/config/userMapping.js`

```javascript
export const USER_MAPPING = {
  // Your Telegram user ID → Order System user mapping
  // ⚠️ Important: User IDs must be strings, not numbers!
  '123456789': {
    userId: 1,              // Your Order System user ID
    name: 'Admin User',     // Display name
    email: 'admin@test.com' // Email
  },
  
  // Add more team members
  '987654321': {
    userId: 2,
    name: 'John Handler',
    email: 'john@company.com'
  },
  
  '555444333': {
    userId: 3,
    name: 'Sarah Handler',
    email: 'sarah@company.com'
  },
};

export const ADMIN_USERS = [
  '123456789',  // Add Telegram user IDs of admin users
  '987654321',
];
```

> ⚠️ **Important:** Telegram user IDs must be strings (in quotes), not numbers!

---

## 📝 **New Order Creation Flow**

Now when you create an order, the bot will ask:

```
You: create order
Bot: Is this an online order or OTC order?

You: otc
Bot: What's the customer's name?

You: Alice
Bot: What currency pair? (e.g., HKD/USDT)

You: usdt/hkd
Bot: What's the exchange rate?

You: 7
Bot: How much USDT is Alice buying?

You: 100
Bot: Which account will receive the 100 USDT? (e.g., Main Wallet, Binance)

You: Main Wallet
Bot: Which account will pay the 700 HKD? (e.g., HSBC Account, Cash)

You: HSBC Account
Bot: ✅ Perfect! Order Created Successfully!
     📝 Order ID: #123
     👤 Customer: Alice
     💱 Pair: USDT/HKD
     📊 Rate: 7
     💵 Buy: 100 USDT → Main Wallet
     💸 Sell: 700 HKD → HSBC Account
     📦 Type: otc
     👨‍💼 Handler: Admin User
```

---

## 💰 **Account Management**

### **Common Account Names:**

**For Crypto/Stablecoins:**
- Main Wallet
- Binance
- Coinbase
- OKX
- Cold Wallet

**For Fiat:**
- HSBC Account
- Cash
- Alipay
- WeChat Pay
- Bank Transfer

**You can use any account names** - the bot will remember and use them consistently.

---

## 🔍 **What Happens in the Background**

1. **Handler Assignment:**
   - Bot checks `123456789` → finds `userId: 1`
   - Order is created with `handlerId: 1`
   - Order shows "Admin User" as handler

2. **Account Tracking:**
   - Buy Account: "Main Wallet" (receives USDT)
   - Sell Account: "HSBC Account" (pays HKD)
   - Stored in database for financial tracking

---

## ⚠️ **If User Not Mapped**

If a Telegram user is NOT in the mapping file:

```
✅ Order still gets created
⚠️  Handler field is empty (No Handler Assigned)
📋 You'll see a warning in the bot terminal:
    "⚠️  No user mapping found for 123456789, creating without handler"
```

**Solution:** Add the user to `userMapping.js` and restart the bot.

---

## 🚀 **Restart After Configuration**

After editing `userMapping.js`, restart your bot:

```bash
# Stop the bot (Ctrl+C)
npm start
```

---

## 📊 **Example: Complete Order**

**Before (Old):**
- No handler assigned
- No account tracking
- Just amounts and currencies

**After (New):**
```
Order #123:
- Customer: Alice
- Handler: Admin User (auto-assigned from Telegram)
- Buy: 100 USDT → Main Wallet
- Sell: 700 HKD → HSBC Account
- Rate: 7
- Type: OTC
```

---

## 💡 **Pro Tips**

1. **Standard Account Names:**
   - Use consistent names: "Main Wallet" not "Main wallet" or "main_wallet"
   - Makes reporting easier later

2. **Multiple Handlers:**
   - Each Telegram user can have their own mapping
   - Orders automatically get the right handler

3. **Update Mapping Anytime:**
   - Just edit `userMapping.js`
   - Restart the bot
   - New orders use new mapping

4. **User IDs are Strings:**
   - Always use quotes: `'123456789'`
   - NOT numbers: `123456789` ❌

---

**Your bot now has full handler assignment and account tracking!** 🎉
