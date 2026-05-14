const StatCard = ({ title, value }) => {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 transition hover:border-slate-700">
            
            <p className="text-slate-400 text-sm mb-2">
                {title}
            </p>

            <h3 className="text-2xl md:text-3xl font-bold text-white">
                {value}
            </h3>

        </div>
    );
};

export default StatCard;