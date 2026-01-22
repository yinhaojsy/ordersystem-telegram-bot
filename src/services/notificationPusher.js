import dotenv from 'dotenv';
dotenv.config();

/**
 * Notification Pusher Service
 * Handles pushing notifications from the order system to Telegram chats
 */

let telegramBot = null;
const TARGET_CHAT_ID = process.env.TELEGRAM_NOTIFICATION_CHAT_ID;

/**
 * Initialize the notification pusher with Telegram bot
 */
export function initNotificationPusher(bot) {
  telegramBot = bot;
  console.log('✅ Notification pusher initialized');
  if (TARGET_CHAT_ID) {
    console.log(`📢 Notifications will be sent to chat: ${TARGET_CHAT_ID}`);
  } else {
    console.warn('⚠️  TELEGRAM_NOTIFICATION_CHAT_ID not set. Notifications will not be pushed.');
  }
}

/**
 * Push notification to Telegram chat
 */
export async function pushNotification(notification) {
  if (!telegramBot) {
    console.error('❌ Telegram bot not initialized');
    return false;
  }

  if (!TARGET_CHAT_ID) {
    console.warn('⚠️  No target chat configured for notifications');
    return false;
  }

  try {
    const message = formatNotification(notification);
    await telegramBot.sendMessage(TARGET_CHAT_ID, message);
    console.log(`✅ Pushed notification to Telegram: ${notification.type}`);
    return true;
  } catch (error) {
    console.error('❌ Error pushing notification to Telegram:', error);
    return false;
  }
}

/**
 * Format notification for Telegram display
 */
function formatNotification(notification) {
  const { type, title, message, entityType, entityId, userId, userName } = notification;
  
  // Icon mapping for notification types
  const icons = {
    'approval_approved': '✅',
    'approval_rejected': '❌',
    'approval_pending': '⏳',
    'order_assigned': '👤',
    'order_unassigned': '🔓',
    'order_created': '📦',
    'order_completed': '✅',
    'order_cancelled': '❌',
    'order_deleted': '🗑️',
    'expense_created': '💰',
    'expense_deleted': '🗑️',
    'transfer_created': '🔄',
    'transfer_deleted': '🗑️',
    'wallet_incoming': '📥',
    'wallet_outgoing': '📤',
    'wallet_transaction': '💳',
  };

  const icon = icons[type] || '🔔';
  
  // Build message as plain text
  let text = `${icon} ${title}\n${message}`;
  
  if (entityType && entityId) {
    text += `\n🔗 ${entityType} #${entityId}`;
  }
  
  if (userName) {
    text += `\n👤 ${userName}`;
  }

  return text;
}

/**
 * Broadcast multiple notifications
 */
export async function pushNotifications(notifications) {
  const results = await Promise.allSettled(
    notifications.map(notification => pushNotification(notification))
  );
  
  const successful = results.filter(r => r.status === 'fulfilled' && r.value).length;
  console.log(`✅ Pushed ${successful}/${notifications.length} notifications to Telegram`);
  
  return successful;
}
