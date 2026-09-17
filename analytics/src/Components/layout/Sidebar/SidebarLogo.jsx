import logo from '../../../assets/logo.png'

export default function SidebarLogo({ isCollapsed }) {
    return (
        <a
            href="/"
            aria-label="Yatzar Manage home"
            className={`flex h-20 items-center no-underline ${isCollapsed ? 'justify-center px-0' : 'gap-2 px-3'}`}
        >
            <img
                src={logo}
                alt="Yatzar Manage logo"
                className={`shrink-0 object-contain dark:brightness-0 dark:invert ${isCollapsed ? 'h-[30px] w-[36px]' : 'h-[30px] w-[36px]'}`}
            />
            <span
                className={`pl-0 whitespace-nowrap overflow-hidden text-[18px] font-medium tracking-normal text-black transition-all duration-300 ease-in-out dark:text-gray-100 ${
                    isCollapsed ? 'max-w-0 opacity-0 scale-90' : 'max-w-[180px] flex-none opacity-100 scale-100'
                }`}
            >
                YATZAR MANAGE
            </span>
        </a>
    )
}
