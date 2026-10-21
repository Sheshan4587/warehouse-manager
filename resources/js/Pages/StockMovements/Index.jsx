import AppLayout from '@/Layouts/AppLayout'
import { useState } from 'react'
import {
    ArrowDownCircle,
    ArrowUpCircle,
    Package,
    TrendingUp,
    TrendingDown,
    Settings,
} from 'lucide-react'

function StatCard({ label, value, icon: Icon, color }) {
    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex items-center gap-4">
            <div className={`p-2 rounded-lg ${color}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
            </div>
        </div>
    )
}

const typeConfig = {
    shipment_in: {
        label: 'Shipment In',
        color: 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400',
        icon: ArrowDownCircle,
    },
    sale_out: {
        label: 'Sale Out',
        color: 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400',
        icon: ArrowUpCircle,
    },
    return_in: {
        label: 'Return In',
        color: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400',
        icon: ArrowDownCircle,
    },
    return_out: {
        label: 'Return Out',
        color: 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400',
        icon: ArrowUpCircle,
    },
    adjustment: {
        label: 'Adjustment',
        color: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400',
        icon: Settings,
    },
}

export default function Index({ movements, stats, products }) {
    const [filterProduct, setFilterProduct] = useState('')
    const [filterType, setFilterType] = useState('')

    // Filter movements based on selected filters
    const filtered = movements.filter(m => {
        const matchProduct = filterProduct === '' || m.product_id === parseInt(filterProduct) // Filter by product
        const matchType = filterType === '' || m.type === filterType // Filter by type if filterType is empty, match all types, otherwise match the selected type
        return matchProduct && matchType
    })

    return (
        <AppLayout title="Stock History">

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    label="Total Movements"
                    value={stats.total_movements}
                    icon={Package}
                    color="bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400"
                />
                <StatCard
                    label="Total Stock In"
                    value={`${stats.stock_in} packs`}
                    icon={TrendingDown}
                    color="bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400"
                />
                <StatCard
                    label="Total Stock Out"
                    value={`${stats.stock_out} packs`}
                    icon={TrendingUp}
                    color="bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400"
                />
                <StatCard
                    label="Adjustments"
                    value={stats.adjustments}
                    icon={Settings}
                    color="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                />
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3">
                    <div className="flex-1">
                        <select
                            value={filterProduct}
                            onChange={e => setFilterProduct(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Products</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1">
                        <select
                            value={filterType}
                            onChange={e => setFilterType(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Types</option>
                            <option value="shipment_in">Shipment In</option>
                            <option value="sale_out">Sale Out</option>
                            <option value="return_in">Return In</option>
                            <option value="return_out">Return Out</option>
                            <option value="adjustment">Adjustment</option>
                        </select>
                    </div>
                    <button
                        onClick={() => { setFilterProduct(''); setFilterType('') }}
                        className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg transition-colors"
                    >
                        Clear
                    </button>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {filtered.length} records
                    </span>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                            <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">#</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Product</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Type</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Change</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Stock After</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Note</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center py-12 text-gray-400 dark:text-gray-600">
                                    No stock movements found.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((movement, index) => {
                                const config = typeConfig[movement.type] ?? typeConfig.adjustment
                                const Icon = config.icon
                                return (
                                    <tr
                                        key={movement.id}
                                        className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                    >
                                        <td className="px-4 py-3 text-gray-400 dark:text-gray-600">{index + 1}</td>
                                        <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                                            {movement.product.name}
                                            {/*This movment is the instance of the stock movement, and it has a product relationship that contains the product name.*/}
                                            {/* Which is created from backend and passed to the frontend as a prop.*/}
                                            {/* product is the relationship of the stock movement model that contains the product model.*/}
                                            {/* name is the attribute of the product model that contains the product name.*/}
                                            {/* So all together, movement.product.name is the product name of the stock movement.*/}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${config.color}`}>
                                                <Icon className="w-3 h-3" />
                                                {config.label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`font-medium ${movement.packs_delta > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                {movement.packs_delta > 0 ? '+' : ''}{movement.packs_delta} packs
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                                            {movement.packs_after} packs
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400 max-w-xs truncate">
                                            {movement.note ?? '—'}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                                            {new Date(movement.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    )
}