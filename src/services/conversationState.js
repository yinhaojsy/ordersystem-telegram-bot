/**
 * Conversation State Manager
 * Tracks ongoing conversations and context for each user/room
 */

class ConversationState {
  constructor() {
    // Store conversations per room
    this.conversations = new Map();
  }

  /**
   * Get or create conversation for a room
   */
  getConversation(roomId) {
    if (!this.conversations.has(roomId)) {
      this.conversations.set(roomId, {
        history: [],
        currentAction: null,
        collectedData: {},
        lastActivity: Date.now()
      });
    }
    return this.conversations.get(roomId);
  }

  /**
   * Add message to conversation history
   */
  addMessage(roomId, role, content) {
    const conv = this.getConversation(roomId);
    conv.history.push({ role, content, timestamp: Date.now() });
    conv.lastActivity = Date.now();
    
    // Keep last 6 messages for context (3 exchanges) - optimized for speed
    if (conv.history.length > 6) {
      conv.history = conv.history.slice(-6);
    }
  }

  /**
   * Set current action being processed
   */
  setCurrentAction(roomId, action, data = {}) {
    const conv = this.getConversation(roomId);
    conv.currentAction = action;
    conv.collectedData = { ...conv.collectedData, ...data };
    conv.lastActivity = Date.now();
  }

  /**
   * Update collected data for current action
   */
  updateCollectedData(roomId, data) {
    const conv = this.getConversation(roomId);
    conv.collectedData = { ...conv.collectedData, ...data };
    conv.lastActivity = Date.now();
  }

  /**
   * Get current action
   */
  getCurrentAction(roomId) {
    const conv = this.getConversation(roomId);
    return conv.currentAction;
  }

  /**
   * Get collected data
   */
  getCollectedData(roomId) {
    const conv = this.getConversation(roomId);
    return conv.collectedData;
  }

  /**
   * Clear current action and collected data
   */
  clearCurrentAction(roomId) {
    const conv = this.getConversation(roomId);
    conv.currentAction = null;
    conv.collectedData = {};
  }

  /**
   * Get conversation history as messages array for AI
   */
  getHistoryForAI(roomId, limit = 4) {
    const conv = this.getConversation(roomId);
    return conv.history.slice(-limit);
  }

  /**
   * Check if room has active conversation
   */
  hasActiveConversation(roomId) {
    if (!this.conversations.has(roomId)) return false;
    const conv = this.conversations.get(roomId);
    return conv.currentAction !== null;
  }

  /**
   * Clean up old conversations (older than 30 minutes)
   */
  cleanup() {
    const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000);
    for (const [roomId, conv] of this.conversations.entries()) {
      if (conv.lastActivity < thirtyMinutesAgo) {
        this.conversations.delete(roomId);
        console.log(`🧹 Cleaned up old conversation for room ${roomId}`);
      }
    }
  }
}

// Singleton instance
export const conversationState = new ConversationState();

// Cleanup old conversations every 10 minutes
setInterval(() => conversationState.cleanup(), 10 * 60 * 1000);
