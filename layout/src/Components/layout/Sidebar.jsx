import logo from '../../Assets/logo.png'
import peter from '../../Assets/peterparker.jpeg'
import { Activity, BadgeDollarSign, BookOpen, BriefcaseBusiness, CircleHelp, CreditCard, LayoutDashboard, LogOut, ShieldCheck, MoreHorizontal } from 'lucide-react'


const menuItems = [
    { label: 'Analytics', route: '/analytics', icon: Activity },
    { label: 'Workspace', route: '/workspace', icon: LayoutDashboard },
    { label: 'Resources', route: '/resources', icon: BriefcaseBusiness },
    { label: 'Payment', route: '/payment', icon: CreditCard },
    { label: 'Library', route: '/library', icon: BookOpen },
]

const admin = [
    { label: 'Subscription', route: '/subscription', icon: BadgeDollarSign },
    { label: 'App Security', route: '/app-security', icon: ShieldCheck },
    { label: 'Help & Docs', route: '/help-and-docs', icon: CircleHelp },
]

export default function Sidebar({ isCollapsed }){
    const currentPath = window.location.pathname

    return (
        <aside 
            className={`flex h-screen min-h-0 flex-col overflow-hidden ${isCollapsed ? 'w-[40px]' : 'w-[213px]'} shrink-0 border-r border-gray-300 transition-all duration-300 ease-in-out select-none`} 
            aria-label="Sidebar"
        >
            {/* Header / Logo Section */}
            <div className={`flex h-20 items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'}`}>
                <img src={logo} alt="Yatzar Manage logo" className={`shrink-0 object-contain ${isCollapsed ? 'h-[21px] w-[32px]' : 'h-[25px] w-[21px]'}`} />
                <span className={`text-[18px] font-medium tracking-normal text-gray-800 whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                    isCollapsed ? 'max-w-0 opacity-0 scale-90' : 'max-w-[180px] flex-none opacity-100 scale-100'
                }`}>
                    YATZAR MANAGE
                </span>
            </div>

            {/* Main Menu Section */}
            <div className="py-3">
                {isCollapsed ? (
                    <div className="flex justify-center py-1 text-gray-400" title="Main Menu">
                        <MoreHorizontal size={18} />
                    </div>
                ) : (
                    <p className="px-5 text-[10px] font-semibold uppercase tracking-wider text-[#BBBBBB] whitespace-nowrap overflow-hidden transition-all duration-300 leading-[18px]">
                        Main Menu
                    </p>
                )}
                
                <div className="mt-2 space-y-1 px-2">
                    {menuItems.map(({ label, route, icon: Icon }) => (
                        <a 
                            key={label} 
                            href={route}
                            aria-label={label} 
                            title={isCollapsed ? label : undefined} 
                            className={`flex w-full cursor-pointer items-center rounded-md py-2.5 text-left text-sm font-medium no-underline transition-colors ${
                                currentPath === route
                                    ? 'bg-[#008CD21A] text-[#008CD2] hover:bg-[#008CD21A] hover:text-[#008CD2]'
                                    : 'text-[#414141] hover:bg-gray-100 hover:text-black'
                            } ${
                                isCollapsed ? 'justify-center px-2' : 'gap-3 px-3'
                            }`}
                        >
                            <Icon size={18} strokeWidth={1.8} className="shrink-0" aria-hidden="true" />
                            <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out origin-left ${
                                isCollapsed ? 'max-w-0 opacity-0 scale-95' : 'max-w-[150px] opacity-100 scale-100'
                            }`}>
                                {label}
                            </span>
                        </a>
                    ))}
                </div>
            </div>

            {/* Admin Section */}
            <div className="py-3">
                {isCollapsed ? (
                    <div className="flex justify-center py-1 text-gray-400" title="Admin">
                        <MoreHorizontal size={18} />
                    </div>
                ) : (
                    <p className="px-5 text-[10px] font-semibold uppercase tracking-wider text-[#BBBBBB] whitespace-nowrap overflow-hidden transition-all duration-300 leading-[18px]">
                        Admin
                    </p>
                )}

                <div className="mt-2 space-y-1 px-2">
                    {admin.map(({ label, route, icon: Icon }) => (
                        <a 
                            key={label} 
                            href={route}
                            aria-label={label} 
                            title={isCollapsed ? label : undefined} 
                            className={`flex w-full cursor-pointer items-center rounded-md py-2.5 text-left text-sm font-medium no-underline transition-colors ${
                                currentPath === route
                                    ? 'bg-[#008CD21A] text-[#008CD2] hover:bg-[#008CD21A] hover:text-[#008CD2]'
                                    : 'text-[#414141] hover:bg-gray-100 hover:text-black'
                            } ${
                                isCollapsed ? 'justify-center px-2' : 'gap-3 px-3'
                            }`}
                        >
                            <Icon size={18} strokeWidth={1.8} className="shrink-0" aria-hidden="true" />
                            <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out origin-left ${
                                isCollapsed ? 'max-w-0 opacity-0 scale-95' : 'max-w-[150px] opacity-100 scale-100'
                            }`}>
                                {label}
                            </span>
                        </a>
                    ))}
                </div>
            </div>
            <div className={`mt-auto h-[48px] ${isCollapsed ? 'flex w-full justify-center pb-3' : 'w-[218px] p-3'}`}>
                <a
                    href="/logout"
                    aria-label="Log out Peter Parker"
                    title={isCollapsed ? 'Log out Peter Parker' : undefined}
                    className={`flex items-center rounded-md border border-gray-200 bg-white text-left no-underline shadow-sm transition-colors hover:bg-gray-100 hover:text-black cursor-pointer ${
                        isCollapsed ? 'h-[35px] w-[35px] justify-center' : 'w-full -translate-y-6 gap-3 p-1.5'
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