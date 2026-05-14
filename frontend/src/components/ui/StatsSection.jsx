import StatCard from './StatCard';

const StatsSection = ({ stats }) => {
    if (!stats) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 mb-8">

            <StatCard
                title="Total Records"
                value={stats.totalRecords}
            />

            <StatCard
                title="Average Intensity"
                value={stats.avgIntensity}
            />

            <StatCard
                title="Average Likelihood"
                value={stats.avgLikelihood}
            />

            <StatCard
                title="Average Relevance"
                value={stats.avgRelevance}
            />

            <StatCard
                title="Countries"
                value={stats.totalCountries}
            />

        </div>
    );
};

export default StatsSection;