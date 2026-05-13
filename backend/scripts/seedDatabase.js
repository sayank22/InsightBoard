const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const DataModel = require('../models/DataModel');

const seedData = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error('MONGO_URI is not defined in the .env file.');
        }

        await mongoose.connect(mongoUri);
        console.log('MongoDB connected for seeding...');

        const rawData = fs.readFileSync(path.resolve(__dirname, '../jsondata.json'), 'utf-8');
        const parsedData = JSON.parse(rawData);

        await DataModel.deleteMany({});
        console.log('Old data cleared.');

        await DataModel.insertMany(parsedData);
        console.log('Database successfully seeded with JSON data!');
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

seedData();