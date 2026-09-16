import { ArrowLeft } from 'lucide-react'

export default function SidebarBackLink({ isCollapsed }) {
    return (
        <div className={`${isCollapsed ? 'flex w-full justify-center pb-2 pt-2' : 'px-2 pb-2 pt-1'}`}>
            <a
                href="/workspace"
                aria-label="Back to Workspace"
                title={isCollapsed ? 'Back to Workspace' : undefined}
                className={`flex items-center gap-2 rounded-md py-3 text-[14px] text-[#414141] no-underline transition-colors hover:bg-gray-100 hover:text-black ${
                    isCollapsed ? 'justify-center px-2' : 'px-2'
                }`}
            >
                <ArrowLeft size={18} strokeWidth={1.8} aria-hidden="true" />
                <span className={isCollapsed ? 'hidden' : ''}>Back to Workspace</span>
            </a>
        </div>
    )
}
