import AppLayout from '@/Layouts/AppLayout'
import { Link, router } from '@inertiajs/react'
import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

const emptyItem = {
    product_id:  '',
    packs_sold:  '',
    unit_price:  '',
}

export default function Create({ products }) {
    const [form, setForm] = useState({
        reference_number: '',
        sold_at:          new Date().toISOString().split('T')[0],
        notes:            '',
    })

    const [items, setItems] = useState([{ ...emptyItem }])
    const [errors, setErrors] = useState({})
    const [processing, setProcessing] = useState(false)

    function setField(field, value) {
        setForm(f => ({ ...f, [field]: value }))
    }

    function setItemField(index, field, value) {
        setItems(prev => prev.map((item, i) => {
            if (i !== index) return item
            const updated = { ...item, [field]: value }

            // Auto-fill unit price when product selected
            if (field === 'product_id') {
                const product = products.find(p => p.id === parseInt(value))
                if (product) {
                    updated.unit_price = product.selling_price
                    updated._stock_packs = product.stock_packs
                    updated._packs_per_bundle = product.packs_per_bundle
                }
            }
            return updated
        }))
    }

    function addItem() {
        setItems(prev => [...prev, { ...emptyItem }])
    }

    function removeItem(index) {
        setItems(prev => prev.filter((_, i) => i !== index))
    }

    const totalAmount = items.reduce((sum, item) => {
        return sum + (parseFloat(item.packs_sold || 0) * parseFloat(item.unit_price || 0))
    }, 0)

    function handleSubmit(e) {
        e.preventDefault()
        setProcessing(true)
        setErrors({})

        router.post('/sales', { ...form, items }, {
            onError: (errs) => {
                setErrors(errs)
                setProcessing(false)
            },
            onFinish: () => setProcessing(false),
        })
    }

    return (
        <AppLayout title="New Sale">
            <div className="max-w-4xl">

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <Link href="/sales" className="hover:text-indigo-600">Sales</Link>
                    <span>/</span>
                    <span>New Sale</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Header card */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5">
                        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4">Sale Details</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Reference Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={form.reference_number}
                                    onChange={e => setField('reference_number', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="e.g. SALE-2024-001"
                                />
                                {errors.reference_number && <p className="mt-1 text-xs text-red-500">{errors.reference_number}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={form.sold_at}
                                    onChange={e => setField('sold_at', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                {errors.sold_at && <p className="mt-1 text-xs text-red-500">{errors.sold_at}</p>}
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Notes
                            </label>
                            <textarea
                                value={form.notes}
                                onChange={e => setField('notes', e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                placeholder="Optional notes"
                            />
                        </div>
                    </div>

                    {/* Items card */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">Items</h2>
                            <button
                                type="button"
                                onClick={addItem}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 rounded-lg transition-colors"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Add Row
                            </button>
                        </div>

                        {errors.items && <p className="mb-3 text-xs text-red-500">{errors.items}</p>}

                        <div className="space-y-2">
                            {/* Header */}
                            <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 px-1">
                                <div className="col-span-5">Product</div>
                                <div className="col-span-2">Available</div>
                                <div className="col-span-2">Packs Sold</div>
                                <div className="col-span-2">Unit Price</div>
                                <div className="col-span-1"></div>
                            </div>

                            {items.map((item, index) => (
                                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                                    {/* Product */}
                                    <div className="col-span-5">
                                        <select
                                            value={item.product_id}
                                            onChange={e => setItemField(index, 'product_id', e.target.value)}
                                            className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="">Select product</option>
                                            {products.map(p => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors[`items.${index}.product_id`] && (
                                            <p className="mt-0.5 text-xs text-red-500">{errors[`items.${index}.product_id`]}</p>
                                        )}
                                    </div>

                                    {/* Available stock */}
                                    <div className="col-span-2">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            {item._stock_packs !== undefined ? `${item._stock_packs} packs` : '—'}
                                        </span>
                                    </div>

                                    {/* Packs sold */}
                                    <div className="col-span-2">
                                        <input
                                            type="number"
                                            min="1"
                                            max={item._stock_packs}
                                            value={item.packs_sold}
                                            onChange={e => setItemField(index, 'packs_sold', e.target.value)}
                                            className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                        {errors[`items.${index}.packs_sold`] && (
                                            <p className="mt-0.5 text-xs text-red-500">{errors[`items.${index}.packs_sold`]}</p>
                                        )}
                                    </div>

                                    {/* Unit price */}
                                    <div className="col-span-2">
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={item.unit_price}
                                            onChange={e => setItemField(index, 'unit_price', e.target.value)}
                                            className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>

                                    {/* Remove */}
                                    <div className="col-span-1 flex justify-end">
                                        {items.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Total */}
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 flex justify-end">
                            <div className="text-sm">
                                <span className="text-gray-500 dark:text-gray-400 mr-3">Total Amount:</span>
                                <span className="font-semibold text-gray-800 dark:text-gray-100">
                                    Rs. {totalAmount.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            {processing ? 'Saving...' : 'Record Sale'}
                        </button>
                        <Link
                            href="/sales"
                            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    )
}