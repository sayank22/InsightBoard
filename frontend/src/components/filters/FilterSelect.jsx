const FilterSelect = ({
    label,
    options = [],
    value,
    onChange,
}) => {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300">
                {label}
            </label>

            <select
                value={value}
                onChange={onChange}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-slate-500"
            >
                <option value="">
                    All
                </option>

                {options.map((option, index) => (
                    <option
                        key={index}
                        value={option}
                    >
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default FilterSelect;