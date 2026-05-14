const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');

require('dotenv').config({
    path: path.resolve(__dirname, '../.env')
});

const DataModel = require('../models/DataModel');

const seedData = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;

        if (!mongoUri) {
            throw new Error('MONGO_URI is not defined in the .env file.');
        }

        await mongoose.connect(mongoUri);

        console.log('MongoDB connected for seeding...');

        // Read JSON file
        const rawData = fs.readFileSync(
            path.resolve(__dirname, '../jsondata.json'),
            'utf-8'
        );

        const parsedData = JSON.parse(rawData);

        // Clean & normalize data
        const cleanedData = parsedData.map((item) => ({
            end_year: Number(item.end_year) || null,
            intensity: Number(item.intensity) || 0,
            sector: item.sector || '',
            topic: item.topic || '',
            insight: item.insight || '',
            url: item.url || '',
            region: item.region || '',
            start_year: Number(item.start_year) || null,
            impact: item.impact || '',
            added: item.added || '',
            published: item.published || '',
            city: item.city || '',
            country: item.country || '',
            relevance: Number(item.relevance) || 0,
            pestle: item.pestle || '',
            source: item.source || '',
            title: item.title || '',
            likelihood: Number(item.likelihood) || 0
        }));

        // Clear existing data
        await DataModel.deleteMany({});
        console.log('Old data cleared.');

        // Insert cleaned data
        await DataModel.insertMany(cleanedData);

        console.log('Database successfully seeded with cleaned JSON data!');
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

seedData();