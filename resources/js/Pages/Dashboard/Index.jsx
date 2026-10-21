import AppLayout from '@/Layouts/AppLayout'
import { Link } from '@inertiajs/react'
import {
    Package,
    AlertTriangle,
    XCircle,
    ShoppingCart,
    DollarSign,
    RotateCcw,
    Truck,
} from 'lucide-react'

function StatCard({ label, value, icon: Icon, color, href }) {
    const content = (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex items-center gap-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
            <div className={`p-2 rounded-lg ${color}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
            </div>
        </div>
    )

    return href ? <Link href={href}>{content}</Link> : content
}

export default function Index({ stats, recent_sales, recent_shipments, low_stock_products }) {
    return (
        <AppLayout title="Dashboard">

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    label="Total Products"
                    value={stats.total_products}
                    icon={Package}
                    color="bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400"
                    href="/products"
                />
                <StatCard
                    label="Low Stock"
                    value={stats.low_stock}
                    icon={AlertTriangle}
                    color="bg-yellow-50 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-400"
                    href="/products"
                />
                <StatCard
                    label="Out of Stock"
                    value={stats.out_of_stock}
                    icon={XCircle}
                    color="bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400"
                    href="/products"
                />
                <StatCard
                    label="Pending Returns"
                    value={stats.pending_returns}
                    icon={RotateCcw}
                    color="bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400"
                    href="/returns"
                />
            </div>

            {/* Today's stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <StatCard
                    label="Today's Sales"
                    value={stats.today_sales}
                    icon={ShoppingCart}
                    color="bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                    href="/sales"
                />
                <StatCard
                    label="Today's Revenue"
                    value={`Rs. ${Number(stats.today_revenue).toLocaleString()}`}
                    icon={DollarSign}
                    color="bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400"
                    href="/sales"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Low stock products */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Low Stock Alerts</h3>
                        <Link href="/products" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                            View all
                        </Link>
                    </div>
                    {low_stock_products.length === 0 ? (
                        <p className="text-sm text-gray-400 dark:text-gray-600 text-center py-4">
                            All products are well stocked.
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {low_stock_products.map(product => (
                                <div
                                    key={product.id}
                                    className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
                                >
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{product.name}</span>
                                    <span className="text-xs font-medium bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded">
                                        {product.stock_packs} packs
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent sales */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Recent Sales</h3>
                        <Link href="/sales" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                            View all
                        </Link>
                    </div>
                    {recent_sales.length === 0 ? (
                        <p className="text-sm text-gray-400 dark:text-gray-600 text-center py-4">
                            No sales yet.
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {recent_sales.map(sale => (
                                <div
                                    key={sale.id}
                                    className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {sale.reference_number}
                                        </p>
                                        <p className="text-xs text-gray-400 dark:text-gray-600">{sale.sold_at}</p>
                                    </div>
                                    <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                                        Rs. {Number(sale.total_amount).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent shipments */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Recent Shipments</h3>
                        <Link href="/shipments" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                            View all
                        </Link>
                    </div>
                    {recent_shipments.length === 0 ? (
                        <p className="text-sm text-gray-400 dark:text-gray-600 text-center py-4">
                            No shipments yet.
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {recent_shipments.map(shipment => (
                                <div
                                    key={shipment.id}
                                    className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {shipment.reference_number}
                                        </p>
                                        <p className="text-xs text-gray-400 dark:text-gray-600">{shipment.supplier.name}</p>
                                    </div>
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded
                                        ${shipment.type === 'incoming'
                                            ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400'
                                            : 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400'
                                        }`}>
                                        {shipment.type}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    )
}