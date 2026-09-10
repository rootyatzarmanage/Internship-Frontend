import { Bell, Menu, Search, Settings, Sun } from 'lucide-react'

export default function Header(){
    return(
        <header className="flex h-15 items-center justify-between border-b border-gray-300 px-4">
            <div className="flex items-center gap-5">
                <button type="button" aria-label="Toggle sidebar" className="rounded border border-gray-200 p-1.5 text-gray-600">
                    <Menu size={16} strokeWidth={1.8} aria-hidden="true" />
                </button>
                <label className="flex h-7 w-52 items-center gap-2 rounded border border-gray-200 px-2 text-gray-500">
                    <Search size={14} strokeWidth={1.8} aria-hidden="true" />
                    <input type="search" placeholder="Search Projects, ..." aria-label="Search projects" className="min-w-0 flex-1 bg-transparent text-xs text-gray-800 outline-none placeholder:text-gray-400" />
                    <span className="text-[10px] text-gray-400">⌘K</span>
                </label>
            </div>
            <div className="flex items-center gap-3">
                <button type="button" aria-label="Toggle theme" className="rounded border border-gray-200 p-1.5 text-gray-600">
                    <Sun size={15} strokeWidth={1.7} aria-hidden="true" />
                </button>
                <button type="button" aria-label="Settings" className="rounded border border-gray-200 p-1.5 text-gray-600">
                    <Settings size={15} strokeWidth={1.7} aria-hidden="true" />
                </button>
                <button type="button" aria-label="Notifications" className="relative rounded border border-gray-200 p-1.5 text-gray-600">
                    <Bell size={15} strokeWidth={1.7} aria-hidden="true" />
                </button>
            </div>
        </header>
    );
}