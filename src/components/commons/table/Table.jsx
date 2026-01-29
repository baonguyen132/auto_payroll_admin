import React from 'react'
import PropTypes from 'prop-types'

const Table = ({ columns, data, emptyMessage = "No data available" }) => {
    return (
        <div className="overflow-x-auto custom-scrollbar">
            <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gradient-to-r from-purple-50 to-purple-100">
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className="px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider"
                                style={column.width ? { width: column.width } : {}}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                    {data.length > 0 ? (
                        data.map((row, rowIndex) => (
                            <tr 
                                key={rowIndex} 
                                className="hover:bg-purple-50/50 transition-colors duration-150"
                            >
                                {columns.map((column, colIndex) => (
                                    <td 
                                        key={colIndex} 
                                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                                    >
                                        {column.render ? column.render(row) : row[column.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="px-6 py-12">
                                {typeof emptyMessage === 'string' ? (
                                    <div className="text-center text-sm text-gray-500">
                                        {emptyMessage}
                                    </div>
                                ) : (
                                    emptyMessage
                                )}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

Table.propTypes = {
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            header: PropTypes.string.isRequired,
            render: PropTypes.func
        })
    ).isRequired,
    data: PropTypes.array.isRequired,
    emptyMessage: PropTypes.string
}

export default Table