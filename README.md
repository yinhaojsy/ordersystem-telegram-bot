# Order System Telegram Bot

A conversational Telegram bot for managing currency exchange orders, expenses, and transfers. Built with Node.js, OpenAI GPT-4, and the Telegram Bot API.

## ✨ Features

- 🤖 **Natural Language Understanding**: Uses GPT-4 for conversational AI
- 📦 **Order Management**: Create, view, and track currency exchange orders
- 💰 **Expense Tracking**: Monitor expenses across accounts
- 🔄 **Transfer Management**: Track internal transfers between accounts
- 📢 **Real-time Notifications**: Receive updates directly in Telegram
- 🔐 **Role-based Permissions**: Admin-only creation, everyone can query
- 💬 **Conversational Interface**: Multi-turn conversations for complex tasks
- 🔍 **Smart Filtering**: Filter orders by status, date, handler, customer, tags, and more

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- Telegram account
- OpenAI API key
- Order System backend running

### 1. Create Your Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Follow prompts to create your bot
4. Copy the bot token

### 2. Installation

```bash
npm install
```

### 3. Configuration

**📋 See [ENV_SETUP_SUMMARY.md](ENV_SETUP_SUMMARY.md) for complete setup instructions!**

Create a `.env` file (see [ENV_TEMPLATE.md](ENV_TEMPLATE.md) for details):

```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_NOTIFICATION_CHAT_ID=your_chat_id

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Order System API
ORDER_SYSTEM_API_URL=http://localhost:3000/api
ORDER_SYSTEM_AUTH_TOKEN=your_auth_token

# Webhook Server
WEBHOOK_PORT=3001
WEBHOOK_SECRET=your-secret-key
```

**Validate your configuration:**
```bash
npm run check-env
```

Configure user mapping in `src/config/userMapping.js`:

```javascript
export const USER_MAPPING = {
  '123456789': {  // Your Telegram user ID
    userId: 1,
    name: 'Admin User',
    email: 'admin@test.com'
  },
};

export const ADMIN_USERS = ['123456789'];
```

### 4. Run

```bash
npm start
```

## 📖 Documentation

### 🚀 Setup & Configuration
- **[ENV_SETUP_SUMMARY.md](ENV_SETUP_SUMMARY.md)** - ⭐ Start here! Complete setup overview
- **[SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)** - Step-by-step setup checklist
- **[ENV_TEMPLATE.md](ENV_TEMPLATE.md)** - Complete .env template
- **[ENV_QUICK_REFERENCE.md](ENV_QUICK_REFERENCE.md)** - Quick environment variable reference
- **[Quick Start Guide](QUICK_START.md)** - Get started in 5 minutes
- **[User Mapping Setup](USER_MAPPING_SETUP.md)** - Configure user permissions

### 🔧 Features & Usage
- **[Notification Setup](NOTIFICATION_SETUP.md)** - Enable push notifications
- **[Conversational Features](CONVERSATIONAL_BOT_GUIDE.md)** - Learn about AI features
- **[Filter Guide](FILTER_GUIDE.md)** - Advanced filtering options
- **[Testing Guide](TESTING_GUIDE.md)** - Test your bot

## 💬 Usage Examples

### Query Orders

```
You: show recent orders
Bot: 📋 Orders (15 found)
     #123 1/15: 100 USDT → 700 HKD @7 | pending | 👥John...
```

### Create Order (Admin Only)

```
You: create order for Alice, buy 100 USDT sell 700 HKD, rate 7
Bot: Which account will receive the 100 USDT?
You: Main Wallet
Bot: Which account will pay the 700 HKD?
You: HSBC Account
Bot: ✅ Perfect! Order Created Successfully!
```

### Advanced Filtering

```
You: show pending orders from last week tagged HK
Bot: 📋 Orders (status: pending, dateRange: last_week, tags: HK)
     #125 1/14: 500 USDT → 3500 HKD...
```

## 🏗️ Architecture

```
Telegram ←→ Bot (Node.js)
              ↓
            GPT-4 (OpenAI)
              ↓
          Order System API
              ↓
          SQLite Database
```

## 🔐 Security

- User authentication via Telegram user ID
- Webhook secret for notification endpoint
- Role-based access control (Admin vs Regular users)
- Token-based API authentication

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Telegram Bot API** - Bot framework
- **OpenAI GPT-4** - Natural language processing
- **Express** - Webhook server
- **Axios** - HTTP client

## 📝 License

ISC

## 🤝 Contributing

This is a private project for internal use.

## 📧 Support

For issues or questions, check the documentation in the `/docs` folder or review the bot logs.

---

Made with ❤️ for efficient order management
