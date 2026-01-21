import { orderSystemApi } from '../services/orderSystemApi.js';
import { conversationState } from '../services/conversationState.js';
import { parseCurrencyPair, calculateAmounts, formatCurrencyPair } from '../services/currencyKnowledge.js';
import { getOrderSystemUser } from '../config/userMapping.js';

export async function handleOrderCommand(aiResponse, sender, roomId) {
  const { action, data, message } = aiResponse;
  
  try {
    switch (action) {
      case 'create_order':
        return await createOrder(data, roomId, message, sender);
      
      case 'get_order':
        return await getOrderStatus(data.order_id);
      
      case 'complete_order':
        return await completeOrder(data.order_id);
      
      case 'list_orders':
        return await listOrders(data);
      
      default:
        return message || '❌ Unknown order action';
    }
  } catch (error) {
    console.error('Order handler error:', error);
    return `❌ Oops! Something went wrong: ${error.message}`;
  }
}

async function createOrder(orderData, roomId, conversationalMessage, sender) {
  // Parse currency pair if needed
  if (!orderData.fromCurrency && !orderData.toCurrency && orderData.currencyPair) {
    const parsed = parseCurrencyPair(orderData.currencyPair);
    if (parsed) {
      orderData.fromCurrency = parsed.fromCurrency;
      orderData.toCurrency = parsed.toCurrency;
    }
  }
  
  // Check if we have enough data
  const requiredFields = ['customerName', 'fromCurrency', 'toCurrency', 'rate'];
  const missingFields = requiredFields.filter(field => !orderData[field]);
  
  if (missingFields.length > 0) {
    // Return the conversational message from AI asking for missing info
    return conversationalMessage || `I still need: ${missingFields.join(', ')}`;
  }
  
  // Check if we have at least one amount
  if (!orderData.amountBuy && !orderData.amountSell) {
    return conversationalMessage || "How much is the customer buying? (Or tell me how much they're selling)";
  }
  
  // Check for accounts (NEW)
  if (!orderData.buyAccount) {
    return conversationalMessage || `Which account will receive the ${orderData.fromCurrency}? (e.g., Main Wallet, HSBC Account)`;
  }
  
  if (!orderData.sellAccount) {
    return conversationalMessage || `Which account will pay the ${orderData.toCurrency}? (e.g., Cash, Binance)`;
  }
  
  // Use smart calculation to fill in missing amount
  const calculatedData = calculateAmounts(orderData);
  
  // Default order type to online if not specified
  if (!calculatedData.orderType) {
    calculatedData.orderType = 'online';
  }
  
  // Show confirmation with calculated values
  if (!calculatedData.amountBuy || !calculatedData.amountSell) {
    return "⚠️ I couldn't calculate the amounts. Please provide both buy and sell amounts, or check the rate.";
  }
  
  // Get handler info from Telegram user mapping
  const systemUser = getOrderSystemUser(sender);
  if (systemUser) {
    calculatedData.handlerId = systemUser.userId;
    console.log(`✅ Assigned handler: ${systemUser.name} (ID: ${systemUser.userId})`);
  } else {
    console.warn(`⚠️  No user mapping found for ${sender}, creating without handler`);
  }
  
  try {
    // Create the order with handler and accounts
    const order = await orderSystemApi.createOrder(calculatedData);
    
    // Clear conversation state since we're done
    conversationState.clearCurrentAction(roomId);
    
    const pair = formatCurrencyPair(order.fromCurrency, order.toCurrency);
    
    return `✅ Perfect! Order Created Successfully!

📝 Order ID: #${order.id}
👤 Customer: ${order.customerName}
💱 Pair: ${pair}
📊 Rate: ${order.rate}
💵 Buy: ${order.amountBuy} ${order.fromCurrency} → ${calculatedData.buyAccount}
💸 Sell: ${order.amountSell} ${order.toCurrency} → ${calculatedData.sellAccount}
📦 Type: ${order.orderType}
👨‍💼 Handler: ${systemUser ? systemUser.name : 'Unassigned'}
📅 Created: ${new Date(order.createdAt).toLocaleString()}
✅ Status: ${order.status}

Is there anything else I can help you with?`;
  } catch (error) {
    conversationState.clearCurrentAction(roomId);
    throw error;
  }
}

