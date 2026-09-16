import { ChevronDown, ChevronUp, LogOut, Settings, UserRound } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { currentUser } from '../../../config/user'

export default function HeaderUser() {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const userMenuRef = useRef(null)

    useEffect(() => {
        const closeUserMenu = (event) => {
            if (!userMenuRef.current?.contains(event.target)) {
                setIsUserMenuOpen(false)
            }
        }

        const closeUserMenuOnEscape = (event) => {
            if (event.key === 'Escape') {
                setIsUserMenuOpen(false)
            }
        }

        document.addEventListener('mousedown', closeUserMenu)
        document.addEventListener('keydown', closeUserMenuOnEscape)

        return () => {
            document.removeEventListener('mousedown', closeUserMenu)
            document.removeEventListener('keydown', closeUserMenuOnEscape)
        }
    }, [])

    return (
        <div ref={userMenuRef} className="layout-header-user relative z-40 shrink-0">
            <button
                type="button"
                aria-expanded={isUserMenuOpen}
                aria-haspopup="menu"
                aria-label={`${isUserMenuOpen ? 'Close' : 'Open'} ${currentUser.name} menu`}
                onClick={() => setIsUserMenuOpen((isOpen) => !isOpen)}
                className="flex cursor-pointer items-center gap-2 rounded-lg p-1 transition-colors hover:bg-gray-100 dark:hover:bg-[#202020]"
            >
                <img src={currentUser.avatar} alt={currentUser.name} className="h-8.5 w-9 rounded-lg border border-[#808080] object-cover" />
                <span className="hidden text-left text-[14px] font-regular leading-none text-[#111111] dark:text-gray-100 sm:block">{currentUser.name}</span>
                {isUserMenuOpen ? <ChevronUp size={21} strokeWidth={1.8} aria-hidden="true" /> : <ChevronDown size={21} strokeWidth={1.8} aria-hidden="true" />}
            </button>

            {isUserMenuOpen && (
                <div role="menu" className="layout-user-menu absolute right-0 top-full z-50 mt-4 h-[220px] w-[210px] rounded-xl border border-[#d2d2d2] bg-white p-4 shadow-lg dark:border-[#303030] dark:bg-[#1d1d1d]">
                    <div className="border-b border-[#d2d2d2] px-1 pb-4 dark:border-[#404040]">
                        <p className="text-[14px] font-semibold leading-tight text-[#404040] dark:text-gray-100">{currentUser.name}</p>
                        <p className="mt-1 truncate text-[12px] font-semibold text-[#a3a3a3]">{currentUser.email}</p>
                    </div>
                    <div className="pt-2">
                        <a href="/profile" role="menuitem" className="flex items-center gap-4 rounded-md px-2 py-2 text-[14px] text-[#404040] no-underline transition-colors hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-[#292929]">
                            <UserRound size={20} strokeWidth={1.5} aria-hidden="true" />
                            Edit profile
                        </a>
                        <a href="/settings" role="menuitem" className="flex items-center gap-4 rounded-md px-2 py-2 text-[14px] text-[#404040] no-underline transition-colors hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-[#292929]">
                            <Settings size={20} strokeWidth={1.5} aria-hidden="true" />
                            Settings
                        </a>
                        <a href={currentUser.logoutRoute} role="menuitem" className="mt-2 flex items-center gap-4 border-t border-[#d2d2d2] px-2 pt-4 text-[14px] text-[#404040] no-underline transition-colors hover:text-[#008CD2] dark:border-[#404040] dark:text-gray-100">
                            <LogOut size={20} strokeWidth={1.5} aria-hidden="true" />
                            Logout
                        </a>
                    </div>
                </div>
            )}
        </div>
    )
}