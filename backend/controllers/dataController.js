const DataModel = require('../models/DataModel');


// GET DASHBOARD DATA
const getDashboardData = async (req, res) => {
    try {
        const query = {};

        const allowedFilters = [
            'topic',
            'sector',
            'region',
            'pestle',
            'source',
            'country',
            'city',
        ];

        // String-based filters
        allowedFilters.forEach((filter) => {
            if (req.query[filter]) {
                query[filter] = {
                    $regex: req.query[filter],
                    $options: 'i',
                };
            }
        });

        // Number-based filters
        if (req.query.intensity) {
            query.intensity = Number(req.query.intensity);
        }

        if (req.query.likelihood) {
            query.likelihood = Number(req.query.likelihood);
        }

        if (req.query.relevance) {
            query.relevance = Number(req.query.relevance);
        }

        if (req.query.end_year) {
            query.end_year = Number(req.query.end_year);
        }

        if (req.query.start_year) {
            query.start_year = Number(req.query.start_year);
        }

        const data = await DataModel.find(query);

        res.status(200).json({
            success: true,
            count: data.length,
            data,
        });

    } catch (error) {
        console.error('Error fetching dashboard data:', error);

        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};


// GET FILTER OPTIONS
const getFilterOptions = async (req, res) => {
    try {
        const [
            sectors,
            topics,
            regions,
            pestles,
            sources,
            countries,
            cities,
            endYears,
        ] = await Promise.all([
            DataModel.distinct('sector'),
            DataModel.distinct('topic'),
            DataModel.distinct('region'),
            DataModel.distinct('pestle'),
            DataModel.distinct('source'),
            DataModel.distinct('country'),
            DataModel.distinct('city'),
            DataModel.distinct('end_year'),
        ]);

        res.status(200).json({
            success: true,
            filters: {
                sectors: sectors.filter(Boolean),
                topics: topics.filter(Boolean),
                regions: regions.filter(Boolean),
                pestles: pestles.filter(Boolean),
                sources: sources.filter(Boolean),
                countries: countries.filter(Boolean),
                cities: cities.filter(Boolean),
                endYears: endYears
                    .filter(Boolean)
                    .sort((a, b) => a - b),
            },
        });

    } catch (error) {
        console.error('Error fetching filter options:', error);

        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};


// GET DASHBOARD STATS
const getDashboardStats = async (req, res) => {
    try {
        const totalRecords = await DataModel.countDocuments();

        const stats = await DataModel.aggregate([
            {
                $group: {
                    _id: null,
                    avgIntensity: { $avg: '$intensity' },
                    avgLikelihood: { $avg: '$likelihood' },
                    avgRelevance: { $avg: '$relevance' },
                },
            },
        ]);

        const totalCountries = (
            await DataModel.distinct('country')
        ).filter(Boolean).length;

        const totalTopics = (
            await DataModel.distinct('topic')
        ).filter(Boolean).length;

        res.status(200).json({
            success: true,
            stats: {
                totalRecords,
                avgIntensity: stats[0]?.avgIntensity?.toFixed(2) || 0,
                avgLikelihood: stats[0]?.avgLikelihood?.toFixed(2) || 0,
                avgRelevance: stats[0]?.avgRelevance?.toFixed(2) || 0,
                totalCountries,
                totalTopics,
            },
        });

    } catch (error) {
        console.error('Error fetching dashboard stats:', error);

        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};


// EXPORTS
module.exports = {
    getDashboardData,
    getFilterOptions,
    getDashboardStats,
};