import AppLayout from '@/Layouts/AppLayout'
import { Link } from '@inertiajs/react'
import { ArrowDownCircle, ArrowUpCircle, Package } from 'lucide-react'

export default function Show({ shipment }) {
    const isIncoming = shipment.type === 'incoming'

    return (
        <AppLayout title={`Shipment ${shipment.reference_number}`}>
            <div className="max-w-4xl">
                <div className="mb-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Link href="/shipments" className="hover:text-indigo-600">Shipments</Link>
                    <span>/</span>
                    <span>{shipment.reference_number}</span>
                </div>

                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                            Shipment Details
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {shipment.reference_number}
                        </p>
                    </div>
                    <span className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium
                        ${isIncoming
                            ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400'
                            : 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400'
                        }`}
                    >
                        {isIncoming
                            ? <ArrowDownCircle className="h-3 w-3" />
                            : <ArrowUpCircle className="h-3 w-3" />
                        }
                        {shipment.type}
                    </span>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Supplier</p>
                        <p className="mt-1 font-medium text-gray-800 dark:text-gray-100">{shipment.supplier.name}</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Received date</p>
                        <p className="mt-1 font-medium text-gray-800 dark:text-gray-100">{shipment.received_at}</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Items</p>
                        <p className="mt-1 font-medium text-gray-800 dark:text-gray-100">{shipment.items.length}</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Total cost</p>
                        <p className="mt-1 font-medium text-gray-800 dark:text-gray-100">
                            Rs. {Number(shipment.total_cost).toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                    <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100">Shipment Items</h3>
                    </div>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50">
                                <th className="px-5 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Product</th>
                                <th className="px-5 py-3 text-right font-medium text-gray-600 dark:text-gray-400">Bundles</th>
                                <th className="px-5 py-3 text-right font-medium text-gray-600 dark:text-gray-400">Packs</th>
                                <th className="px-5 py-3 text-right font-medium text-gray-600 dark:text-gray-400">Unit cost</th>
                                <th className="px-5 py-3 text-right font-medium text-gray-600 dark:text-gray-400">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shipment.items.map(item => (
                                <tr key={item.id} className="border-b border-gray-100 last:border-0 dark:border-gray-800">
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-2">
                                            <Package className="h-4 w-4 text-gray-400" />
                                            <span className="font-medium text-gray-800 dark:text-gray-100">
                                                {item.product.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-right text-gray-500 dark:text-gray-400">{item.bundles_received}</td>
                                    <td className="px-5 py-3 text-right text-gray-500 dark:text-gray-400">{item.packs_received}</td>
                                    <td className="px-5 py-3 text-right text-gray-500 dark:text-gray-400">
                                        Rs. {Number(item.unit_cost).toLocaleString()}
                                    </td>
                                    <td className="px-5 py-3 text-right text-gray-500 dark:text-gray-400">
                                        Rs. {(item.packs_received * Number(item.unit_cost)).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {shipment.notes && (
                    <div className="mt-4 rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                        <h3 className="mb-1 font-semibold text-gray-800 dark:text-gray-100">Notes</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{shipment.notes}</p>
                    </div>
                )}
            </div>
        </AppLayout>
    )
}
