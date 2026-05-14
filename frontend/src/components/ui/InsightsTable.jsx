const InsightsTable = ({ data }) => {

    // Show only first 10 rows
    const tableData = data.slice(0, 10);


    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mt-8">

            <div className="flex items-center justify-between mb-5">

                <h3 className="text-xl font-semibold text-white">
                    Recent Insights
                </h3>

                <p className="text-sm text-slate-400">
                    Showing {tableData.length} records
                </p>

            </div>


            <div className="w-full overflow-x-auto">

                <table className="w-full border-collapse">

                    <thead>

                        <tr className="border-b border-slate-700 text-left">

                            <th className="py-3 px-4 text-slate-300">
                                Topic
                            </th>

                            <th className="py-3 px-4 text-slate-300">
                                Region
                            </th>

                            <th className="py-3 px-4 text-slate-300">
                                Country
                            </th>

                            <th className="py-3 px-4 text-slate-300">
                                Intensity
                            </th>

                            <th className="py-3 px-4 text-slate-300">
                                Relevance
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {tableData.map((item, index) => (

                            <tr
                                key={index}
                                className="border-b border-slate-800 hover:bg-slate-800/50 transition"
                            >

                                <td className="py-3 px-4 text-white">
                                    {item.topic || 'N/A'}
                                </td>

                                <td className="py-3 px-4 text-slate-300">
                                    {item.region || 'N/A'}
                                </td>

                                <td className="py-3 px-4 text-slate-300">
                                    {item.country || 'N/A'}
                                </td>

                                <td className="py-3 px-4 text-slate-300">
                                    {item.intensity || 0}
                                </td>

                                <td className="py-3 px-4 text-slate-300">
                                    {item.relevance || 0}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
};


export default InsightsTable;