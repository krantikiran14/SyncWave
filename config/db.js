require('dotenv').config();
const mongoose = require('mongoose');
const MONGO_CONNECTION_URL = process.env.MONGO_CONNECTION_URL;

async function connectDB() {
    try {
        await mongoose.connect(MONGO_CONNECTION_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Database Connected');
    } catch (error) {
        console.error('Connection failed:', error);
    }
}

module.exports = connectDB;
