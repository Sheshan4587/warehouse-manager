import AppLayout from '@/Layouts/AppLayout'
import { Link } from '@inertiajs/react'

export default function Show({ return: ret }) {
    return (
        <AppLayout title="Return Details">
            <div className="max-w-4xl">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <Link href="/returns" className="hover:text-indigo-600">Returns</Link>
                    <span>/</span>
                    <span>{ret.reference_number}</span>
                </div>

                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Reference</p>
                            <p className="font-medium text-gray-800 dark:text-gray-100">{ret.reference_number}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Original Sale</p>
                            <p className="font-medium text-gray-800 dark:text-gray-100">{ret.sale.reference_number}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                                ${ret.status === 'pending'
                                    ? 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400'
                                    : 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400'
                                }`}>
                                {ret.status === 'pending' ? 'Pending' : 'Sent to Supplier'}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Return Date</p>
                            <p className="font-medium text-gray-800 dark:text-gray-100">{ret.returned_at}</p>
                        </div>
                        {ret.notes && (
                            <div className="col-span-2">
                                <p className="text-xs text-gray-500 dark:text-gray-400">Notes</p>
                                <p className="font-medium text-gray-800 dark:text-gray-100">{ret.notes}</p>
                            </div>
                        )}
                    </div>

                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">Returned Items</h3>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                                <th className="text-left px-3 py-2 font-medium text-gray-600 dark:text-gray-400">Product</th>
                                <th className="text-left px-3 py-2 font-medium text-gray-600 dark:text-gray-400">Packs Returned</th>
                                <th className="text-left px-3 py-2 font-medium text-gray-600 dark:text-gray-400">Reason</th>
                                <th className="text-left px-3 py-2 font-medium text-gray-600 dark:text-gray-400">Sent to Supplier</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ret.items.map((item, index) => (
                                <tr key={index} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                                    <td className="px-3 py-2 text-gray-800 dark:text-gray-100">{item.product.name}</td>
                                    <td className="px-3 py-2 text-gray-500 dark:text-gray-400">{item.packs_returned}</td>
                                    <td className="px-3 py-2 text-gray-500 dark:text-gray-400">{item.reason}</td>
                                    <td className="px-3 py-2">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                                            ${item.sent_to_supplier
                                                ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400'
                                                : 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400'
                                            }`}>
                                            {item.sent_to_supplier ? 'Yes' : 'Pending'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    )
}