import { useEffect, useRef, useState } from 'react'
import {
  Bell,
  ChevronDown,
  ChevronUp,
  LogOut,
  MoreHorizontal,
  Moon,
  Search,
  Settings,
  Sun,
  UserRound,
} from 'lucide-react'
import { currentUser } from '../mock/profileMock'

type HeaderProps = {
  isDarkMode: boolean
  isSidebarOpen: boolean
  onToggleSidebar: () => void
  onToggleTheme: () => void
}

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------
function HeaderSearch() {
  return (
    <label className="layout-header-search flex h-[35px] w-[300px] max-w-[45vw] min-w-0 items-center gap-2 rounded-[6px] border-[0.5px] border-[#bbbbbb] bg-white px-2 text-black dark:border-[#303030] dark:bg-[#151515] dark:text-gray-100">
      <Search
        size={14}
        strokeWidth={1.8}
        aria-hidden="true"
      />

      <input
        type="search"
        placeholder="Search Projects, ..."
        aria-label="Search projects"
        className="min-w-0 flex-1 bg-transparent text-xs text-[#414141] outline-none placeholder:text-[#aeb0b4] dark:text-gray-100 dark:placeholder:text-gray-400"
      />

      <div className="shrink-0 items-center justify-center rounded-[2px] bg-white px-1.5 pt-0.5 text-[12px] leading-none text-[#aeb0b4] dark:border-[#3a3a3a] dark:bg-[#202020] dark:text-gray-300 sm:ml-auto sm:flex">
        ⌘K
      </div>
    </label>
  )
}

