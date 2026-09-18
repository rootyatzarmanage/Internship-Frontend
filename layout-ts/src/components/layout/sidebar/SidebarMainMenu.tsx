import { menuItems } from '../../../config/navigation.ts'
import SidebarNavSection from './SidebarNavSection'

type NavSectionProps = {
    isCollapsed : boolean;
    currentPath : string;
}

export default function SidebarMainMenu({ isCollapsed, currentPath } : NavSectionProps) {
    return (
        <SidebarNavSection
            title="Main Menu"
            items={menuItems}
            isCollapsed={isCollapsed}
            currentPath={currentPath}
        />
    )
}
