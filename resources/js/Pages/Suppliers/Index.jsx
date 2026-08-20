import AppLayout from '@/Layouts/AppLayout'
import { useForm } from '@inertiajs/react'
import { useState } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

function SupplierModal({ onClose, editing }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: editing?.name ?? '',
        contact_person: editing?.contact_person ?? '',
        phone: editing?.phone ?? '',
        email: editing?.email ?? '',
        address: editing?.address ?? '',
    })

    function handleSubmit(e) {
        e.preventDefault()
        if (editing) {
            put(`/suppliers/${editing.id}`, {
                onSuccess: () => { reset(); onClose() },
            })
        } else {
            post('/suppliers', {
                onSuccess: () => { reset(); onClose() },
            })
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg w-full max-w-lg mx-4 shadow-xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        {editing ? 'Edit Supplier' : 'New Supplier'}
                    </h2>
                    <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            autoFocus
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g. Fresh Meat Co."
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                    </div>

                    {/* Two columns for contact + phone */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Contact Person
                            </label>
                            <input
                                type="text"
                                value={data.contact_person}
                                onChange={e => setData('contact_person', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="John Smith"
                            />
                            {errors.contact_person && <p className="mt-1 text-xs text-red-500">{errors.contact_person}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Phone
                            </label>
                            <input
                                type="text"
                                value={data.phone}
                                onChange={e => setData('phone', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="+94 77 123 4567"
                            />
                            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="supplier@example.com"
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Address
                        </label>
                        <textarea
                            value={data.address}
                            onChange={e => setData('address', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                            placeholder="123 Main St, Colombo"
                        />
                        {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            {processing ? 'Saving...' : editing ? 'Update' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default function Index({ suppliers }) {
    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState(null)

    function openCreate() {
        setEditing(null)
        setModalOpen(true)
    }

    function openEdit(supplier) {
        setEditing(supplier)
        setModalOpen(true)
    }

    function closeModal() {
        setModalOpen(false)
        setEditing(null)
    }

    function handleDelete(supplier) {
        if (confirm(`Delete "${supplier.name}"? This cannot be undone.`)) {
            import('@inertiajs/react').then(({ router }) => {
                router.delete(`/suppliers/${supplier.id}`)
            })
        }
    }

    return (
        <AppLayout title="Suppliers">
            {modalOpen && <SupplierModal onClose={closeModal} editing={editing} />}

            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Suppliers</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {suppliers.length} {suppliers.length === 1 ? 'supplier' : 'suppliers'}
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Supplier
                </button>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                            <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">#</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Name</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Contact</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Phone</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Email</th>
                            <th className="text-right px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {suppliers.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-12 text-gray-400 dark:text-gray-600">
                                    No suppliers yet. Add your first one.
                                </td>
                            </tr>
                        ) : (
                            suppliers.map((supplier, index) => (
                                <tr
                                    key={supplier.id}
                                    className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                >
                                    <td className="px-4 py-3 text-gray-400 dark:text-gray-600">{index + 1}</td>
                                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">{supplier.name}</td>
                                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{supplier.contact_person ?? '—'}</td>
                                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{supplier.phone ?? '—'}</td>
                                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{supplier.email ?? '—'}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openEdit(supplier)}
                                                className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded transition-colors"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(supplier)}
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