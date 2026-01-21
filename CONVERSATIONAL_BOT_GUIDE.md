# Conversational AI Bot - Complete Guide

Your bot is now **fully conversational and intelligent**! It understands natural language, remembers context, calculates amounts automatically, and won't interrupt team conversations.

---

## 🎉 **New Features**

✅ **Natural Conversations** - Talk like a human, not commands  
✅ **Context Memory** - Remembers your last 8 messages  
✅ **Smart Calculations** - Give buy OR sell amount, bot calculates the other  
✅ **Currency Intelligence** - Understands HKD/USDT format  
✅ **Team Chat Friendly** - Won't respond to team discussions  
✅ **Step-by-Step Guidance** - Asks follow-up questions  

---

## 🤖 **When Bot Responds**

### ✅ **Bot WILL Respond:**
The bot responds to **ALL messages** in the room (except its own messages)

### 💡 **Best Practice:**
Use a separate room/group chat for internal team discussions. Keep this room for bot interactions only.

---

## 💬 **Example Conversations**

### **Scenario 1: Step-by-Step Order Creation**

```
You: create order
Bot: Sure! I'd be happy to help you create an order. Is this an online 
     order or OTC order? (I'll default to online if you're not sure)

You: otc
Bot: Great! What's the customer's name?

You: Alice
Bot: Perfect! What currency pair? For example, HKD/USDT or BTC/USD

You: hkd/usdt
Bot: Got it! Buying HKD, selling USDT. What's the exchange rate?

You: 7
Bot: Thanks! How much HKD is Alice buying? (Or you can tell me how much 
     USDT to sell, and I'll calculate)

You: 700 HKD
Bot: ✅ Perfect! Order Created Successfully!
     📝 Order ID: #125
     👤 Customer: Alice
     💱 Pair: HKD/USDT
     📊 Rate: 7
     💵 Buy: 700 HKD
     💸 Sell: 100 USDT (calculated!)
     📦 Type: otc
     Is there anything else I can help you with?
```

---

### **Scenario 2: Quick Order (All at Once)**

```
You: create online order for Bob, HKD/USDT, rate 7, buy 700
Bot: ✅ Perfect! Order Created Successfully!
     📝 Order ID: #126
     👤 Customer: Bob
     💱 Pair: HKD/USDT
     📊 Rate: 7
     💵 Buy: 700 HKD
     💸 Sell: 100 USDT (calculated!)
     📦 Type: online
```

---

### **Scenario 3: Give Sell Amount Instead**

```
You: create order
Bot: Sure! I'd be happy to help...

You: online, Sarah, usdt/hkd, rate 7, sell 100 usdt
Bot: ✅ Perfect! Order Created Successfully!
     📝 Order ID: #127
     👤 Customer: Sarah
     💱 Pair: USDT/HKD
     📊 Rate: 7
     💵 Buy: 700 USDT
     💸 Sell: 100 HKD (calculated!)
     📦 Type: online
```

---

### **Scenario 4: Check Order Status**

```
You: status of order 125
Bot: 📋 Order #125 Details
     👤 Customer: Alice
     💱 Exchange: 700 HKD → 100 USDT
     📊 Rate: 7
     📦 Type: otc
     ✅ Status: pending
```

---

### **Scenario 5: Complete Order**

```
You: complete order #125
Bot: ✅ Order #125 Completed!
     Order has been marked as complete.
     💱 700 HKD → 100 USDT
```

---

## 📊 **Currency Pair Format**

The bot understands multiple formats:

### **Format: BUY_CURRENCY/SELL_CURRENCY**

| You Say | Meaning |
|---------|---------|
| `HKD/USDT` | Buy HKD, Sell USDT |
| `usdt/hkd` | Buy USDT, Sell HKD |
| `BTC/USD` | Buy BTC, Sell USD |
| `hkd-usdt` | Buy HKD, Sell USDT (dash works) |
| `buy HKD sell USDT` | Buy HKD, Sell USDT (explicit) |

---

## 🧮 **Smart Calculations**

### **Rate Logic for HKD/USDT with rate 7:**
```
1 USDT = 7 HKD (stronger currency = 1 unit)
```

### **Give Buy Amount:**
```
You: "buy 700 HKD"
Bot calculates: 700 ÷ 7 = 100 USDT (sell amount)
```

### **Give Sell Amount:**
```
You: "sell 100 USDT"
Bot calculates: 100 × 7 = 700 HKD (buy amount)
```

---

## 🎮 **Special Commands**

### **Cancel Current Action:**
```
You: cancel
Bot: Okay, I've cleared everything. What would you like to do?
```

Other cancel commands: `reset`, `start over`, `clear`

### **Get Help:**
```
You: help
Bot: [Shows full command list]
```

---

## 🔥 **Advanced Usage**

### **Corrections in Conversation:**
```
You: create order
Bot: What's the customer's name?

You: Alice
Bot: Perfect! What currency pair?

You: actually, change the name to Bob
Bot: No problem! So Bob is the customer. What currency pair?
```

### **Partial Info:**
```
You: create order for Charlie, HKD/USDT
Bot: Got it! Charlie, HKD/USDT. What's the exchange rate?
```

---

## 🛠️ **Supported Currencies**

The bot knows these currencies:

- **Fiat**: USD, HKD, CNY, EUR, GBP, JPY
- **Stablecoins**: USDT, USDC
- **Crypto**: BTC, ETH

*(You can add more in `src/services/currencyKnowledge.js`)*

---

## 🎯 **Tips for Best Results**

1. **Start conversations**: `"create order"` or `"@orderbot create order"`
2. **Use currency pairs**: `"HKD/USDT"` instead of separate questions
3. **Give one amount**: Bot calculates the other
4. **Be natural**: Bot understands conversational language
5. **Use cancel**: If you make a mistake, just say `"cancel"`
6. **Check status**: `"status of order 120"` or just `"120"`

---

## 🚀 **Restart Your Bot**

Press **Ctrl+C** in your terminal, then:

```bash
npm start
```

---

## 📱 **Test in Telegram**

1. **Start a conversation:**
   ```
   create order
   ```

2. **Follow the prompts:**
   - Bot asks for order type
   - Bot asks for customer name
   - Bot asks for currency pair
   - Bot asks for rate
   - Bot asks for amount
   - Bot creates order!

3. **Or go fast:**
   ```
   create otc order for Alice, hkd/usdt, rate 7, buy 700
   ```

---

## 🎊 **What's Working Now**

✅ Responds to all messages in the room
✅ Conversation state management  
✅ Context memory (6 messages)  
✅ Smart currency calculations  
✅ Currency pair parsing  
✅ Step-by-step order creation  
✅ Natural language understanding  
✅ ID extraction from text  
✅ Conversational responses  

---

**Your bot is now a smart, conversational assistant!** 🤖✨

Try it out and enjoy natural conversations with your order system!
