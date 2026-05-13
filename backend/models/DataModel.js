const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    end_year: { type: String, default: "" },
    intensity: { type: Number, default: 0 },
    sector: { type: String, default: "" },
    topic: { type: String, default: "" },
    insight: { type: String, default: "" },
    url: { type: String, default: "" },
    region: { type: String, default: "" },
    start_year: { type: String, default: "" },
    impact: { type: String, default: "" },
    added: { type: String, default: "" },
    published: { type: String, default: "" },
    city: { type: String, default: "" },
    country: { type: String, default: "" },
    relevance: { type: Number, default: 0 },
    pestle: { type: String, default: "" },
    source: { type: String, default: "" },
    title: { type: String, default: "" },
    likelihood: { type: Number, default: 0 }
}, { strict: false }); // strict: false allows for any extra unpredictable fields in the JSON

module.exports = mongoose.model('Data', dataSchema);