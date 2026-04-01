import DB_CONFIG from './config.js';

const db = {
    async execute(query, bindings = []) {
        try {
            const response = await fetch(DB_CONFIG.API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': DB_CONFIG.API_KEY,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ query, bindings })
            });
            const data = await response.json();
            if (!response.ok) {
                console.error('DB Error:', data);
                throw new Error(data.message || 'Database execution failed');
            }
            return data;
        } catch (error) {
            console.error('Fetch Error:', error);
            throw error;
        }
    },

    async initDB() {
        console.log('Initializing Database...');
        // Users table
        await this.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                firstName TEXT,
                lastName TEXT,
                username TEXT,
                photoUrl TEXT,
                balance REAL DEFAULT 0,
                referrals INTEGER DEFAULT 0,
                referredBy TEXT,
                totalEarned REAL DEFAULT 0,
                lifetimeAdCount INTEGER DEFAULT 0,
                lastAdWatchDate TEXT,
                dailyAdCount INTEGER DEFAULT 0,
                breakUntil INTEGER DEFAULT 0,
                welcomed INTEGER DEFAULT 0
            )
        `);

        // Config table (key-value store for app settings)
        await this.execute(`
            CREATE TABLE IF NOT EXISTS admin_config (
                key TEXT PRIMARY KEY,
                value TEXT
            )
        `);

        // Withdrawals table
        await this.execute(`
            CREATE TABLE IF NOT EXISTS withdrawals (
                id TEXT PRIMARY KEY,
                userId TEXT,
                userName TEXT,
                method TEXT,
                account TEXT,
                amount REAL,
                status TEXT, -- pending, completed, rejected
                timestamp INTEGER
            )
        `);

        // Daily Earnings table
        await this.execute(`
            CREATE TABLE IF NOT EXISTS user_earnings (
                userId TEXT,
                date TEXT,
                amount REAL,
                PRIMARY KEY (userId, date)
            )
        `);

        // Tasks table
        await this.execute(`
            CREATE TABLE IF NOT EXISTS bonus_tasks (
                id TEXT PRIMARY KEY,
                name TEXT,
                url TEXT,
                reward REAL,
                icon TEXT
            )
        `);

        // Links table
        await this.execute(`
            CREATE TABLE IF NOT EXISTS links (
                id TEXT PRIMARY KEY,
                name TEXT,
                url TEXT,
                icon TEXT
            )
        `);

        // User completed tasks mapping
        await this.execute(`
            CREATE TABLE IF NOT EXISTS user_completed_tasks (
                userId TEXT,
                taskId TEXT,
                PRIMARY KEY (userId, taskId)
            )
        `);

        console.log('Database Initialized.');
    }
};

export default db;
