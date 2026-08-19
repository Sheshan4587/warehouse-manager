import AppLayout from '@/Layouts/AppLayout'

export default function Dashboard() {
    return (
        <AppLayout title="Dashboard">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Products', value: '—' },
                    { label: 'Low Stock Items', value: '—' },
                    { label: 'Sales Today', value: '—' },
                    { label: 'Pending Returns', value: '—' },
                ].map(({ label, value }) => (
                    <div
                        key={label}
                        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4"
                    >
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
                        <p className="text-2xl font-bold mt-1 text-gray-800 dark:text-gray-100">{value}</p>
                    </div>
                ))}
            </div>
        </AppLayout>
    )
}