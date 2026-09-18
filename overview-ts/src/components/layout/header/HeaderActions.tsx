import { Bell, Moon, Sun } from 'lucide-react'

type HeaderActionsProps = {
    isDarkMode : boolean;
    onToggleTheme :() => void ;
    className?: string
}

export default function HeaderActions({ isDarkMode, onToggleTheme, className = '' } : HeaderActionsProps) {
    const actionClassName = 'shrink-0 cursor-pointer rounded-lg border-[0.5px] border-[#bbbbbb] p-1.5 text-black transition-colors hover:bg-gray-100 hover:text-black dark:border-[#303030] dark:bg-[#151515] dark:text-gray-100 dark:hover:bg-[#202020] dark:hover:text-white'

    return (
        <div className={`flex shrink-0 items-center gap-3 ${className}`}>
            <button
                type="button"
                onClick={onToggleTheme}
                aria-label={isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
                className={actionClassName}
            >
                {isDarkMode ? <Moon size={20} strokeWidth={1.2} aria-hidden="true" /> : <Sun size={20} strokeWidth={1.2} aria-hidden="true" />}
            </button>
            <button type="button" aria-label="Notifications" className={`relative ${actionClassName}`}>
                <Bell size={20} strokeWidth={1.2} aria-hidden="true" />
            </button>
        </div>
    )
}