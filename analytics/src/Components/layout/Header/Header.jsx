import { MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import HeaderActions from './HeaderActions'
import HeaderSearch from './HeaderSearch'
import HeaderUser from './HeaderUser'

export default function Header({ isDarkMode, isSidebarOpen, onToggleSidebar, onToggleTheme }) {
    const [isMobileActionsOpen, setIsMobileActionsOpen] = useState(false)

    return (
        <header className="layout-header relative flex h-[65px] items-center justify-between border-b border-gray-300 bg-white px-4 transition-colors dark:border-[#292929] dark:bg-[#090909]">
            <div className="layout-header-primary flex min-w-0 flex-1 items-center gap-5">
                <button
                    type="button"
                    onClick={onToggleSidebar}
                    aria-label="Toggle sidebar"
                    aria-expanded={isSidebarOpen}
                    className="layout-header-menu cursor-pointer rounded-md border-[0.5px] border-[#bbbbbb] bg-white p-1.5 text-gray-800 transition-colors hover:bg-gray-100 hover:text-black dark:border-[#303030] dark:bg-[#151515] dark:text-gray-100 dark:hover:bg-[#202020] dark:hover:text-white"
                >
                    <MenuIcon isSidebarOpen={isSidebarOpen} />
                </button>
                <HeaderSearch />
            </div>
            <div className="layout-header-desktop-actions flex items-center">
                <HeaderActions
                    isDarkMode={isDarkMode}
                    onToggleTheme={onToggleTheme}
                    className="layout-header-actions mr-3"
                />
                <HeaderUser />
            </div>
            <button
                type="button"
                aria-label="Show header actions"
                aria-expanded={isMobileActionsOpen}
                onClick={() => setIsMobileActionsOpen((isOpen) => !isOpen)}
                className="layout-header-more cursor-pointer rounded-md border-[0.5px] border-[#bbbbbb] bg-white p-1.5 text-gray-800 transition-colors hover:bg-gray-100 hover:text-black dark:border-[#303030] dark:bg-[#151515] dark:text-gray-100 dark:hover:bg-[#202020] dark:hover:text-white"
            >
                <MoreHorizontal size={20} strokeWidth={1.5} aria-hidden="true" />
            </button>
            {isMobileActionsOpen && (
                <div className="layout-header-mobile-actions">
                    <HeaderSearch />
                    <HeaderActions isDarkMode={isDarkMode} onToggleTheme={onToggleTheme} />
                    <HeaderUser />
                </div>
            )}
        </header>
    )
}

function MenuIcon({ isSidebarOpen }) {
    return (
        <svg
            viewBox="0 0 24 24"
            width="20"
            height="21"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            aria-hidden="true"
        >
            <path className="layout-menu-icon-lines" d="M4 6h16M4 12h16M4 18h16" />
            <path className="layout-menu-icon-close" d="M5 5l14 14M19 5L5 19" />
        </svg>
    )
}