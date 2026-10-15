import AppLayout from '@/Layouts/AppLayout'
import { Link } from '@inertiajs/react'

export default function Show({ sale }) {
    return (
        <AppLayout title="Sale Details">
            <div className="max-w-4xl">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <Link href="/sales" className="hover:text-indigo-600">Sales</Link>
                    <span>/</span>
                    <span>{sale.reference_number}</span>
                </div>

                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Reference</p>
                            <p className="font-medium text-gray-800 dark:text-gray-100">{sale.reference_number}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
                            <p className="font-medium text-gray-800 dark:text-gray-100">{sale.sold_at}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Total Amount</p>
                            <p className="font-medium text-gray-800 dark:text-gray-100">
                                Rs. {Number(sale.total_amount).toLocaleString()}
                            </p>
                        </div>
                        {sale.notes && (
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Notes</p>
                                <p className="font-medium text-gray-800 dark:text-gray-100">{sale.notes}</p>
                            </div>
                        )}
                    </div>

                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">Items Sold</h3>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                                <th className="text-left px-3 py-2 font-medium text-gray-600 dark:text-gray-400">Product</th>
                                <th className="text-left px-3 py-2 font-medium text-gray-600 dark:text-gray-400">Packs Sold</th>
                                <th className="text-left px-3 py-2 font-medium text-gray-600 dark:text-gray-400">Unit Price</th>
                                <th className="text-left px-3 py-2 font-medium text-gray-600 dark:text-gray-400">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sale.items.map((item, index) => (
                                <tr key={index} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                                    <td className="px-3 py-2 text-gray-800 dark:text-gray-100">{item.product.name}</td>
                                    <td className="px-3 py-2 text-gray-500 dark:text-gray-400">{item.packs_sold}</td>
                                    <td className="px-3 py-2 text-gray-500 dark:text-gray-400">Rs. {Number(item.unit_price).toLocaleString()}</td>
                                    <td className="px-3 py-2 text-gray-500 dark:text-gray-400">Rs. {Number(item.subtotal).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    )
}