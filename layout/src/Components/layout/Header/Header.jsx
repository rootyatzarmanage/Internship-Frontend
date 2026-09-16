import HeaderActions from './HeaderActions'
import HeaderSearch from './HeaderSearch'
import HeaderUser from './HeaderUser'

export default function Header({ isDarkMode, onToggleSidebar, onToggleTheme }) {
    return (
        <header className="layout-header flex h-[65px] items-center justify-between border-b border-gray-300 bg-white px-4 transition-colors dark:border-[#292929] dark:bg-[#090909]">
            <div className="flex min-w-0 flex-1 items-center gap-5">
                <button
                    type="button"
                    onClick={onToggleSidebar}
                    aria-label="Toggle sidebar"
                    className="cursor-pointer rounded-md border-[0.5px] border-[#bbbbbb] bg-white p-1.5 text-gray-800 transition-colors hover:bg-gray-100 hover:text-black dark:border-[#303030] dark:bg-[#151515] dark:text-gray-100 dark:hover:bg-[#202020] dark:hover:text-white"
                >
                    <MenuIcon />
                </button>
                <HeaderSearch />
            </div>
            <HeaderActions
                isDarkMode={isDarkMode}
                onToggleTheme={onToggleTheme}
            />
            <HeaderUser />
        </header>
    )
}

function MenuIcon() {
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
            <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    )
}