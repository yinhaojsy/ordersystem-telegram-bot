import { orderSystemApi } from '../services/orderSystemApi.js';
import { conversationState } from '../services/conversationState.js';

export async function handleTransferCommand(aiResponse, sender, roomId) {
  const { action, data, message } = aiResponse;
  
  try {
    switch (action) {
      case 'create_transfer':
        return await createTransfer(data, roomId, message);
      
      case 'get_transfer':
        return await getTransferDetails(data.transfer_id);
      
      case 'list_transfers':
        return await listTransfers(data);
      
      default:
        return message || '❌ Unknown transfer action';
    }
  } catch (error) {
    console.error('Transfer handler error:', error);
    return `❌ Oops! Something went wrong: ${error.message}`;
  }
}

async function createTransfer(transferData, roomId, conversationalMessage) {
  if (!transferData.amount) {
    return conversationalMessage || "How much would you like to transfer?";
  }
  
  if (!transferData.fromAccountName && !transferData.fromAccountId) {
    return conversationalMessage || "Which account should I transfer from?";
  }
  
  if (!transferData.toAccountName && !transferData.toAccountId) {
    return conversationalMessage || "Which account should I transfer to?";
  }
  
  try {
    const transfer = await orderSystemApi.createTransfer(transferData);
    
    conversationState.clearCurrentAction(roomId);
    
    return `✅ **Perfect! Transfer Created Successfully!**

📝 Transfer ID: #${transfer.id}
💰 Amount: ${transfer.amount} ${transfer.currencyCode || 'USD'}
📤 From: ${transfer.fromAccountName || 'Account #' + transfer.fromAccountId}
📥 To: ${transfer.toAccountName || 'Account #' + transfer.toAccountId}
${transfer.description ? `📄 Note: ${transfer.description}` : ''}
📅 Date: ${new Date(transfer.createdAt).toLocaleString()}

Is there anything else you need?`;
  } catch (error) {
    conversationState.clearCurrentAction(roomId);
    throw error;
  }
}

async function getTransferDetails(transferId) {
  if (!transferId) {
    return '❌ Please provide a transfer ID (e.g., "status of transfer #67").';
  }
  
  const id = typeof transferId === 'string' ? parseInt(transferId, 10) : transferId;
  if (isNaN(id)) return '❌ Invalid transfer ID.';
  
  const transfer = await orderSystemApi.getTransfer(id);
  
  return `📋 **Transfer #${transfer.id} Details**

💰 Amount: ${transfer.amount} ${transfer.currencyCode || 'USD'}
📤 From: ${transfer.fromAccountName || 'Account #' + transfer.fromAccountId}
📥 To: ${transfer.toAccountName || 'Account #' + transfer.toAccountId}
${transfer.description ? `📄 Description: ${transfer.description}` : ''}
📅 Created: ${new Date(transfer.createdAt).toLocaleString()}
${transfer.createdByName ? `👤 Created by: ${transfer.createdByName}` : ''}`;
}

async function listTransfers(filters = {}) {
  const transfers = await orderSystemApi.listTransfers(100, filters);
  
  if (!transfers || transfers.length === 0) {
    return '📋 No transfers found.';
  }
  
  const totalTransfers = transfers.length;
  const displayLimit = 20;
  const transfersToShow = transfers.slice(0, displayLimit);
  const remainingCount = totalTransfers - displayLimit;
  
  let response = `📋 **Transfers** (${totalTransfers} found)\n\n`;
  
  transfersToShow.forEach(transfer => {
    // Format date
    const date = new Date(transfer.createdAt);
    const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
    
    const from = transfer.fromAccountName || `Account #${transfer.fromAccountId}`;
    const to = transfer.toAccountName || `Account #${transfer.toAccountId}`;
    const creator = transfer.createdByName ? ` | ✍️${transfer.createdByName}` : '';
    const description = transfer.description ? ` | 📄${transfer.description}` : '';
    
    response += `#${transfer.id} ${dateStr}: ${from} → ${to} | ${transfer.amount} ${transfer.currencyCode || 'USD'}${creator}${description}\n`;
  });
  
  if (remainingCount > 0) {
    response += `\n... and ${remainingCount} more transfers.\n`;
    response += `💡 Tip: Use filters to narrow results`;
  }
  
  return response;
}