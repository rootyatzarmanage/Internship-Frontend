import { MoreHorizontal } from 'lucide-react'
import logo from '../assets/logo.png'
import {
    adminNavigationItems,
    mainNavigationItems,
} from '../config/navigation'
import type { NavigationItem } from '../config/navigation'

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type SidebarProps = {
    isCollapsed: boolean
}

type SidebarNavSectionProps = {
    title: string
    items: NavigationItem[]
    isCollapsed: boolean
    currentPath: string
}

/* -------------------------------------------------------------------------- */
/* Sidebar Logo                                                               */
/* -------------------------------------------------------------------------- */

function SidebarLogo({ isCollapsed }: { isCollapsed: boolean }) {
    return (
        <a
            href="/"
            aria-label="Yatzar Manage home"
            className={`flex h-20 items-center no-underline ${
                isCollapsed
                    ? 'justify-center px-0'
                    : 'gap-2 px-3'
            }`}
        >
            <img
                src={logo}
                alt="Yatzar Manage logo"
                className={`shrink-0 object-contain dark:brightness-0 dark:invert ${
                    isCollapsed
                        ? 'h-[30px] w-[36px]'
                        : 'h-[30px] w-[36px]'
                }`}
            />

            <span
                className={`overflow-hidden pl-0 text-[18px] font-medium tracking-normal whitespace-nowrap text-black transition-all duration-300 ease-in-out dark:text-gray-100 ${
                    isCollapsed
                        ? 'max-w-0 scale-90 opacity-0'
                        : 'max-w-[180px] flex-none scale-100 opacity-100'
                }`}
            >
                YATZAR MANAGE
            </span>
        </a>
    )
}

/* -------------------------------------------------------------------------- */
/* Sidebar Navigation Section                                                */
/* -------------------------------------------------------------------------- */

function SidebarNavSection({
    title,
    items,
    isCollapsed,
    currentPath,
}: SidebarNavSectionProps) {
    return (
        <div className="px-2 py-1">
            {isCollapsed ? (
                <div
                    className="flex justify-center py-1 text-gray-800 dark:text-gray-100"
                    title={title}
                >
                    <MoreHorizontal
                        size={21}
                        strokeWidth={1.8}
                        aria-hidden="true"
                    />
                </div>
            ) : (
                <p className="overflow-hidden px-2 text-[12px] leading-[16px] font-medium tracking-wide whitespace-nowrap text-[#BBBBBB] uppercase transition-all duration-300">
                    {title}
                </p>
            )}

            <div
                className={`mt-2 space-y-[8px] ${
                    isCollapsed ? 'px-0' : 'px-4'
                }`}
            >
                {items.map(({ label, route, icon: Icon }) => (
                    <a
                        key={label}
                        href={route}
                        aria-label={label}
                        title={isCollapsed ? label : undefined}
                        className={`flex w-full cursor-pointer items-center rounded-md py-1.5 text-left text-[16px] font-normal no-underline transition-colors ${
                            currentPath === route
                                ? '!bg-[#008CD21A] !text-[#008CD2] hover:!bg-[#008CD21A] hover:!text-[#008CD2]'
                                : 'text-[#414141] hover:bg-gray-100 hover:text-black dark:text-gray-300 dark:hover:bg-[#242424] dark:hover:text-white'
                        } ${
                            isCollapsed
                                ? 'justify-center px-0'
                                : 'gap-3 px-2'
                        }`}
                    >
                        <Icon
                            size={25}
                            strokeWidth={1.4}
                            className="shrink-0"
                            aria-hidden="true"
                        />

                        <span
                            className={`origin-left overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${
                                isCollapsed
                                    ? 'max-w-0 scale-95 opacity-0'
                                    : 'max-w-[150px] scale-100 opacity-100'
                            }`}
                        >
                            {label}
                        </span>
                    </a>
                ))}
            </div>
        </div>
    )
}

/* -------------------------------------------------------------------------- */
/* Main Menu                                                                  */
/* -------------------------------------------------------------------------- */

function SidebarMainMenu({
    isCollapsed,
    currentPath,
}: {
    isCollapsed: boolean
    currentPath: string
}) {
    return (
        <SidebarNavSection
            title="Main Menu"
            items={mainNavigationItems}
            isCollapsed={isCollapsed}
            currentPath={currentPath}
        />
    )
}

/* -------------------------------------------------------------------------- */
/* Admin Menu                                                                 */
/* -------------------------------------------------------------------------- */

function SidebarAdmin({
    isCollapsed,
    currentPath,
}: {
    isCollapsed: boolean
    currentPath: string
}) {
    return (
        <SidebarNavSection
            title="Admin"
            items={adminNavigationItems}
            isCollapsed={isCollapsed}
            currentPath={currentPath}
        />
    )
}

/* -------------------------------------------------------------------------- */
/* Main Sidebar                                                               */
/* -------------------------------------------------------------------------- */

export default function Sidebar({ isCollapsed }: SidebarProps) {
    const currentPath = window.location.pathname

    return (
        <aside
            className={`layout-sidebar ${
                isCollapsed
                    ? 'layout-sidebar--collapsed w-[66px]'
                    : 'layout-sidebar--expanded w-[219px]'
            } flex h-screen min-h-0 shrink-0 flex-col overflow-hidden border-r border-gray-300 bg-white transition-all duration-300 ease-in-out select-none dark:border-[#252525] dark:bg-[#151515]`}
            aria-label="Sidebar"
        >
            <SidebarLogo isCollapsed={isCollapsed} />

            <nav
                aria-label="Main navigation"
                className="flex-1 overflow-y-auto"
            >
                <SidebarMainMenu
                    isCollapsed={isCollapsed}
                    currentPath={currentPath}
                />

                <SidebarAdmin
                    isCollapsed={isCollapsed}
                    currentPath={currentPath}
                />
            </nav>
        </aside>
    )
}