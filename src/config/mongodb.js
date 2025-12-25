// src/config/mongodb.js
// MongoDB integration for global deployment

/**
 * MongoDB Configuration and Connection Manager
 * 
 * This module provides MongoDB connection and sync capabilities
 * Currently uses localStorage as primary storage with MongoDB sync option
 */

// MongoDB connection configuration
const MONGODB_CONFIG = {
    uri: process.env.MONGODB_URI || process.env.REACT_APP_MONGODB_URI || '',
    dbName: process.env.MONGODB_DB_NAME || 'mars_education',
    enabled: false // Set to true when MongoDB is configured
};

// Check if MongoDB is configured
export const isMongoDBConfigured = () => {
    return Boolean(MONGODB_CONFIG.uri && MONGODB_CONFIG.enabled);
};

// MongoDB Collections
export const COLLECTIONS = {
    STUDENTS: 'students',
    TEACHERS: 'teachers',
    PARENTS: 'parents',
    GROUPS: 'groups',
    HOMEWORKS: 'homeworks',
    SUBMISSIONS: 'submissions',
    SHOP_ITEMS: 'shopItems',
    SHOP_ORDERS: 'shopOrders',
    NOTIFICATIONS: 'notifications',
    ANNOUNCEMENTS: 'announcements',
    ABSENCE_REPORTS: 'absenceReports',
    PARENT_ACTIVITY: 'parentActivity',
    TEACHER_REPLACEMENTS: 'teacherReplacements',
    HOMEWORK_DEADLINES: 'homeworkDeadlines'
};

/**
 * Sync localStorage data to MongoDB
 * This function can be called periodically or on specific events
 */
export const syncToMongoDB = async (collection, data) => {
    if (!isMongoDBConfigured()) {
        console.log('MongoDB not configured, using localStorage only');
        return { success: false, reason: 'not_configured' };
    }

    try {
        // This would be implemented when backend API is ready
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/sync/${collection}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const result = await response.json();
            return { success: true, data: result };
        }

        return { success: false, reason: 'api_error' };
    } catch (error) {
        console.error('MongoDB sync error:', error);
        return { success: false, reason: 'network_error', error };
    }
};

/**
 * Sync from MongoDB to localStorage
 * Useful for loading data when user logs in
 */
export const syncFromMongoDB = async (collection) => {
    if (!isMongoDBConfigured()) {
        return { success: false, reason: 'not_configured' };
    }

    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/sync/${collection}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            return { success: true, data };
        }

        return { success: false, reason: 'api_error' };
    } catch (error) {
        console.error('MongoDB fetch error:', error);
        return { success: false, reason: 'network_error', error };
    }
};

/**
 * Auto-sync manager
 * Syncs data at regular intervals
 */
class AutoSyncManager {
    constructor() {
        this.syncInterval = null;
        this.syncDelay = 5 * 60 * 1000; // 5 minutes
    }

    start() {
        if (!isMongoDBConfigured()) {
            console.log('Auto-sync disabled: MongoDB not configured');
            return;
        }

        console.log('Starting auto-sync...');

        this.syncInterval = setInterval(() => {
            this.syncAll();
        }, this.syncDelay);
    }

    stop() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
            console.log('Auto-sync stopped');
        }
    }

    async syncAll() {
        const collections = Object.values(COLLECTIONS);

        for (const collection of collections) {
            const localData = localStorage.getItem(`mars-${collection}`);

            if (localData) {
                try {
                    const data = JSON.parse(localData);
                    await syncToMongoDB(collection, data);
                } catch (e) {
                    console.error(`Error syncing ${collection}:`, e);
                }
            }
        }
    }
}

export const autoSyncManager = new AutoSyncManager();

/**
 * Initialize MongoDB connection and sync
 * Call this on app startup
 */
export const initializeMongoDB = async () => {
    if (!isMongoDBConfigured()) {
        console.log('MongoDB is not configured. Using localStorage only.');
        console.log('To enable MongoDB, set REACT_APP_MONGODB_URI in .env file');
        return { success: false, mode: 'localStorage' };
    }

    try {
        // Test connection
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/health`, {
            method: 'GET'
        });

        if (response.ok) {
            console.log('MongoDB connection successful');
            autoSyncManager.start();
            return { success: true, mode: 'mongoDB' };
        }

        console.warn('MongoDB connection failed, falling back to localStorage');
        return { success: false, mode: 'localStorage' };
    } catch (error) {
        console.error('MongoDB initialization error:', error);
        return { success: false, mode: 'localStorage', error };
    }
};

/**
 * Hybrid storage: Try MongoDB first, fallback to localStorage
 */
export const hybridGet = async (collection, fallbackData = null) => {
    if (isMongoDBConfigured()) {
        const result = await syncFromMongoDB(collection);
        if (result.success) {
            return result.data;
        }
    }

    // Fallback to localStorage
    const localData = localStorage.getItem(`mars-${collection}`);
    return localData ? JSON.parse(localData) : fallbackData;
};

export const hybridSet = async (collection, data) => {
    // Always save to localStorage first (immediate)
    localStorage.setItem(`mars-${collection}`, JSON.stringify(data));

    // Then sync to MongoDB if available (async)
    if (isMongoDBConfigured()) {
        syncToMongoDB(collection, data).catch(err => {
            console.error('Background MongoDB sync failed:', err);
        });
    }
};

// Export configuration
export default MONGODB_CONFIG;
