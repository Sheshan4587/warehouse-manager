import AppLayout from '@/Layouts/AppLayout'
import { useForm, usePage } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

// ── Modal Component ────────────────────────────────────────────
// This handles both Create and Edit
// If 'editing' prop is null → Create mode
// If 'editing' prop is a category object → Edit mode
function CategoryModal({ onClose, editing }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: editing?.name ?? '',
        description: editing?.description ?? '',
    })

    function handleSubmit(e) {
        e.preventDefault()
        if (editing) {
            // Edit mode → PUT /categories/{id}
            put(`/categories/${editing.id}`, {
                onSuccess: () => {
                    reset()
                    onClose()
                },
            })
        } else {
            // Create mode → POST /categories
            post('/categories', {
                onSuccess: () => {
                    reset()
                    onClose()
                },
            })
        }
    }

    return (
        // Backdrop — clicking outside closes the modal
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={onClose}
        >
            {/* Modal box — stop click from bubbling to backdrop */}
            <div
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg w-full max-w-md mx-4 shadow-xl"
                onClick={e => e.stopPropagation()}
            >
                {/* Modal header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        {editing ? 'Edit Category' : 'New Category'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Modal body */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
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
                            placeholder="e.g. Sausages"
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                        </label>
                        <textarea
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                            placeholder="Optional description"
                        />
                        {errors.description && (
                            <p className="mt-1 text-xs text-red-500">{errors.description}</p>
                        )}
                    </div>

                    {/* Footer buttons */}
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

// ── Main Page Component ────────────────────────────────────────
export default function Index({ categories }) {
    const { flash } = usePage().props
    const [toast, setToast] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState(null)

    // Show flash message as toast for 3 seconds
    useEffect(() => {
        if (flash?.success) {
            setToast(flash.success)
            const timer = setTimeout(() => setToast(null), 3000)
            return () => clearTimeout(timer)
        }
    }, [flash])

    function openCreate() {
        setEditing(null)      // null = create mode
        setModalOpen(true)
    }

    function openEdit(category) {
        setEditing(category)  // category object = edit mode
        setModalOpen(true)
    }

    function closeModal() {
        setModalOpen(false)
        setEditing(null)
    }

    function handleDelete(category) {
        if (confirm(`Delete "${category.name}"? This cannot be undone.`)) {
            // router.delete sends a DELETE request to Laravel
            import('@inertiajs/react').then(({ router }) => {
                router.delete(`/categories/${category.id}`)
            })
        }
    }

    return (
        <AppLayout title="Categories">

            {/* Toast */}
            {toast && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white text-sm px-4 py-2 rounded-lg shadow-lg">
                    {toast}
                </div>
            )}

            {/* Modal */}
            {modalOpen && (
                <CategoryModal
                    onClose={closeModal}
                    editing={editing}
                />
            )}

            {/* Page header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        Categories
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {categories.length} {categories.length === 1 ? 'category' : 'categories'}
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Category
                </button>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                            <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">#</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Name</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Slug</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Description</th>
                            <th className="text-right px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-12 text-gray-400 dark:text-gray-600">
                                    No categories yet. Add your first one.
                                </td>
                            </tr>
                        ) : (
                            categories.map((category, index) => (
                                <tr
                                    key={category.id}
                                    className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                >
                                    <td className="px-4 py-3 text-gray-400 dark:text-gray-600">{index + 1}</td>
                                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">{category.name}</td>
                                    <td className="px-4 py-3">
                                        <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs font-mono text-gray-500 dark:text-gray-400">
                                            {category.slug}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                                        {category.description ?? '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openEdit(category)}
                                                className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded transition-colors"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category)}
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