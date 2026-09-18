import { adminItems } from '../../../config/navigation.ts'
import SidebarNavSection from './SidebarNavSection'

type AdminProps = {
    isCollapsed : boolean;
    currentPath : string;
}

export default function SidebarAdmin({ isCollapsed, currentPath } : AdminProps) {
    return (
        <SidebarNavSection
            title="Admin"
            items={adminItems}
            isCollapsed={isCollapsed}
            currentPath={currentPath}
        />
    )
}
