import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import { handleMessage } from './bot/messageHandler.js';
import { initNotificationPusher } from './services/notificationPusher.js';
import { startWebhookServer } from './webhookServer.js';

dotenv.config();

const botToken = process.env.TELEGRAM_BOT_TOKEN;

if (!botToken) {
  console.error('❌ Missing TELEGRAM_BOT_TOKEN in .env');
  process.exit(1);
}

// Create bot instance
const bot = new TelegramBot(botToken, { polling: true });

console.log('🤖 Bot instance created, setting up message handler...');

// Handle incoming messages
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const username = msg.from.username || msg.from.first_name;
  const text = msg.text;

  // Ignore messages without text
  if (!text) return;

  console.log(`📩 Message from ${username} (${userId}) in chat ${chatId}: ${text}`);

  try {
    // Handle /start command
    if (text === '/start') {
      await bot.sendMessage(chatId, `👋 Welcome to Order System Bot!\n\nType 'help' to see what I can do for you.`);
      return;
    }

    // Handle /chatid command - show user their chat ID for configuration
    if (text === '/chatid' || text === '/id') {
      const info = `📱 Your Telegram Info:\n\n` +
                   `User ID: ${userId}\n` +
                   `Chat ID: ${chatId}\n` +
                   `Username: ${username}\n\n` +
                   `💡 Use the Chat ID (${chatId}) in your .env file:\n` +
                   `TELEGRAM_NOTIFICATION_CHAT_ID=${chatId}`;
      await bot.sendMessage(chatId, info);
      return;
    }

    // Handle natural language chat ID requests
    const lowerText = text.toLowerCase();
    if (lowerText.includes('chat id') || 
        lowerText.includes('chatid') ||
        (lowerText.includes('my id') && !lowerText.includes('order')) ||
        lowerText.includes('telegram id')) {
      const info = `📱 Your Telegram Info:\n\n` +
                   `User ID: ${userId}\n` +
                   `Chat ID: ${chatId}\n` +
                   `Username: ${username}\n\n` +
                   `💡 Use the Chat ID (${chatId}) in your .env file:\n` +
                   `TELEGRAM_NOTIFICATION_CHAT_ID=${chatId}`;
      await bot.sendMessage(chatId, info);
      return;
    }

    const response = await handleMessage(text, userId, chatId, msg);

    if (response) {
      // Send without parse_mode to avoid Markdown parsing issues with special characters
      await bot.sendMessage(chatId, response);
    }
  } catch (error) {
    console.error('❌ Error handling message:', error);
    await bot.sendMessage(chatId, `❌ Error: ${error.message}`);
  }
});

// Handle polling errors
bot.on('polling_error', (error) => {
  console.error('❌ Polling error:', error.code, error.message);
});

// Start the bot
console.log("✅ Order System Telegram Bot started successfully!");
console.log(`🤖 Bot is listening for messages...`);

// Initialize notification pusher
initNotificationPusher(bot);

// Start webhook server for receiving notifications
try {
  await startWebhookServer();
} catch (error) {
  console.error("⚠️  Warning: Webhook server failed to start:", error);
  console.log("Bot will continue without webhook support");
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Stopping bot...');
  bot.stopPolling();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('🛑 Stopping bot...');
  bot.stopPolling();
  process.exit(0);
});

export { bot };
