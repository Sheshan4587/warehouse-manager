import AppLayout from '@/Layouts/AppLayout'
import { Link, router } from '@inertiajs/react'
import { Plus, Trash2, Eye, RotateCcw, Clock, CheckCircle, Package } from 'lucide-react'

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

export default function Index({ returns, stats }) {
    function handleDelete(ret) {
        if (confirm(`Delete return "${ret.reference_number}"? This cannot be undone.`)) {
            router.delete(`/returns/${ret.id}`)
        }
    }

    return (
        <AppLayout title="Returns">

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    label="Total Returns"
                    value={stats.total_returns}
                    icon={RotateCcw}
                    color="bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400"
                />
                <StatCard
                    label="Pending"
                    value={stats.pending}
                    icon={Clock}
                    color="bg-yellow-50 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-400"
                />
                <StatCard
                    label="Sent to Supplier"
                    value={stats.sent_to_supplier}
                    icon={CheckCircle}
                    color="bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400"
                />
                <StatCard
                    label="Total Items"
                    value={stats.total_items}
                    icon={Package}
                    color="bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Returns</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {returns.length} {returns.length === 1 ? 'return' : 'returns'}
                    </p>
                </div>
                <Link
                    href="/returns/create"
                    className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    New Return
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                            <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">#</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Reference</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Sale</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Items</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Status</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Date</th>
                            <th className="text-right px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {returns.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center py-12 text-gray-400 dark:text-gray-600">
                                    No returns yet.
                                </td>
                            </tr>
                        ) : (
                            returns.map((ret, index) => (
                                <tr
                                    key={ret.id}
                                    className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                >
                                    <td className="px-4 py-3 text-gray-400 dark:text-gray-600">{index + 1}</td>
                                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                                        <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs font-mono">
                                            {ret.reference_number}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                                        {ret.sale.reference_number}
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{ret.items.length}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                                            ${ret.status === 'pending'
                                                ? 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400'
                                                : 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400'
                                            }`}>
                                            {ret.status === 'pending' ? 'Pending' : 'Sent to Supplier'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{ret.returned_at}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/returns/${ret.id}`}
                                                className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(ret)}
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