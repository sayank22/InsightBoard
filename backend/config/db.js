const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB successfully connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Stop the server if the database fails to connect
    }
};

module.exports = connectDB;