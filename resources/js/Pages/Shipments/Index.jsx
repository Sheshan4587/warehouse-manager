import AppLayout from '@/Layouts/AppLayout'
import { Link, router } from '@inertiajs/react'
import { useState } from 'react'
import { Plus, Trash2, Eye, ArrowDownCircle, ArrowUpCircle } from 'lucide-react'

export default function Index({ shipments }) {
    const [shipmentToDelete, setShipmentToDelete] = useState(null)

    function handleDelete(shipment) {
        setShipmentToDelete(shipment)
    }

    function handleConfirmDelete() {
        if (shipmentToDelete) {
            router.delete(`/shipments/${shipmentToDelete.id}`)
            setShipmentToDelete(null)
        }
    }

    return (
        <AppLayout title="Shipments">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Shipments</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {shipments.length} {shipments.length === 1 ? 'shipment' : 'shipments'}
                    </p>
                </div>
                <Link
                    href="/shipments/create"
                    className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    New Shipment
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                            <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">#</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Reference</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Type</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Supplier</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Items</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Total Cost</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Date</th>
                            <th className="text-right px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shipments.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-center py-12 text-gray-400 dark:text-gray-600">
                                    No shipments yet. Record your first one.
                                </td>
                            </tr>
                        ) : (
                            shipments.map((shipment, index) => (
                                <tr
                                    key={shipment.id}
                                    className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                >
                                    <td className="px-4 py-3 text-gray-400 dark:text-gray-600">{index + 1}</td>
                                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                                        <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs font-mono">
                                            {shipment.reference_number}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium
                                            ${shipment.type === 'incoming'
                                                ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400'
                                                : 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400'
                                            }`}>
                                            {shipment.type === 'incoming'
                                                ? <ArrowDownCircle className="w-3 h-3" />
                                                : <ArrowUpCircle className="w-3 h-3" />
                                            }
                                            {shipment.type}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{shipment.supplier.name}</td>
                                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{shipment.items.length}</td>
                                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                                        Rs. {Number(shipment.total_cost).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{shipment.received_at}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/shipments/${shipment.id}`}
                                                className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(shipment)}
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
            {/* Delete Confirmation Modal */}
            {shipmentToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="h-fit w-fit min-w-70 max-w-xs rounded-lg bg-white p-4 shadow-lg dark:bg-gray-900">
                        <h3 className="mb-2 text-base font-semibold text-gray-800 dark:text-gray-100">Confirm Deletion</h3>
                        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                            Delete shipment "{shipmentToDelete.reference_number}"? This cannot be undone.
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShipmentToDelete(null)}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    )
}