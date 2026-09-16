import SidebarLogo from './SidebarLogo'
import SidebarAdmin from './SidebarAdmin'
import SidebarMainMenu from './SidebarMainMenu'
import SidebarUserFooter from './SidebarUserFooter'

export default function Sidebar({ isCollapsed }) {
    const currentPath = window.location.pathname

    return (
        <aside
            className={`layout-sidebar ${isCollapsed ? 'layout-sidebar--collapsed w-[40px]' : 'layout-sidebar--expanded w-[213px]'} flex h-screen min-h-0 shrink-0 flex-col overflow-hidden border-r border-gray-300 bg-white transition-all duration-300 ease-in-out select-none dark:border-[#252525] dark:bg-[#151515]`}
            aria-label="Sidebar"
        >
            <SidebarLogo isCollapsed={isCollapsed} />

            <nav aria-label="Main navigation" className="flex-1 overflow-y-auto">
                <SidebarMainMenu isCollapsed={isCollapsed} currentPath={currentPath} />
                <SidebarAdmin isCollapsed={isCollapsed} currentPath={currentPath} />
            </nav>

            <SidebarUserFooter isCollapsed={isCollapsed} />
        </aside>
    )
}
