import { Bell, Menu, Search, Settings, Sun } from 'lucide-react'

export default function Header({ onToggleSidebar }){
    return(
        <header className="overview-header flex h-[36px] items-center justify-between border-b border-gray-300 bg-white px-4">
            <div className="flex min-w-0 flex-1 items-center gap-5">
                <button 
                    type="button" 
                    onClick={onToggleSidebar}
                    aria-label="Toggle sidebar" 
                    className="cursor-pointer rounded-md border-[0.5px] border-[#bbbbbb] bg-white p-1.5 text-black transition-colors hover:bg-gray-50 hover:text-black"
                >
                    <Menu size={9.5} strokeWidth={1.8} aria-hidden="true" />
                </button>
                <label className="flex h-[23px] w-[260px] max-w-[45vw] min-w-0 items-center gap-2 rounded-[4px] border-[0.5px] border-[#bbbbbb] bg-white px-2 text-black">
                    <Search size={14} strokeWidth={1.8} aria-hidden="true" />
                    <input type="search" placeholder="Search Projects, ..." aria-label="Search projects" className="min-w-0 flex-1 bg-transparent text-xs text-[#414141] outline-none placeholder:text-[#aeb0b4]" />
                    <div className="hidden h-[16px] min-w-[20px] shrink-0 items-center justify-center rounded-[2px] border border-[#9f9f9f] bg-white px-1.5 pt-0.5 text-[10px] leading-none text-[#aeb0b4] sm:ml-auto sm:flex">⌘K</div>
                </label>
            </div>
            <div className="flex shrink-0 items-center gap-3">
                <button type="button" aria-label="Light theme" className="shrink-0 cursor-pointer rounded-lg border-[0.5px] border-[#bbbbbb] p-1.5 text-black transition-colors hover:bg-gray-100 hover:text-black">
                    <Sun size={12} strokeWidth={1.7} aria-hidden="true" />
                </button>
                <button type="button" aria-label="Settings" className="shrink-0 cursor-pointer rounded-lg border-[0.5px] border-[#bbbbbb] p-1.5 text-black transition-colors hover:bg-gray-100 hover:text-black">
                    <Settings size={12} strokeWidth={1.7} aria-hidden="true" />
                </button>
                <button type="button" aria-label="Notifications" className="relative shrink-0 cursor-pointer rounded-lg border-[0.5px] border-[#bbbbbb] p-1.5 text-black transition-colors hover:bg-gray-100 hover:text-black">
                    <Bell size={12} strokeWidth={1.7} aria-hidden="true" />
                </button>
            </div>
        </header>
    );
}