const express = require("express");
const cors = require("cors");
const { setupDatabase } = require("./config/db");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const roleRoutes = require("./routes/role");
const moduleRoutes = require("./routes/module");
const roleModuleRoutes = require("./routes/roleModule");
require("dotenv").config();

const app = express();

// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
});

app.use(cors());
app.use(express.json());

// Enhanced health check endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

// Simple Hello World route
app.get('/hello', (req, res) => {
    res.json({ message: "Hello World" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/role-modules", roleModuleRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 8080;

// Start server first, then initialize database
const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Environment:', process.env.NODE_ENV);
});

// Initialize database after server is running
(async () => {
    try {
        console.log('Initializing database...');
        await setupDatabase();
        console.log('Database initialized successfully');
        console.log('Database Host:', process.env.DB_HOST);
    } catch (error) {
        console.error('Database initialization failed:', error);
        // Don't exit process, just log the error
        // This allows the health check to still work even if DB is down
    }
})();
