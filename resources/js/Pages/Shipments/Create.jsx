import AppLayout from '@/Layouts/AppLayout'
import { Link, router } from '@inertiajs/react'
import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

// Empty row template
const emptyItem = {
    product_id:       '',
    bundles_received: 0,
    packs_received:   0,
    unit_cost:        '',
}

export default function Create({ suppliers, products }) {
    // Form header state
    const [form, setForm] = useState({
        supplier_id:      '',
        reference_number: '',
        type:             'incoming',
        received_at:      new Date().toISOString().split('T')[0], // today's date
        notes:            '',
    })

    // Dynamic items state — starts with one empty row
    const [items, setItems] = useState([{ ...emptyItem }])
    const [errors, setErrors] = useState({})
    const [processing, setProcessing] = useState(false)

    // Update a header field
    /**
     * we use setField to update the form state when a user changes a value in the shipment form. 
     * It takes two parameters: field (the name of the field to update) and value (the new value for that field).
     * The function uses the setForm state updater function to create a new form object that includes all the previous fields (using the spread operator ...f) and updates the specified field with the new value.
     * This ensures that only the targeted field is updated while preserving the other fields in the form state.
     * 
     * Example usage:
     * setField('supplier_id', 5) would update the supplier_id field in the form state to 5.
     * @param {*} field 
     * @param {*} value 
     */
    function setField(field, value) {
        setForm(f => ({ ...f, [field]: value }))
    }

    // Update a specific field in a specific item row
    function setItemField(index, field, value) {
        setItems(prev => prev.map((item, i) => {
            if (i !== index) return item

            const updated = { ...item, [field]: value }

            // When product is selected, auto-fill packs_per_bundle info
            if (field === 'product_id') {
                const product = products.find(p => p.id === parseInt(value))
                if (product) {
                    updated._packs_per_bundle = product.packs_per_bundle
                    updated.unit_cost = product.cost_price
                }
            }

            // When bundles changes, auto-calculate packs
            if (field === 'bundles_received') {
                const product = products.find(p => p.id === parseInt(item.product_id))
                if (product) {
                    updated.packs_received = parseInt(value || 0) * product.packs_per_bundle
                }
            }

            return updated
        }))
    }

    // Add a new empty row
    function addItem() {
        {/* Add a new empty row and ... means spread the emptyItem object */}
        setItems(prev => [...prev, { ...emptyItem }])
    }

    // Remove a row by index
    function removeItem(index) {
        setItems(prev => prev.filter((_, i) => i !== index))
    }

    // Calculate total cost
    const totalCost = items.reduce((sum, item) => {
        return sum + (parseFloat(item.packs_received || 0) * parseFloat(item.unit_cost || 0))
    }, 0)

    function handleSubmit(e) {
        e.preventDefault()
        setProcessing(true)
        setErrors({})

        router.post('/shipments', { ...form, items }, {
            onError: (errs) => {
                setErrors(errs)
                setProcessing(false)
            },
            onFinish: () => setProcessing(false),
        })
    }

    return (
        <AppLayout title="New Shipment">
            <div className="max-w-4xl">

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <Link href="/shipments" className="hover:text-indigo-600">Shipments</Link>
                    <span>/</span>
                    <span>New Shipment</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Header card */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5">
                        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4">Shipment Details</h2>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Supplier */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Supplier <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={form.supplier_id}
                                    onChange={e => setField('supplier_id', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">Select supplier</option>
                                    {suppliers.map(s => (
                                        //s.id is the unique identifier for each supplier, and s.name is the name of the supplier. The key prop is used to help React identify which items have changed, are added, or are removed. The value prop sets the value of the option to the supplier's ID, which will be used when the form is submitted. The displayed text of the option is the supplier's name.
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                                {errors.supplier_id && <p className="mt-1 text-xs text-red-500">{errors.supplier_id}</p>}
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
                                    placeholder="e.g. INV-2024-001"
                                />
                                {errors.reference_number && <p className="mt-1 text-xs text-red-500">{errors.reference_number}</p>}
                            </div>

                            {/* Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={form.type}
                                    onChange={e => setField('type', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="incoming">Incoming (Stock In)</option>
                                    <option value="outgoing">Outgoing (Returns to Supplier)</option>
                                </select>
                                {errors.type && <p className="mt-1 text-xs text-red-500">{errors.type}</p>}
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={form.received_at}
                                    onChange={e => setField('received_at', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                {errors.received_at && <p className="mt-1 text-xs text-red-500">{errors.received_at}</p>}
                            </div>
                        </div>

                        {/* Notes */}
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

                        {errors.items && (
                            <p className="mb-3 text-xs text-red-500">{errors.items}</p>
                        )}

                        {/* Items table */}
                        <div className="space-y-2">
                            {/* Header row */}
                            <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 px-1">
                                <div className="col-span-4">Product</div>
                                <div className="col-span-2">Bundles</div>
                                <div className="col-span-2">Packs</div>
                                <div className="col-span-2">Unit Cost</div>
                                <div className="col-span-1">Subtotal</div>
                                <div className="col-span-1"></div>
                            </div>

                            {items.map((item, index) => (
                                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                                    {/* Product */}
                                    <div className="col-span-4">
                                        <select
                                            value={item.product_id}
                                            onChange={e => setItemField(index, 'product_id', e.target.value)}
                                            className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="">Select product</option>
                                            {products.map(p => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name} ({p.packs_per_bundle} packs/bundle)
                                                </option>
                                            ))}
                                        </select>
                                        {errors[`items.${index}.product_id`] && (
                                            <p className="mt-0.5 text-xs text-red-500">{errors[`items.${index}.product_id`]}</p>
                                        )}
                                    </div>

                                    {/* Bundles */}
                                    <div className="col-span-2">
                                        <input
                                            type="number"
                                            min="0"
                                            value={item.bundles_received}
                                            onChange={e => setItemField(index, 'bundles_received', e.target.value)}
                                            className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>

                                    {/* Packs */}
                                    <div className="col-span-2">
                                        <input
                                            type="number"
                                            min="0"
                                            value={item.packs_received}
                                            onChange={e => setItemField(index, 'packs_received', e.target.value)}
                                            className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                        {errors[`items.${index}.packs_received`] && (
                                            <p className="mt-0.5 text-xs text-red-500">{errors[`items.${index}.packs_received`]}</p>
                                        )}
                                    </div>

                                    {/* Unit cost */}
                                    <div className="col-span-2">
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={item.unit_cost}
                                            onChange={e => setItemField(index, 'unit_cost', e.target.value)}
                                            className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>

                                    {/* Subtotal */}
                                    <div className="col-span-1 text-sm text-gray-600 dark:text-gray-400 text-right">
                                        Rs. {(parseFloat(item.packs_received || 0) * parseFloat(item.unit_cost || 0)).toLocaleString()}
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
                                <span className="text-gray-500 dark:text-gray-400 mr-3">Total Cost:</span>
                                <span className="font-semibold text-gray-800 dark:text-gray-100">
                                    Rs. {totalCost.toLocaleString()}
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
                            {processing ? 'Saving...' : 'Record Shipment'}
                        </button>
                        <Link
                            href="/shipments"
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