async function getOrderStatus(orderId) {
  if (!orderId) {
    return '❌ Please provide an order ID (e.g., "status of order #123").';
  }
  
  // Convert to number if string
  const id = typeof orderId === 'string' ? parseInt(orderId, 10) : orderId;
  
  if (isNaN(id)) {
    return '❌ Invalid order ID. Please provide a valid number.';
  }
  
  const order = await orderSystemApi.getOrder(id);
  
  return `📋 Order #${order.id} Details

👤 Customer: ${order.customerName || 'N/A'}
💱 Exchange: ${order.amountBuy} ${order.fromCurrency} → ${order.amountSell} ${order.toCurrency}
📊 Rate: ${order.rate}
📦 Type: ${order.orderType || 'online'}
✅ Status: ${order.status}
📅 Created: ${new Date(order.createdAt).toLocaleString()}
${order.handlerName ? `👨‍💼 Handler: ${order.handlerName}` : ''}`;
}

async function completeOrder(orderId) {
  if (!orderId) {
    return '❌ Please provide an order ID (e.g., "complete order #123").';
  }
  
  // Convert to number if string
  const id = typeof orderId === 'string' ? parseInt(orderId, 10) : orderId;
  
  if (isNaN(id)) {
    return '❌ Invalid order ID. Please provide a valid number.';
  }
  
  const order = await orderSystemApi.completeOrder(id);
  
  return `✅ Order #${order.id} Completed!

Order has been marked as complete.
💱 ${order.amountBuy} ${order.fromCurrency} → ${order.amountSell} ${order.toCurrency}`;
}

async function listOrders(filters = {}) {
  const orders = await orderSystemApi.listOrders(100, filters);
  
  if (!orders || orders.length === 0) {
    const filterDesc = buildFilterDescription(filters);
    return `📋 No orders found${filterDesc}.`;
  }
  
  const filterDesc = buildFilterDescription(filters);
  const totalOrders = orders.length;
  const displayLimit = 20; //我 设置一次报多少条订单
  const ordersToShow = orders.slice(0, displayLimit);
  const remainingCount = totalOrders - displayLimit;
  
  let response = `📋 Orders${filterDesc} (${totalOrders} found)\n\n`;
  
  ordersToShow.forEach(order => {
    const customerName = order.customerName || 'Unknown';
    const handler = order.handlerName ? ` | 👤${order.handlerName}` : '';
    const creator = order.createdByName ? ` | ✍️${order.createdByName}` : '';
    const tags = order.tags ? ` | 🏷️${order.tags}` : '';
    
    // Format date
    const date = new Date(order.createdAt);
    const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
    
    // Format rate
    const rate = order.rate ? `@${order.rate}` : '';
    
    response += `#${order.id} ${dateStr}: ${order.amountBuy} ${order.fromCurrency} → ${order.amountSell} ${order.toCurrency} ${rate} | ${order.status} | 👥${customerName}${handler}${creator}${tags}\n`;
  });
  
  if (remainingCount > 0) {
    response += `\n... and ${remainingCount} more orders.\n`;
    response += `💡 Tip: Use filters to narrow results (status, customer, handler, date, tags, currency pair)`;
  }
  
  return response;
}

function buildFilterDescription(filters) {
  const parts = [];
  
  if (filters.status) parts.push(`status: ${filters.status}`);
  if (filters.tags) parts.push(`tags: ${filters.tags}`);
  if (filters.handler) parts.push(`handler: ${filters.handler}`);
  if (filters.customer) parts.push(`customer: ${filters.customer}`);
  if (filters.createdBy) parts.push(`created by: ${filters.createdBy}`);
  if (filters.dateRange) {
    const dateLabels = {
      'today': 'today',
      'last_week': 'last week',
      'this_week': 'this week',
      'current_month': 'current month',
      'last_month': 'last month'
    };
    parts.push(dateLabels[filters.dateRange] || filters.dateRange);
  }
  if (filters.currencyPair) parts.push(`pair: ${filters.currencyPair}`);
  
  return parts.length > 0 ? ` (${parts.join(', ')})` : '';
}