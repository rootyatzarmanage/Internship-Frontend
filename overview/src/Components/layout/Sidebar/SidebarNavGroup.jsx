import { MoreHorizontal } from 'lucide-react'

export default function SidebarNavGroup({ label: groupLabel, items, isCollapsed, currentPath }) {
    return (
        <div className="py-1 px-2">
            <p
                className={`px-2 text-[12px] font-medium uppercase tracking-wide text-[#BBBBBB] whitespace-nowrap overflow-hidden transition-all duration-300 leading-[16px] ${isCollapsed ? 'flex justify-center' : ''}`}
            >
                {isCollapsed ? (
                    <MoreHorizontal size={18} strokeWidth={1.8} className="text-gray-800" aria-hidden="true" />
                ) : (
                    groupLabel
                )}
            </p>
            <div className={`mt-2 space-y-[8px] ${isCollapsed ? 'px-0' : 'px-4'}`}>
                {items.map(({ label, route, icon: Icon }) => (
                    <a
                        key={label}
                        href={route}
                        aria-label={label}
                        title={isCollapsed ? label : undefined}
                        className={`flex w-full cursor-pointer items-center rounded-md py-1.5 text-left text-[16px] font-regular no-underline transition-colors ${
                            currentPath === route
                                ? '!bg-[#008CD21A] !text-[#008CD2] hover:!bg-[#008CD21A] hover:!text-[#008CD2]'
                                : 'text-[#414141] hover:bg-gray-100 hover:text-black dark:text-gray-300 dark:hover:bg-[#242424] dark:hover:text-white'
                        } ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-2'}`}
                    >
                        <Icon size={25} strokeWidth={1.4} className="shrink-0" aria-hidden="true" />
                        <span
                            className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out origin-left ${
                                isCollapsed ? 'max-w-0 opacity-0 scale-95' : 'max-w-[150px] opacity-100 scale-100'
                            }`}
                        >
                            {label}
                        </span>
                    </a>
                ))}
            </div>
        </div>
    )
}