// ---------------------------------------------------------------------------
// Header action buttons — Theme + Notifications
// ---------------------------------------------------------------------------
function HeaderActions({
  isDarkMode,
  onToggleTheme,
  className = '',
}: {
  isDarkMode: boolean
  onToggleTheme: () => void
  className?: string
}) {
  const actionClassName =
    'shrink-0 cursor-pointer rounded-lg border-[0.5px] border-[#bbbbbb] p-1.5 text-black transition-colors hover:bg-gray-100 hover:text-black dark:border-[#303030] dark:bg-[#151515] dark:text-gray-100 dark:hover:bg-[#202020] dark:hover:text-white'

  return (
    <div className={`flex shrink-0 items-center gap-3 ${className}`}>
      <button
        type="button"
        onClick={onToggleTheme}
        aria-label={
          isDarkMode
            ? 'Switch to light theme'
            : 'Switch to dark theme'
        }
        className={actionClassName}
      >
        {isDarkMode ? (
          <Moon
            size={20}
            strokeWidth={1.2}
            aria-hidden="true"
          />
        ) : (
          <Sun
            size={20}
            strokeWidth={1.2}
            aria-hidden="true"
          />
        )}
      </button>

      <button
        type="button"
        aria-label="Notifications"
        className={`relative ${actionClassName}`}
      >
        <Bell
          size={20}
          strokeWidth={1.2}
          aria-hidden="true"
        />
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// User menu
// ---------------------------------------------------------------------------
function HeaderUser() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const closeUserMenu = (event: MouseEvent) => {
      if (!userMenuRef.current?.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    const closeUserMenuOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', closeUserMenu)
    document.addEventListener('keydown', closeUserMenuOnEscape)

    return () => {
      document.removeEventListener('mousedown', closeUserMenu)
      document.removeEventListener('keydown', closeUserMenuOnEscape)
    }
  }, [])

  return (
    <div
      ref={userMenuRef}
      className="layout-header-user relative shrink-0"
    >
      <button
        type="button"
        aria-expanded={isUserMenuOpen}
        aria-haspopup="menu"
        aria-label={`${isUserMenuOpen ? 'Close' : 'Open'} ${currentUser.name} menu`}
        onClick={() => setIsUserMenuOpen((isOpen) => !isOpen)}
        className="flex cursor-pointer items-center gap-2 rounded-lg p-1 transition-colors hover:bg-gray-100 dark:hover:bg-[#202020]"
      >
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="h-8.5 w-9 rounded-lg border border-[#808080] object-cover"
        />

        <span className="hidden text-left text-[14px] font-regular leading-none text-[#111111] dark:text-gray-100 sm:block">
          {currentUser.name}
        </span>

        {isUserMenuOpen ? (
          <ChevronUp
            size={21}
            strokeWidth={1.8}
            aria-hidden="true"
          />
        ) : (
          <ChevronDown
            size={21}
            strokeWidth={1.8}
            aria-hidden="true"
          />
        )}
      </button>

      {isUserMenuOpen && (
        <div
          role="menu"
          className="layout-user-menu absolute right-0 top-full mt-4 h-[220px] w-[210px] rounded-xl border border-[#d2d2d2] bg-white p-4 shadow-lg dark:border-[#303030] dark:bg-[#1d1d1d]"
        >
          <div className="border-b border-[#d2d2d2] px-1 pb-4 dark:border-[#404040]">
            <p className="text-[14px] font-semibold leading-tight text-[#404040] dark:text-gray-100">
              {currentUser.name}
            </p>

            <p className="mt-1 truncate text-[12px] font-semibold text-[#a3a3a3]">
              {currentUser.email}
            </p>
          </div>

          <div className="pt-2">
            <a
              href="/profile"
              role="menuitem"
              className="flex items-center gap-4 rounded-md px-2 py-2 text-[14px] text-[#404040] no-underline transition-colors hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-[#292929]"
            >
              <UserRound
                size={20}
                strokeWidth={1.5}
                aria-hidden="true"
              />

              Edit profile
            </a>

            <a
              href="/settings"
              role="menuitem"
              className="flex items-center gap-4 rounded-md px-2 py-2 text-[14px] text-[#404040] no-underline transition-colors hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-[#292929]"
            >
              <Settings
                size={20}
                strokeWidth={1.5}
                aria-hidden="true"
              />

              Settings
            </a>

            <a
              href={currentUser.logoutRoute}
              role="menuitem"
              className="mt-2 flex items-center gap-4 border-t border-[#d2d2d2] px-2 pt-4 text-[14px] text-[#404040] no-underline transition-colors hover:text-[#008CD2] dark:border-[#404040] dark:text-gray-100"
            >
              <LogOut
                size={20}
                strokeWidth={1.5}
                aria-hidden="true"
              />

              Logout
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sidebar toggle icon
// ---------------------------------------------------------------------------
function MenuIcon({
  isSidebarOpen,
}: {
  isSidebarOpen: boolean
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="21"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden="true"
    >
      <path
        className="layout-menu-icon-lines"
        d="M4 6h16M4 12h16M4 18h16"
      />

      <path
        className="layout-menu-icon-close"
        d="M5 5l14 14M19 5L5 19"
      />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Main Header
// ---------------------------------------------------------------------------
export default function Header({
  isDarkMode,
  isSidebarOpen,
  onToggleSidebar,
  onToggleTheme,
}: HeaderProps) {
  const [isMobileActionsOpen, setIsMobileActionsOpen] =
    useState(false)

  return (
    <header className="layout-header relative flex h-[65px] items-center justify-between border-b border-gray-300 bg-white px-4 transition-colors dark:border-[#292929] dark:bg-[#090909]">
      {/* Left section */}
      <div className="layout-header-primary flex min-w-0 flex-1 items-center gap-5">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          aria-expanded={isSidebarOpen}
          className="layout-header-menu cursor-pointer rounded-md border-[0.5px] border-[#bbbbbb] bg-white p-1.5 text-gray-800 transition-colors hover:bg-gray-100 hover:text-black dark:border-[#303030] dark:bg-[#151515] dark:text-gray-100 dark:hover:bg-[#202020] dark:hover:text-white"
        >
          <MenuIcon isSidebarOpen={isSidebarOpen} />
        </button>

        <HeaderSearch />
      </div>

      {/* Desktop actions */}
      <div className="layout-header-desktop-actions flex items-center">
        <HeaderActions
          isDarkMode={isDarkMode}
          onToggleTheme={onToggleTheme}
          className="layout-header-actions mr-3"
        />

        <HeaderUser />
      </div>

      {/* Mobile actions button */}
      <button
        type="button"
        aria-label="Show header actions"
        aria-expanded={isMobileActionsOpen}
        onClick={() =>
          setIsMobileActionsOpen((isOpen) => !isOpen)
        }
        className="layout-header-more cursor-pointer rounded-md border-[0.5px] border-[#bbbbbb] bg-white p-1.5 text-gray-800 transition-colors hover:bg-gray-100 hover:text-black dark:border-[#303030] dark:bg-[#151515] dark:text-gray-100 dark:hover:bg-[#202020] dark:hover:text-white"
      >
        <MoreHorizontal
          size={20}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </button>

      {/* Mobile dropdown */}
      {isMobileActionsOpen && (
        <div className="layout-header-mobile-actions">
          <HeaderSearch />

          <HeaderActions
            isDarkMode={isDarkMode}
            onToggleTheme={onToggleTheme}
          />

          <HeaderUser />
        </div>
      )}
    </header>
  )
}