import { menuItems } from '../../../config/navigation'
import SidebarNavSection from './SidebarNavSection'

export default function SidebarMainMenu({ isCollapsed, currentPath }) {
    return (
        <SidebarNavSection
            title="Main Menu"
            items={menuItems}
            isCollapsed={isCollapsed}
            currentPath={currentPath}
        />
    )
}
