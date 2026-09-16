import { navigationGroups } from '../../../config/navigation'
import SidebarLogo from './SidebarLogo'
import SidebarNavGroup from './SidebarNavGroup'
import SidebarBackLink from './SidebarBackLink'

export default function Sidebar({ isCollapsed }) {
    const currentPath = window.location.pathname

    return (
        <aside
            className={`overview-sidebar ${isCollapsed ? 'overview-sidebar--collapsed w-[66px]' : 'overview-sidebar--expanded w-[219px]'} flex h-screen min-h-0 shrink-0 flex-col overflow-hidden border-r border-gray-300 bg-white transition-all duration-300 ease-in-out select-none dark:border-[#252525] dark:bg-[#151515]`}
            aria-label="Sidebar"
        >
            <SidebarLogo isCollapsed={isCollapsed} />

            <nav aria-label="Project navigation" className="flex-1 overflow-y-auto">
                {navigationGroups.map((group) => (
                    <SidebarNavGroup
                        key={group.label}
                        label={group.label}
                        items={group.items}
                        isCollapsed={isCollapsed}
                        currentPath={currentPath}
                    />
                ))}
            </nav>

            <SidebarBackLink isCollapsed={isCollapsed} />
        </aside>
    )
}
