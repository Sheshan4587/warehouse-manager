import { useState, useEffect } from 'react'
import { Link, usePage } from '@inertiajs/react'
import {
    LayoutDashboard,
    Package,
    Tags,
    Truck,
    ShoppingCart,
    RotateCcw,
    Users,
    Menu,
    X,
    Sun,
    Moon,
    Warehouse,
} from 'lucide-react'

const navItems = [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Categories', href: '/categories', icon: Tags },
    { label: 'Suppliers', href: '/suppliers', icon: Users },
    { label: 'Products', href: '/products', icon: Package },
    { label: 'Shipments', href: '/shipments', icon: Truck },
    { label: 'Sales', href: '/sales', icon: ShoppingCart },
    { label: 'Returns', href: '/returns', icon: RotateCcw },
]

function useTheme() {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light'
    })

    useEffect(() => {
        const root = document.documentElement
        root.classList.toggle('dark', theme === 'dark') // Add or remove the 'dark' class on the root element
        localStorage.setItem('theme', theme)
    }, [theme])

    const toggle = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

    return { theme, toggle }
}

export default function AppLayout({ children, title }) {
    const { url } = usePage()
    const { theme, toggle } = useTheme()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex">

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-60 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
                flex flex-col transition-transform duration-200
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:static lg:inset-auto
            `}>
                {/* Logo */}
                <div className="flex items-center gap-2 px-4 h-14 border-b border-gray-200 dark:border-gray-800 shrink-0">
                    <Warehouse className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <span className="font-bold text-sm tracking-wide text-gray-800 dark:text-gray-100">
                        Warehouse Manager
                    </span>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
                    {navItems.map(({ label, href, icon: Icon }) => {
                        const active = url === href || (href !== '/' && url.startsWith(href))
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`
                                    flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                                    ${active
                                        ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                                    }
                                `}
                            >
                                <Icon className="w-4 h-4 shrink-0" />
                                {label}
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-400 dark:text-gray-600">
                    v1.0.0
                </div>
            </aside>

            {/* Sidebar overlay (mobile) */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* Top bar */}
                <header className="h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 gap-3 shrink-0">
                    <button
                        onClick={() => setSidebarOpen(o => !o)}
                        className="lg:hidden p-1.5 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>

                    <h1 className="flex-1 text-sm font-semibold text-gray-700 dark:text-gray-200">
                        {title}
                    </h1>

                    {/* Theme toggle */}
                    <button
                        onClick={toggle}
                        className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        title="Toggle theme"
                    >
                        {theme === 'dark'
                            ? <Sun className="w-4 h-4" />
                            : <Moon className="w-4 h-4" />
                        }
                    </button>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-auto p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}