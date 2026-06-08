const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'blog_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Funzione per testare la connessione
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connesso con successo!');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Errore di connessione al database:', error.message);
        return false;
    }
}

module.exports = { pool, testConnection };