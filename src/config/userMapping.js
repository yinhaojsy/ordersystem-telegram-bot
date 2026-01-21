/**
 * User Mapping Configuration
 * Maps Telegram user IDs to Order System users
 */

export const USER_MAPPING = {
  // Add your Telegram users here
  // Format: 'telegram_user_id': { userId, name, email }
  // You can get your Telegram user ID by messaging the bot and checking the logs
  
  // Example (replace with your actual Telegram user ID):
  // '123456789': {
  //   userId: 1,
  //   name: 'Admin User',
  //   email: 'admin@test.com'
  // },
  
  // Example: Add more users
  // '987654321': {
  //   userId: 2,
  //   name: 'John Handler',
  //   email: 'john@test.com'
  // },
};

/**
 * Admin users who can create orders, expenses, and transfers via bot
 * Other users can only query/view data
 */
export const ADMIN_USERS = [
  // Add admin Telegram user IDs here (as strings)
  // Example: '123456789',
];

/**
 * Get Order System user info from Telegram user ID
 */
export function getOrderSystemUser(telegramUserId) {
  // Convert to string if number
  const userId = String(telegramUserId);
  const user = USER_MAPPING[userId];
  
  if (!user) {
    console.warn(`⚠️  No mapping found for Telegram user: ${userId}`);
    return null;
  }
  
  return user;
}

/**
 * Check if Telegram user is registered
 */
export function isUserRegistered(telegramUserId) {
  const userId = String(telegramUserId);
  return userId in USER_MAPPING;
}

/**
 * Get all registered Telegram users
 */
export function getAllRegisteredUsers() {
  return Object.keys(USER_MAPPING);
}

/**
 * Check if Telegram user is an admin (can create orders/expenses/transfers)
 */
export function isAdmin(telegramUserId) {
  const userId = String(telegramUserId);
  return ADMIN_USERS.includes(userId);
}

/**
 * Get non-admin message for create operations
 */
export function getNonAdminMessage(action) {
  const actionMessages = {
    'create_order': 'create orders',
    'create_expense': 'add expenses',
    'create_transfer': 'create transfers'
  };
  
  const actionText = actionMessages[action] || 'perform this action';
  
  return `🔒 I'm sorry, but I can only help you view and query data right now.\n\nTo ${actionText}, please use the web system at your convenience.\n\nI can still help you:\n• Check order status\n• List recent orders\n• View expenses\n• Check transfers\n\nWhat would you like to know?`;
}
