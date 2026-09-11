import logo from '../Assets/logo.png'
import peter from '../Assets/peterparker.jpeg'
import { Activity, BadgeDollarSign, BookOpen, BriefcaseBusiness, CircleHelp, CreditCard, LayoutDashboard, LogOut, ShieldCheck, MoreHorizontal } from 'lucide-react'


const menuItems = [
    { label: 'Analytics', icon: Activity },
    { label: 'Workspace', icon: LayoutDashboard },
    { label: 'Resources', icon: BriefcaseBusiness },
    { label: 'Payment', icon: CreditCard },
    { label: 'Library', icon: BookOpen },
]

const admin = [
    { label: 'Subscription', icon: BadgeDollarSign },
    { label: 'App Security', icon: ShieldCheck },
    { label: 'Help & Docs', icon: CircleHelp },
]

export default function Sidebar({ isCollapsed }){
    return (
        <aside 
            className={`flex flex-col ${isCollapsed ? 'w-20' : 'w-60'} min-h-screen shrink-0 border-r border-gray-300 transition-all duration-300 ease-in-out select-none`} 
            aria-label="Sidebar"
        >
            {/* Header / Logo Section */}
            <div className={`flex h-20 items-center px-4 ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                <img src={logo} alt="Yatzar Manage logo" className="h-7 w-7 shrink-0 object-contain" />
                <span className={`text-lg font-medium tracking-wide text-gray-800 whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                    isCollapsed ? 'max-w-0 opacity-0 scale-90' : 'max-w-[180px] opacity-100 scale-100'
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
                    <p className="px-5 text-xs font-semibold uppercase tracking-wider text-gray-400 whitespace-nowrap overflow-hidden transition-all duration-300">
                        Main Menu
                    </p>
                )}
                
                <div className="mt-2 space-y-1 px-2">
                    {menuItems.map(({ label, icon: Icon }) => (
                        <button 
                            key={label} 
                            type="button" 
                            aria-label={label} 
                            title={isCollapsed ? label : undefined} 
                            className={`flex w-full items-center rounded-md py-2.5 text-left text-regular font-medium text-black transition-colors hover:bg-blue-50 hover:text-blue-600 ${
                                isCollapsed ? 'justify-center px-2' : 'gap-3 px-3'
                            }`}
                        >
                            <Icon size={22} strokeWidth={1.8} className="shrink-0" aria-hidden="true" />
                            <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out origin-left ${
                                isCollapsed ? 'max-w-0 opacity-0 scale-95' : 'max-w-[150px] opacity-100 scale-100'
                            }`}>
                                {label}
                            </span>
                        </button>
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
                    <p className="px-5 text-xs font-semibold uppercase tracking-wider text-gray-400 whitespace-nowrap overflow-hidden transition-all duration-300">
                        Admin
                    </p>
                )}

                <div className="mt-2 space-y-1 px-2">
                    {admin.map(({ label, icon: Icon }) => (
                        <button 
                            key={label} 
                            type="button" 
                            aria-label={label} 
                            title={isCollapsed ? label : undefined} 
                            className={`flex w-full items-center rounded-md py-2.5 text-left text-regular font-medium text-black transition-colors hover:bg-blue-50 hover:text-blue-600 ${
                                isCollapsed ? 'justify-center px-2' : 'gap-3 px-3'
                            }`}
                        >
                            <Icon size={22} strokeWidth={1.8} className="shrink-0" aria-hidden="true" />
                            <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out origin-left ${
                                isCollapsed ? 'max-w-0 opacity-0 scale-95' : 'max-w-[150px] opacity-100 scale-100'
                            }`}>
                                {label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
            <div className="mt-auto p-3">
                <button
                    type="button"
                    aria-label="Log out Peter Parker"
                    title={isCollapsed ? 'Log out Peter Parker' : undefined}
                    className={`flex w-full items-center rounded-2xl border border-gray-200 bg-white text-left shadow-sm transition-colors hover:bg-blue-50 cursor-pointer ${
                        isCollapsed ? 'justify-center p-2' : 'gap-3 px-3 py-3'
                    }`}
                >
                    <img
                        src={peter}
                        alt="Peter Parker"
                        className={`shrink-0 rounded-xl object-cover ${isCollapsed ? 'h-10 w-10' : 'h-12 w-12'}`}
                    />
                    <span className={`min-w-0 flex-1 overflow-hidden transition-all duration-300 ease-in-out ${
                        isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[140px] opacity-100'
                    }`}>
                        <span className="block truncate text-sm font-semibold text-gray-700">Peter Parker</span>
                        <span className="mt-0.5 block truncate text-xs font-normal text-gray-400">Administration</span>
                    </span>
                    <LogOut
                        size={25}
                        strokeWidth={1.8}
                        className={`shrink-0 text-[#ff5a63] ${isCollapsed ? 'hidden' : ''}`}
                        aria-hidden="true"
                    />
                </button>
            </div>   
        </aside>
    );
}