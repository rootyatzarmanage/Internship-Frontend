import logo from '../Assets/logo.png'
import { Activity, BadgeDollarSign, BookOpen, BriefcaseBusiness, CircleHelp, CreditCard, LayoutDashboard, ShieldCheck } from 'lucide-react'

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

export default function Sidebar(){
    return (
        <aside className="min-h-screen w-60 border-r border-gray-300" aria-label="Sidebar">
            <div className="flex h-16 items-center gap-3 px-5">
                <img src={logo} alt="Yatzar Manage logo" className="h-7 w-7 object-contain" />
                <span className="text-lg font-medium tracking-wide text-gray-800">YATZAR MANAGE</span>
            </div>
            <div className="py-3">
                <p className="text-sm text-gray-400 px-5">MAIN MENU</p>
                <div className="mt-2 space-y-1">
                    {menuItems.map(({ label, icon: Icon }) => (
                        <button key={label} type="button" className="flex w-full items-center gap-3 px-5 py-2.5 text-left text-sm text-black">
                            <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
                            <span>{label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="py-3">
                <p className="text-sm text-gray-400 px-5">ADMIN</p>
                <div className="mt-2 space-y-1">
                    {admin.map(({ label, icon: Icon }) => (
                            <button key={label} type="button" className="flex w-full items-center gap-3 px-5 py-2.5 text-left text-sm text-black">
                            <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
                            <span>{label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </aside>
    );
}