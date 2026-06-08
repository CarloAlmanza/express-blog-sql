const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection } = require('./config/database');
const postRoutes = require('./routes/postRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test connessione e avvio
async function startServer() {
    const isConnected = await testConnection();

    if (!isConnected) {
        console.error('❌ Database non disponibile. Server non avviato.');
        process.exit(1);
    }

    // Routes
    app.use('/api', postRoutes);

    app.get('/', (req, res) => {
        res.json({
            message: 'Blog API con MySQL',
            endpoints: {
                posts: 'GET /api/posts',
                post: 'GET /api/posts/:id',
                delete: 'DELETE /api/posts/:id',
                create: 'POST /api/posts (bonus)'
            }
        });
    });

    // 404 handler
    app.use((req, res) => {
        res.status(404).json({ error: 'Endpoint non trovato' });
    });

    app.listen(PORT, () => {
        console.log(`🚀 Server avviato su http://localhost:${PORT}`);
    });
}

startServer();