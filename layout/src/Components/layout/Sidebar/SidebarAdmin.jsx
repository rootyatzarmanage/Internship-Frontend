import { adminItems } from '../../../config/navigation'
import SidebarNavSection from './SidebarNavSection'

export default function SidebarAdmin({ isCollapsed, currentPath }) {
    return (
        <SidebarNavSection
            title="Admin"
            items={adminItems}
            isCollapsed={isCollapsed}
            currentPath={currentPath}
        />
    )
}
