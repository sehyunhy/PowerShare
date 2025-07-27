// Mock current user ID for development
// In a real application, this would come from authentication context
export const CURRENT_USER_ID = 1;

// Energy types
export const ENERGY_TYPES = {
  SOLAR: 'solar',
  WIND: 'wind',
  BATTERY: 'battery',
} as const;

// Request urgency levels
export const URGENCY_LEVELS = {
  IMMEDIATE: 'immediate',
  URGENT: 'urgent',
  NORMAL: 'normal',
  SCHEDULED: 'scheduled',
} as const;

// Transaction statuses
export const TRANSACTION_STATUSES = {
  PENDING: 'pending',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

// Request statuses
export const REQUEST_STATUSES = {
  PENDING: 'pending',
  MATCHED: 'matched',
  FULFILLED: 'fulfilled',
  CANCELLED: 'cancelled',
} as const;

// Default energy pricing
export const DEFAULT_ENERGY_PRICE = 0.15; // KRW per kWh

// WebSocket message types
export const WS_MESSAGE_TYPES = {
  AUTH: 'auth',
  ENERGY_UPDATE: 'energy_data_update',
  NEW_REQUEST: 'new_request',
  MATCH_FOUND: 'match_found',
  PROVIDER_ADDED: 'provider_added',
} as const;
