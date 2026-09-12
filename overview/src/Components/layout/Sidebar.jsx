import logo from '../../Assets/logo.png'
import peter from '../../Assets/peterparker.jpeg'
import { ArrowLeft, Banknote, BriefcaseBusiness, CalendarDays, Camera, Clock3, Compass, Folder, LayoutGrid, LogOut, MoreHorizontal, ScanFace, Users } from 'lucide-react'


const navigationGroups = [
    { label: 'Project', items: [
        { label: 'Analystic', route: '/analytics', icon: LayoutGrid },
        { label: 'Team', route: '/team', icon: Users },
        { label: 'Documents', route: '/documents', icon: Folder },
    ] },
    { label: 'Define', items: [
        { label: 'Scope', route: '/scope', icon: Compass },
        { label: 'Model', route: '/model', icon: ScanFace },
        { label: 'Site Capture', route: '/site-capture', icon: Camera },
    ] },
    { label: 'Coordinate', items: [{ label: 'Meetings', route: '/meetings', icon: CalendarDays }] },
    { label: 'Plan', items: [
        { label: 'Quantities', route: '/quantities', icon: BriefcaseBusiness },
        { label: 'Estimate', route: '/estimate', icon: Banknote },
        { label: 'Programme', route: '/programme', icon: Clock3 },
    ] },
]

export default function Sidebar({ isCollapsed }){
    const currentPath = window.location.pathname

    return (
        <aside 
            className={`flex h-screen min-h-0 flex-col overflow-hidden ${isCollapsed ? 'w-[40px]' : 'w-[213px]'} shrink-0 border-r border-gray-300 bg-white transition-all duration-300 ease-in-out select-none`} 
            aria-label="Sidebar"
        >
            {/* Header / Logo Section */}
            <a href="/" aria-label="Yatzar Manage home" className={`flex h-20 items-center no-underline ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'}`}>
                <img src={logo} alt="Yatzar Manage logo" className={`shrink-0 object-contain ${isCollapsed ? 'h-[21px] w-[21px]' : 'h-[25px] w-[21px]'}`} />
                <span className={`text-[18px] font-medium tracking-normal text-gray-800 whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                    isCollapsed ? 'max-w-0 opacity-0 scale-90' : 'max-w-[180px] flex-none opacity-100 scale-100'
                }`}>
                    YATZAR MANAGE
                </span>
            </a>

            <nav aria-label="Project navigation" className="flex-1 overflow-y-auto">
                {navigationGroups.map(({ label: groupLabel, items }) => (
                    <div key={groupLabel} className={`py-1 ${isCollapsed ? 'px-0' : 'px-2'}`}>
                        <p className={`px-2 text-[10px] font-medium uppercase tracking-wide text-[#BBBBBB] whitespace-nowrap overflow-hidden transition-all duration-300 leading-[16px] ${isCollapsed ? 'flex justify-center' : ''}`}>
                            {isCollapsed ? <MoreHorizontal size={18} strokeWidth={1.8} className="text-gray-800" aria-hidden="true" /> : groupLabel}
                        </p>
                        <div className={`mt-0.5 space-y-[3px] ${isCollapsed ? 'px-0' : 'px-1'}`}>
                    {items.map(({ label, route, icon: Icon }) => (
                        <a 
                            key={label} 
                            href={route}
                            aria-label={label} 
                            title={isCollapsed ? label : undefined} 
                            className={`flex w-full cursor-pointer items-center rounded-md py-1.5 px-4 text-left text-[14px] font-medium no-underline transition-colors ${
                                currentPath === route
                                    ? 'bg-[#008CD21A] text-[#008CD2] hover:bg-[#008CD21A] hover:text-[#008CD2]'
                                    : 'text-[#414141] hover:bg-gray-100 hover:text-black'
                            } ${
                                isCollapsed ? 'justify-center px-0' : 'gap-3 px-2'
                            }`}
                        >
                            <Icon size={18} strokeWidth={1.8} className="shrink-0" aria-hidden="true" />
                            <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out origin-left ${
                                isCollapsed ? 'max-w-0 opacity-0 scale-95' : 'max-w-[120px] opacity-100 scale-100'
                            }`}>
                                {label}
                            </span>
                        </a>
                    ))}
                        </div>
                    </div>
                ))}
            </nav>

            <div className={`${isCollapsed ? 'flex w-full justify-center pb-2 pt-2' : 'px-2 pb-2 pt-1'}`}>
                <a href="/workspace" aria-label="Back to Workspace" title={isCollapsed ? 'Back to Workspace' : undefined} className={`flex items-center gap-2 rounded-md py-3 text-[14px] text-[#414141] no-underline transition-colors hover:bg-gray-100 hover:text-black ${isCollapsed ? 'justify-center px-2' : 'px-2'}`}>
                    <ArrowLeft size={18} strokeWidth={1.8} aria-hidden="true" />
                    <span className={isCollapsed ? 'hidden' : ''}>Back to Workspace</span>
                </a>
            </div>
            <div className={`mt-auto ${isCollapsed ? 'flex w-full justify-center pb-3' : 'w-full px-2 pb-2'}`}>
                            <a
                                href="/logout"
                                aria-label="Log out Peter Parker"
                                title={isCollapsed ? 'Log out Peter Parker' : undefined}
                                className={`flex items-center rounded-md border border-gray-200 bg-white text-left no-underline shadow-sm transition-colors hover:bg-gray-100 hover:text-black cursor-pointer ${
                                    isCollapsed ? 'h-[28px] w-[28px] justify-center' : 'w-full gap-3 p-1.5'
                                }`}
                            >
                                <img
                                    src={peter}
                                    alt="Peter Parker"
                                    className={`shrink-0 rounded object-cover ${isCollapsed ? 'h-[23px] w-[23px]' : 'h-[35px] w-[35px]'}`}
                                />
                                <span className={`min-w-0 flex-1 overflow-hidden transition-all duration-300 ease-in-out ${
                                    isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[140px] opacity-100'
                                }`}>
                                    <span className="block truncate text-[14px] font-semibold text-gray-700">Peter Parker</span>
                                    <span className="mt-0.5 block truncate text-[10px] font-normal text-gray-400">Administration</span>
                                </span>
                                <LogOut
                                    size={24}
                                    strokeWidth={1.8}
                                    className={`shrink-0 text-[#ff5a63] ${isCollapsed ? 'hidden' : ''}`}
                                    aria-hidden="true"
                                />
                            </a>
                        </div>   
        </aside>
    );
}