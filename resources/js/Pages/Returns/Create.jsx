import AppLayout from '@/Layouts/AppLayout'
import { Link, router } from '@inertiajs/react'
import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

const reasons = [
    'Wrong item delivered',
    'Damaged product',
    'Expired product',
    'Customer changed mind',
    'Quality issue',
    'Other',
]

const emptyItem = {
    product_id:     '',
    packs_returned: '',
    reason:         '',
}

export default function Create({ sales }) {
    const [form, setForm] = useState({
        sale_id:          '',
        reference_number: '',
        returned_at:      new Date().toISOString().split('T')[0],
        notes:            '',
    })

    const [items, setItems] = useState([{ ...emptyItem }])
    const [errors, setErrors] = useState({})
    const [processing, setProcessing] = useState(false)

    // Get the selected sale's items for the product dropdown
    const selectedSale = sales.find(s => s.id === parseInt(form.sale_id))
    const saleProducts = selectedSale?.items?.map(i => i.product) ?? []

    function setField(field, value) {
        setForm(f => ({ ...f, [field]: value }))
        // Reset items when sale changes
        if (field === 'sale_id') {
            setItems([{ ...emptyItem }])
        }
    }

    function setItemField(index, field, value) {
        setItems(prev => prev.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        ))
    }

    function addItem() {
        setItems(prev => [...prev, { ...emptyItem }])
    }

    function removeItem(index) {
        setItems(prev => prev.filter((_, i) => i !== index))
    }

    function handleSubmit(e) {
        e.preventDefault()
        setProcessing(true)
        setErrors({})

        router.post('/returns', { ...form, items }, {
            onError: (errs) => {
                setErrors(errs)
                setProcessing(false)
            },
            onFinish: () => setProcessing(false),
        })
    }

    return (
        <AppLayout title="New Return">
            <div className="max-w-4xl">

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <Link href="/returns" className="hover:text-indigo-600">Returns</Link>
                    <span>/</span>
                    <span>New Return</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Header card */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5">
                        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4">Return Details</h2>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Sale */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Original Sale <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={form.sale_id}
                                    onChange={e => setField('sale_id', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">Select sale</option>
                                    {sales.map(s => (
                                        <option key={s.id} value={s.id}>
                                            {s.reference_number} — {s.sold_at}
                                        </option>
                                    ))}
                                </select>
                                {errors.sale_id && <p className="mt-1 text-xs text-red-500">{errors.sale_id}</p>}
                            </div>

                            {/* Reference number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Reference Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={form.reference_number}
                                    onChange={e => setField('reference_number', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="e.g. RET-2024-001"
                                />
                                {errors.reference_number && <p className="mt-1 text-xs text-red-500">{errors.reference_number}</p>}
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Return Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={form.returned_at}
                                    onChange={e => setField('returned_at', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                {errors.returned_at && <p className="mt-1 text-xs text-red-500">{errors.returned_at}</p>}
                            </div>

                            {/* Notes */}
                            <div>
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
                    </div>

                    {/* Items card */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">Returned Items</h2>
                            <button
                                type="button"
                                onClick={addItem}
                                disabled={!form.sale_id}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 disabled:opacity-50 rounded-lg transition-colors"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Add Row
                            </button>
                        </div>

                        {!form.sale_id && (
                            <p className="text-sm text-gray-400 dark:text-gray-600 text-center py-4">
                                Select a sale first to add returned items.
                            </p>
                        )}

                        {form.sale_id && (
                            <div className="space-y-2">
                                {/* Header */}
                                <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 px-1">
                                    <div className="col-span-4">Product</div>
                                    <div className="col-span-2">Packs Returned</div>
                                    <div className="col-span-5">Reason</div>
                                    <div className="col-span-1"></div>
                                </div>

                                {items.map((item, index) => (
                                    <div key={index} className="grid grid-cols-12 gap-2 items-center">
                                        {/* Product — only from original sale */}
                                        <div className="col-span-4">
                                            <select
                                                value={item.product_id}
                                                onChange={e => setItemField(index, 'product_id', e.target.value)}
                                                className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            >
                                                <option value="">Select product</option>
                                                {saleProducts.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                ))}
                                            </select>
                                            {errors[`items.${index}.product_id`] && (
                                                <p className="mt-0.5 text-xs text-red-500">{errors[`items.${index}.product_id`]}</p>
                                            )}
                                        </div>

                                        {/* Packs returned */}
                                        <div className="col-span-2">
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.packs_returned}
                                                onChange={e => setItemField(index, 'packs_returned', e.target.value)}
                                                className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                            {errors[`items.${index}.packs_returned`] && (
                                                <p className="mt-0.5 text-xs text-red-500">{errors[`items.${index}.packs_returned`]}</p>
                                            )}
                                        </div>

                                        {/* Reason */}
                                        <div className="col-span-5">
                                            <select
                                                value={item.reason}
                                                onChange={e => setItemField(index, 'reason', e.target.value)}
                                                className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            >
                                                <option value="">Select reason</option>
                                                {reasons.map(r => (
                                                    <option key={r} value={r}>{r}</option>
                                                ))}
                                            </select>
                                            {errors[`items.${index}.reason`] && (
                                                <p className="mt-0.5 text-xs text-red-500">{errors[`items.${index}.reason`]}</p>
                                            )}
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
                        )}
                    </div>

                    {/* Submit */}
                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            {processing ? 'Saving...' : 'Record Return'}
                        </button>
                        <Link
                            href="/returns"
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