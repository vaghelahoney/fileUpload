
"use client";

import { Bell, Search, Menu } from "lucide-react";

interface HeaderProps {
  title: string;
  notificationCount?: number;
  onMenuClick: () => void;
}

export default function Header({
  title,
  notificationCount = 3,
  onMenuClick
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-[--color-border] px-4 md:px-8 py-4 md:py-5 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-[--color-text] text-lg md:text-2xl truncate max-w-[200px] md:max-w-none">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Desktop Search */}
        <div className="relative hidden md:block">
          <Search className="w-5 h-5 text-[--color-text-secondary] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2.5 border border-[--color-border] rounded-xl w-64 lg:w-80 focus:outline-none focus:ring-2 focus:ring-[--color-primary] focus:border-[--color-primary] bg-[--color-bg-light] text-sm transition-all"
          />
        </div>

        {/* Mobile Search */}
        <button className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
          <Search className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <button className="relative p-2 md:p-2.5 hover:bg-[--color-bg-light] rounded-xl transition-colors">
          <Bell className="w-5 h-5 md:w-6 md:h-6 text-[--color-text]" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 md:w-5 md:h-5 bg-[--color-primary] text-white rounded-full flex items-center justify-center text-[10px] md:text-xs shadow-md">
              {notificationCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

