import StatCard from './StatCard';
import { 
    Database, 
    Activity, 
    Target, 
    CheckCircle2, 
    Globe2 
} from 'lucide-react';

const StatsSection = ({ stats }) => {
    if (!stats) return null;

    return (
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">

            <StatCard
                title="Total Records"
                value={stats.totalRecords?.toLocaleString() || 0}
                icon={Database}
                themeColor="blue"
            />

            <StatCard
                title="Avg Intensity"
                value={stats.avgIntensity || 0}
                icon={Activity}
                themeColor="cyan"
            />

            <StatCard
                title="Avg Likelihood"
                value={stats.avgLikelihood || 0}
                icon={Target}
                themeColor="violet"
            />

            <StatCard
                title="Avg Relevance"
                value={stats.avgRelevance || 0}
                icon={CheckCircle2}
                themeColor="emerald"
            />

            <StatCard
                title="Countries"
                value={stats.totalCountries?.toLocaleString() || 0}
                icon={Globe2}
                themeColor="amber"
            />

        </div>
    );
};

export default StatsSection;