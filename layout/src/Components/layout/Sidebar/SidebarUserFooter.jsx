import { LogOut } from 'lucide-react'
import { currentUser } from '../../../config/user'

export default function SidebarUserFooter({ isCollapsed }) {
    const { name, role, avatar, logoutRoute } = currentUser

    return (
        <div className={`mt-auto ${isCollapsed ? 'flex w-full justify-center pb-3' : 'w-full px-2 pb-2'}`}>
            <a
                href={logoutRoute}
                aria-label={`Log out ${name}`}
                title={isCollapsed ? `Log out ${name}` : undefined}
                className={`flex cursor-pointer items-center rounded-md border border-gray-200 bg-white text-left no-underline shadow-sm transition-colors hover:bg-gray-100 hover:text-black dark:border-[#2b2b2b] dark:bg-[#1d1d1d] dark:hover:bg-[#272727] dark:hover:text-white ${
                    isCollapsed ? 'h-[20px] w-[20px] justify-center' : 'w-full gap-3 p-1.5'
                }`}
            >
                <img
                    src={avatar}
                    alt={name}
                    className={`shrink-0 rounded object-cover ${isCollapsed ? 'h-[18px] w-[18px]' : 'h-[30px] w-[30px]'}`}
                />
                <span
                    className={`min-w-0 flex-1 overflow-hidden transition-all duration-300 ease-in-out ${
                        isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[140px] opacity-100'
                    }`}
                >
                    <span className="block truncate text-[12px] font-semibold text-gray-700 dark:text-gray-100">{name}</span>
                    <span className="mt-0.5 block truncate text-[9px] font-normal text-gray-400 dark:text-gray-400">{role}</span>
                </span>
                <LogOut
                    size={24}
                    strokeWidth={1.8}
                    className={`shrink-0 text-[#ff5a63] ${isCollapsed ? 'hidden' : ''}`}
                    aria-hidden="true"
                />
            </a>
        </div>
    )
}
