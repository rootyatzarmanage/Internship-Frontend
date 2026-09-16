import { Search } from 'lucide-react'

export default function HeaderSearch() {
    return (
        <label className="flex h-[35px] w-[300px] max-w-[45vw] min-w-0 items-center gap-2 rounded-[6px] border-[0.5px] border-[#bbbbbb] bg-white px-2 text-black dark:border-[#303030] dark:bg-[#151515] dark:text-gray-100">
            <Search size={14} strokeWidth={1.8} aria-hidden="true" />
            <input
                type="search"
                placeholder="Search Projects, ..."
                aria-label="Search projects"
                className="min-w-0 flex-1 bg-transparent text-xs text-[#414141] outline-none placeholder:text-[#aeb0b4] dark:text-gray-100 dark:placeholder:text-gray-400"
            />
            <div className="shrink-0 items-center justify-center rounded-[2px] bg-white px-1.5 pt-0.5 text-[12px] leading-none text-[#aeb0b4] dark:border-[#3a3a3a] dark:bg-[#151515] dark:text-gray-300 sm:ml-auto sm:flex">
                ⌘K
            </div>
        </label>
    )
}