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
                colorClass="text-blue-500 dark:text-blue-400"
                bgClass="bg-blue-500/10"
                borderHover="hover:border-blue-500/30"
            />

            <StatCard
                title="Avg Intensity"
                value={stats.avgIntensity || 0}
                icon={Activity}
                colorClass="text-cyan-500 dark:text-cyan-400"
                bgClass="bg-cyan-500/10"
                borderHover="hover:border-cyan-500/30"
            />

            <StatCard
                title="Avg Likelihood"
                value={stats.avgLikelihood || 0}
                icon={Target}
                colorClass="text-violet-500 dark:text-violet-400"
                bgClass="bg-violet-500/10"
                borderHover="hover:border-violet-500/30"
            />

            <StatCard
                title="Avg Relevance"
                value={stats.avgRelevance || 0}
                icon={CheckCircle2}
                colorClass="text-emerald-500 dark:text-emerald-400"
                bgClass="bg-emerald-500/10"
                borderHover="hover:border-emerald-500/30"
            />

            <StatCard
                title="Countries"
                value={stats.totalCountries?.toLocaleString() || 0}
                icon={Globe2}
                colorClass="text-amber-500 dark:text-amber-400"
                bgClass="bg-amber-500/10"
                borderHover="hover:border-amber-500/30"
            />

        </div>
    );
};

export default StatsSection;