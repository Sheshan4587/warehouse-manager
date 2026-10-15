import AppLayout from '@/Layouts/AppLayout'
import { Link, router } from '@inertiajs/react'
import { Plus, Trash2, Eye, ShoppingCart, TrendingUp, Calendar, DollarSign } from 'lucide-react'

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

export default function Index({ sales, stats }) {
    function handleDelete(sale) {
        if (confirm(`Delete sale "${sale.reference_number}"? This cannot be undone.`)) {
            router.delete(`/sales/${sale.id}`)
        }
    }

    return (
        <AppLayout title="Sales">

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    label="Total Sales"
                    value={stats.total_sales}
                    icon={ShoppingCart}
                    color="bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400"
                />
                <StatCard
                    label="Total Revenue"
                    value={`Rs. ${Number(stats.total_revenue).toLocaleString()}`}
                    icon={TrendingUp}
                    color="bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400"
                />
                <StatCard
                    label="Today's Sales"
                    value={stats.today_sales}
                    icon={Calendar}
                    color="bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                />
                <StatCard
                    label="Today's Revenue"
                    value={`Rs. ${Number(stats.today_revenue).toLocaleString()}`}
                    icon={DollarSign}
                    color="bg-yellow-50 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-400"
                />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Sales</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {sales.length} {sales.length === 1 ? 'sale' : 'sales'}
                    </p>
                </div>
                <Link
                    href="/sales/create"
                    className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    New Sale
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                            <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">#</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Reference</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Items</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Total Amount</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Date</th>
                            <th className="text-right px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-12 text-gray-400 dark:text-gray-600">
                                    No sales yet. Record your first one.
                                </td>
                            </tr>
                        ) : (
                            sales.map((sale, index) => (
                                <tr
                                    key={sale.id}
                                    className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                >
                                    <td className="px-4 py-3 text-gray-400 dark:text-gray-600">{index + 1}</td>
                                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                                        <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs font-mono">
                                            {sale.reference_number}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{sale.items.length}</td>
                                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                                        Rs. {Number(sale.total_amount).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{sale.sold_at}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/sales/${sale.id}`}
                                                className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(sale)}
                                                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    )
}