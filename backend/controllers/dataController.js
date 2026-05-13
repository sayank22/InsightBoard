const DataModel = require('../models/DataModel');

const getDashboardData = async (req, res) => {
    try {
        const query = {};
        const allowedFilters = [
            'end_year', 'topic', 'sector', 'region', 
            'pestle', 'source', 'country', 'city'
        ];

        allowedFilters.forEach(filter => {
            if (req.query[filter]) {
                query[filter] = { $regex: new RegExp(req.query[filter], 'i') };
            }
        });

        const data = await DataModel.find(query);
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { getDashboardData };