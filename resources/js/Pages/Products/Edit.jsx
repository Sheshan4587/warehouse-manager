import AppLayout from '@/Layouts/AppLayout'
import { Link } from '@inertiajs/react'
import { useForm } from '@inertiajs/react'

export default function Edit({ product, categories, suppliers }) {
    // Initialize the form state with the product's current data
    const { data, setData, put, processing, errors } = useForm({
        category_id:         product.category_id,
        supplier_id:         product.supplier_id,
        name:                product.name,
        sku:                 product.sku,
        packs_per_bundle:    product.packs_per_bundle,
        cost_price:          product.cost_price,
        selling_price:       product.selling_price,
        low_stock_threshold: product.low_stock_threshold,
    })

    function handleSubmit(e) {
        e.preventDefault()
        put(`/products/${product.id}`)
    }

    return (
        <AppLayout title="Edit Product">
            <div className="max-w-2xl">

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <Link href="/products" className="hover:text-indigo-600">Products</Link>
                    <span>/</span>
                    <span>Edit</span>
                </div>

                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5">
                    <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4">Edit Product</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                SKU <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.sku}
                                onChange={e => setData('sku', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            {errors.sku && <p className="mt-1 text-xs text-red-500">{errors.sku}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.category_id}
                                    onChange={e => setData('category_id', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                {errors.category_id && <p className="mt-1 text-xs text-red-500">{errors.category_id}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Supplier <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.supplier_id}
                                    onChange={e => setData('supplier_id', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    {suppliers.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                                {errors.supplier_id && <p className="mt-1 text-xs text-red-500">{errors.supplier_id}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Packs per Bundle <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={data.packs_per_bundle}
                                onChange={e => setData('packs_per_bundle', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            {errors.packs_per_bundle && <p className="mt-1 text-xs text-red-500">{errors.packs_per_bundle}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Cost Price (Rs.) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={data.cost_price}
                                    onChange={e => setData('cost_price', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                {errors.cost_price && <p className="mt-1 text-xs text-red-500">{errors.cost_price}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Selling Price (Rs.) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={data.selling_price}
                                    onChange={e => setData('selling_price', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                {errors.selling_price && <p className="mt-1 text-xs text-red-500">{errors.selling_price}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Low Stock Threshold <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={data.low_stock_threshold}
                                onChange={e => setData('low_stock_threshold', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <p className="mt-1 text-xs text-gray-400 dark:text-gray-600">
                                Alert when stock falls at or below this number of packs
                            </p>
                            {errors.low_stock_threshold && <p className="mt-1 text-xs text-red-500">{errors.low_stock_threshold}</p>}
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                {processing ? 'Saving...' : 'Update Product'}
                            </button>
                            <Link
                                href="/products"
                                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    )
}