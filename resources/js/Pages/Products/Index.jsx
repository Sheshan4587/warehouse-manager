import AppLayout from '@/Layouts/AppLayout'
import { Link, router } from '@inertiajs/react'
import { Plus, Pencil, Trash2, Package, AlertTriangle, XCircle, DollarSign } from 'lucide-react'
import { useState } from 'react'

// KPI Card component
function StatCard({ label, value, icon: Icon, color }) {
    //icon means the icon component passed as a prop, and we are renaming it to Icon for use in this component.
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

export default function Index({ products, stats }) {
    const [productToDelete, setProductToDelete] = useState(null)

    function handleDelete(product) {
        setProductToDelete(product)
    }

    function confirmDelete() {
        router.delete(`/products/${productToDelete.id}`, {
            onFinish: () => setProductToDelete(null),
        })
    }

    return (
        <AppLayout title="Products">

            {/* Delete confirmation modal */}
            {productToDelete && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
                    onClick={() => setProductToDelete(null)}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-product-title"
                        className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900"
                        onClick={event => event.stopPropagation()}
                    >
                        <div className="mb-4 flex items-center gap-3">
                            <div className="rounded-full bg-red-100 p-2 text-red-600 dark:bg-red-950 dark:text-red-400">
                                <Trash2 className="h-5 w-5" />
                            </div>
                            <h2 id="delete-product-title" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Delete product?
                            </h2>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Are you sure you want to delete <strong>{productToDelete.name}</strong>? This cannot be undone.
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setProductToDelete(null)}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    label="Total Products"
                    value={stats.total} 
                    icon={Package}
                    color="bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400"
                />
                <StatCard
                    label="Low Stock"
                    value={stats.low_stock}
                    icon={AlertTriangle}
                    color="bg-yellow-50 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-400"
                />
                <StatCard
                    label="Out of Stock"
                    value={stats.out_of_stock}
                    icon={XCircle}
                    color="bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400"
                />
                <StatCard
                    label="Total Stock Value"
                    value={`Rs. ${Number(stats.total_value).toLocaleString()}`}
                    icon={DollarSign}
                    color="bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400"
                />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Products</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {products.length} {products.length === 1 ? 'product' : 'products'}
                    </p>
                </div>
                <Link
                    href="/products/create"
                    className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Product
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                            <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">#</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Name</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">SKU</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Category</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Supplier</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Packs/Bundle</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Cost</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Price</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Stock</th>
                            <th className="text-right px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="text-center py-12 text-gray-400 dark:text-gray-600">
                                    No products yet. Add your first one.
                                </td>
                            </tr>
                        ) : (
                            products.map((product, index) => (
                                <tr
                                    key={product.id}
                                    className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                >
                                    <td className="px-4 py-3 text-gray-400 dark:text-gray-600">{index + 1}</td>
                                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">{product.name}</td>
                                    <td className="px-4 py-3">
                                        <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs font-mono text-gray-500 dark:text-gray-400">
                                            {product.sku}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{product.category.name}</td>
                                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{product.supplier.name}</td>
                                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{product.packs_per_bundle}</td>
                                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">Rs. {Number(product.cost_price).toLocaleString()}</td>
                                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">Rs. {Number(product.selling_price).toLocaleString()}</td>
                                    <td className="px-4 py-3">
                                        {/* Display stock status with color coding based on stock levels */}
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                                            ${product.stock_packs === 0
                                                ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400'
                                                : product.stock_packs <= product.low_stock_threshold
                                                    ? 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400'
                                                    : 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400'
                                            }`}>
                                            {product.stock_packs === 0
                                                ? 'Out of stock'
                                                : product.stock_packs <= product.low_stock_threshold
                                                    ? `Low (${product.stock_packs})`
                                                    : product.stock_packs}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/products/${product.id}/edit`}
                                                className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded transition-colors"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product)}
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