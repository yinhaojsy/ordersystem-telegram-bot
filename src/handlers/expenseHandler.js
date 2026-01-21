import { orderSystemApi } from '../services/orderSystemApi.js';
import { conversationState } from '../services/conversationState.js';

export async function handleExpenseCommand(aiResponse, sender, roomId) {
  const { action, data, message } = aiResponse;
  
  try {
    switch (action) {
      case 'create_expense':
        return await createExpense(data, roomId, message);
      
      case 'get_expense':
        return await getExpenseDetails(data.expense_id);
      
      case 'list_expenses':
        return await listExpenses(data);
      
      default:
        return message || '❌ Unknown expense action';
    }
  } catch (error) {
    console.error('Expense handler error:', error);
    return `❌ Oops! Something went wrong: ${error.message}`;
  }
}

async function createExpense(expenseData, roomId, conversationalMessage) {
  const requiredFields = ['amount', 'description'];
  const missingFields = requiredFields.filter(field => !expenseData[field]);
  
  if (missingFields.length > 0) {
    return conversationalMessage || `I still need: ${missingFields.join(', ')}`;
  }
  
  try {
    const expense = await orderSystemApi.createExpense(expenseData);
    
    // Clear conversation state
    conversationState.clearCurrentAction(roomId);
    
    return `✅ **Great! Expense Recorded Successfully!**

📝 Expense ID: #${expense.id}
💰 Amount: ${expense.amount} ${expense.currencyCode || 'USD'}
📄 Description: ${expense.description}
🏦 Account: ${expense.accountName || 'Default'}
📅 Date: ${new Date(expense.createdAt).toLocaleString()}

Anything else I can help with?`;
  } catch (error) {
    conversationState.clearCurrentAction(roomId);
    throw error;
  }
}

async function getExpenseDetails(expenseId) {
  if (!expenseId) {
    return '❌ Please provide an expense ID (e.g., "show expense #45").';
  }
  
  const id = typeof expenseId === 'string' ? parseInt(expenseId, 10) : expenseId;
  if (isNaN(id)) return '❌ Invalid expense ID.';
  
  const expense = await orderSystemApi.getExpense(id);
  
  return `📋 **Expense #${expense.id} Details**

💰 Amount: ${expense.amount} ${expense.currencyCode || 'USD'}
📄 Description: ${expense.description}
🏦 Account: ${expense.accountName || 'N/A'}
📅 Created: ${new Date(expense.createdAt).toLocaleString()}
${expense.createdByName ? `👤 Created by: ${expense.createdByName}` : ''}`;
}

async function listExpenses(filters = {}) {
  const expenses = await orderSystemApi.listExpenses(100, filters);
  
  if (!expenses || expenses.length === 0) {
    return '📋 No expenses found.';
  }
  
  const totalExpenses = expenses.length;
  const displayLimit = 20;
  const expensesToShow = expenses.slice(0, displayLimit);
  const remainingCount = totalExpenses - displayLimit;
  
  let response = `📋 **Expenses** (${totalExpenses} found)\n\n`;
  
  expensesToShow.forEach(expense => {
    // Format date
    const date = new Date(expense.createdAt);
    const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
    
    const account = expense.accountName ? ` | 🏦${expense.accountName}` : '';
    const creator = expense.createdByName ? ` | ✍️${expense.createdByName}` : '';
    
    response += `#${expense.id} ${dateStr}: ${expense.description} - ${expense.amount} ${expense.currencyCode || 'USD'}${account}${creator}\n`;
  });
  
  if (remainingCount > 0) {
    response += `\n... and ${remainingCount} more expenses.\n`;
    response += `💡 Tip: Use filters to narrow results`;
  }
  
  return response;
}