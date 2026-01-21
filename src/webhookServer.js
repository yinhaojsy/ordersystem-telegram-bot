import express from 'express';
import dotenv from 'dotenv';
import { pushNotification } from './services/notificationPusher.js';

dotenv.config();

const app = express();
const PORT = process.env.WEBHOOK_PORT || 3001;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'your-secret-key-here';

// Middleware
app.use(express.json());

/**
 * Webhook endpoint for receiving notifications from order system
 */
app.post('/webhook/notification', async (req, res) => {
  try {
    // Verify webhook secret
    const providedSecret = req.headers['x-webhook-secret'];
    if (providedSecret !== WEBHOOK_SECRET) {
      console.warn('⚠️  Unauthorized webhook attempt');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const notification = req.body;
    
    console.log('📩 Received notification webhook:', notification.type);
    
    // Push notification to Telegram
    const success = await pushNotification(notification);
    
    if (success) {
      res.json({ success: true, message: 'Notification pushed to Telegram' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to push notification' });
    }
  } catch (error) {
    console.error('❌ Error handling webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'telegram-bot-webhook' });
});

/**
 * Start webhook server
 */
export function startWebhookServer() {
  return new Promise((resolve) => {
    const server = app.listen(PORT, () => {
      console.log(`✅ Webhook server listening on port ${PORT}`);
      console.log(`🔗 Webhook URL: http://localhost:${PORT}/webhook/notification`);
      resolve(server);
    });
  });
}
