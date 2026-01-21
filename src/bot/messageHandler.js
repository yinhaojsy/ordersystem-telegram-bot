import { processWithAI } from '../services/aiService.js';
import { conversationState } from '../services/conversationState.js';
import { handleOrderCommand } from '../handlers/orderHandler.js';
import { handleExpenseCommand } from '../handlers/expenseHandler.js';
import { handleTransferCommand } from '../handlers/transferHandler.js';
import { isAdmin, getNonAdminMessage } from '../config/userMapping.js';

export async function handleMessage(message, sender, roomId, event) {
  // Add user message to conversation history
  conversationState.addMessage(roomId, 'user', message);
  
  // Check for help command
  if (message.toLowerCase().trim() === 'help' || message.toLowerCase().trim() === '!help') {
    const helpMsg = getHelpMessage(isAdmin(sender));
    conversationState.addMessage(roomId, 'assistant', helpMsg);
    return helpMsg;
  }
  
  // Check for cancel/reset commands
  if (['cancel', 'reset', 'start over', 'clear'].includes(message.toLowerCase().trim())) {
    conversationState.clearCurrentAction(roomId);
    const msg = "Okay, I've cleared everything. What would you like to do?";
    conversationState.addMessage(roomId, 'assistant', msg);
    return msg;
  }
  
  // Get conversation context
  const currentAction = conversationState.getCurrentAction(roomId);
  const collectedData = conversationState.getCollectedData(roomId);
  const history = conversationState.getHistoryForAI(roomId);
  
  // Define create actions and check admin status once
  const createActions = ['create_order', 'create_expense', 'create_transfer'];
  const userIsAdmin = isAdmin(sender);
  
  // Check if non-admin user has a create action in progress - block it
  if (currentAction && createActions.includes(currentAction) && !userIsAdmin) {
    conversationState.clearCurrentAction(roomId);
    const msg = getNonAdminMessage(currentAction);
    conversationState.addMessage(roomId, 'assistant', msg);
    return msg;
  }
  
  // Use AI to understand the intent with full context
  const aiResponse = await processWithAI(
    message,
    history,
    currentAction,
    collectedData
  );
  
  console.log('🤖 AI parsed:', JSON.stringify(aiResponse, null, 2));
  
  // If AI is asking a question, update state and return message
  if (aiResponse.action === 'ask_question') {
    // Detect create intent from AI message if no data collected yet
    let actionType = currentAction;
    
    if (!actionType && aiResponse.message) {
      const lowerMsg = aiResponse.message.toLowerCase();
      if (lowerMsg.includes('help you create an order') || lowerMsg.includes('create order')) {
        actionType = 'create_order';
      } else if (lowerMsg.includes('create an expense') || lowerMsg.includes('add expense')) {
        actionType = 'create_expense';
      } else if (lowerMsg.includes('create a transfer') || lowerMsg.includes('transfer')) {
        actionType = 'create_transfer';
      }
    }
    
    // Update collected data if any new data was extracted
    if (aiResponse.data && Object.keys(aiResponse.data).length > 0) {
      actionType = actionType || guessActionFromData(aiResponse.data);
    }
    
    // Check if this is a create action and user is not admin
    if (actionType && createActions.includes(actionType) && !userIsAdmin) {
      // Non-admin trying to create - block immediately with friendly message
      conversationState.clearCurrentAction(roomId);
      const msg = getNonAdminMessage(actionType);
      conversationState.addMessage(roomId, 'assistant', msg);
      return msg;
    }
    
    // Store action type if we have one
    if (actionType && aiResponse.data && Object.keys(aiResponse.data).length > 0) {
      conversationState.setCurrentAction(roomId, actionType, aiResponse.data);
    }
    
    const msg = aiResponse.message || "Could you provide more details?";
    conversationState.addMessage(roomId, 'assistant', msg);
    return msg;
  }
  
  // Check if action requires admin privileges
  let response;
  
  if (createActions.includes(aiResponse.action) && !userIsAdmin) {
    // Non-admin trying to create - provide friendly rejection
    response = getNonAdminMessage(aiResponse.action);
    conversationState.clearCurrentAction(roomId);
  } else {
    // Route to appropriate handler based on action
    switch (aiResponse.action) {
      case 'create_order':
      case 'get_order':
      case 'complete_order':
      case 'list_orders':
        response = await handleOrderCommand(aiResponse, sender, roomId);
        break;
      
      case 'create_expense':
      case 'get_expense':
      case 'list_expenses':
        response = await handleExpenseCommand(aiResponse, sender, roomId);
        break;
      
      case 'create_transfer':
      case 'get_transfer':
      case 'list_transfers':
        response = await handleTransferCommand(aiResponse, sender, roomId);
        break;
      
      case 'help':
        response = getHelpMessage(userIsAdmin);
        break;
      
      default:
        response = aiResponse.message || "I'm not sure what you want to do. I can help you check orders, view expenses, or review transfers. What would you like to know?";
        break;
    }
  }
  
  // Add bot response to history
  conversationState.addMessage(roomId, 'assistant', response);
  
  return response;
}

/**
 * Guess action type from collected data
 */
function guessActionFromData(data) {
  if (data.fromCurrency || data.toCurrency || data.rate) {
    return 'create_order';
  }
  if (data.description && data.amount && !data.fromAccountName) {
    return 'create_expense';
  }
  if (data.fromAccountName || data.toAccountName) {
    return 'create_transfer';
  }
  return null;
}

function getHelpMessage(isAdminUser = false) {
  const adminCommands = isAdminUser ? `

**🔧 Admin Commands (Testing):**
• Create order: "Create order for John, buy 500 USDT sell 520 USD, rate 1.04"
• Add expense: "Add expense: Office supplies, $50 from Account Main"
• Create transfer: "Transfer $1000 from Account A to Account B"
• Complete order: "Complete order #123"
` : '';

  return `📋 **Order System Bot - Available Commands**

**📦 Orders:**
• Check status: "What's the status of order #123?"
• List recent orders: "Show me recent orders"
• Search orders: "Show orders for customer John"

**💰 Expenses:**
• Check expense: "Show expense #45"
• List expenses: "Show recent expenses"

**🔄 Transfers:**
• Check transfer: "Status of transfer #67"
• List transfers: "Show recent transfers"${adminCommands}

**💡 Tips:**
• Just type naturally, I'll understand!
• Type 'help' anytime to see this message
• To create orders/expenses/transfers, please use the web system

🤖 Powered by AI - I learn from your messages!
`;
}