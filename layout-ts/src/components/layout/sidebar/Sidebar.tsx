import SidebarLogo from './SidebarLogo'
import SidebarAdmin from './SidebarAdmin'
import SidebarMainMenu from './SidebarMainMenu'

type SidebarProps = {
    isCollapsed : boolean;
}

export default function Sidebar({ isCollapsed } : SidebarProps) {
    const currentPath = window.location.pathname

    return (
        <aside
            className={`layout-sidebar ${isCollapsed ? 'layout-sidebar--collapsed w-[66px]' : 'layout-sidebar--expanded w-[219px]'} flex h-screen min-h-0 shrink-0 flex-col overflow-hidden border-r border-gray-300 bg-white transition-all duration-300 ease-in-out select-none dark:border-[#252525] dark:bg-[#151515]`}
            aria-label="Sidebar"
        >
            <SidebarLogo isCollapsed={isCollapsed} />

            <nav aria-label="Main navigation" className="flex-1 overflow-y-auto">
                <SidebarMainMenu isCollapsed={isCollapsed} currentPath={currentPath} />
                <SidebarAdmin isCollapsed={isCollapsed} currentPath={currentPath} />
            </nav>
        </aside>
    )
}
