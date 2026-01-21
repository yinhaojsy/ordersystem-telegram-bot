import axios from 'axios';

// Verify environment variables
if (!process.env.ORDER_SYSTEM_API_URL) {
  console.error('❌ Missing ORDER_SYSTEM_API_URL in .env file');
}
if (!process.env.ORDER_SYSTEM_API_KEY) {
  console.error('❌ Missing ORDER_SYSTEM_API_KEY in .env file');
}

console.log('🔧 API Configuration:', {
  baseURL: process.env.ORDER_SYSTEM_API_URL,
  hasApiKey: !!process.env.ORDER_SYSTEM_API_KEY
});

const api = axios.create({
  baseURL: process.env.ORDER_SYSTEM_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Bot-API-Key': process.env.ORDER_SYSTEM_API_KEY
  },
  timeout: 30000
});

// Error handler
const handleApiError = (error, operation) => {
  if (error.response) {
    // Server responded with error status
    console.error(`❌ API Error (${operation}):`, {
      status: error.response.status,
      statusText: error.response.statusText,
      data: error.response.data,
      url: error.config?.url
    });
    throw new Error(error.response.data.error || `Failed to ${operation}`);
  } else if (error.request) {
    // Request made but no response received
    console.error(`❌ Network Error (${operation}):`, {
      message: error.message,
      url: error.config?.url,
      baseURL: error.config?.baseURL
    });
    throw new Error(`Network error: Cannot reach order system at ${error.config?.baseURL}`);
  } else {
    // Something else happened
    console.error(`❌ Error (${operation}):`, error.message);
    throw new Error(error.message);
  }
};

export const orderSystemApi = {
  // Orders
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/api/bot/orders', orderData);
      return response.data;
    } catch (error) {
      handleApiError(error, 'create order');
    }
  },
  
  getOrder: async (orderId) => {
    try {
      const response = await api.get(`/api/bot/orders/${orderId}`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'get order');
    }
  },
  
  listOrders: async (limit = 100, filters = {}) => {
    try {
      let url = `/api/bot/orders?limit=${limit}`;
      console.log('🔍 Requesting:', api.defaults.baseURL + url);
      
      // Add all filter parameters
      if (filters.status) url += `&status=${encodeURIComponent(filters.status)}`;
      if (filters.tags) url += `&tags=${encodeURIComponent(filters.tags)}`;
      if (filters.handler) url += `&handler=${encodeURIComponent(filters.handler)}`;
      if (filters.customer) url += `&customer=${encodeURIComponent(filters.customer)}`;
      if (filters.createdBy) url += `&createdBy=${encodeURIComponent(filters.createdBy)}`;
      if (filters.dateRange) url += `&dateRange=${encodeURIComponent(filters.dateRange)}`;
      if (filters.currencyPair) url += `&currencyPair=${encodeURIComponent(filters.currencyPair)}`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      handleApiError(error, 'list orders');
    }
  },
  
  completeOrder: async (orderId) => {
    try {
      const response = await api.patch(`/api/bot/orders/${orderId}/complete`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'complete order');
    }
  },
  
  // Expenses
  createExpense: async (expenseData) => {
    try {
      const response = await api.post('/api/bot/expenses', expenseData);
      return response.data;
    } catch (error) {
      handleApiError(error, 'create expense');
    }
  },
  
  getExpense: async (expenseId) => {
    try {
      const response = await api.get(`/api/bot/expenses/${expenseId}`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'get expense');
    }
  },
  
  listExpenses: async (limit = 100, filters = {}) => {
    try {
      let url = `/api/bot/expenses?limit=${limit}`;
      
      // Add filter parameters (if supported by API in future)
      if (filters.dateRange) url += `&dateRange=${encodeURIComponent(filters.dateRange)}`;
      if (filters.createdBy) url += `&createdBy=${encodeURIComponent(filters.createdBy)}`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      handleApiError(error, 'list expenses');
    }
  },
  
  // Transfers
  createTransfer: async (transferData) => {
    try {
      const response = await api.post('/api/bot/transfers', transferData);
      return response.data;
    } catch (error) {
      handleApiError(error, 'create transfer');
    }
  },
  
  getTransfer: async (transferId) => {
    try {
      const response = await api.get(`/api/bot/transfers/${transferId}`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'get transfer');
    }
  },
  
  listTransfers: async (limit = 100, filters = {}) => {
    try {
      let url = `/api/bot/transfers?limit=${limit}`;
      
      // Add filter parameters (if supported by API in future)
      if (filters.dateRange) url += `&dateRange=${encodeURIComponent(filters.dateRange)}`;
      if (filters.createdBy) url += `&createdBy=${encodeURIComponent(filters.createdBy)}`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      handleApiError(error, 'list transfers');
    }
  }
};