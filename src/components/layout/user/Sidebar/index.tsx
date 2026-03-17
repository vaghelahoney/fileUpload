"use client";

import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import image_ from "public/images/icsLogo.png";
import ROUTES from "@/route/Route";
import UserInfo from "./UserInfo";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
  user?: any;
}

export default function Sidebar({
  activeTab,
  onTabChange,
  isOpen,
  onClose,
  user
}: SidebarProps) {
  const menuItems = [
    {
      id: "dashboard",
      label: ROUTES.dashboard.label,
      icon: ROUTES.dashboard.icon,
      href: ROUTES.dashboard.url(),
    },
    {
      id: "fileStorage",
      label: ROUTES.fileStorage.label,
      icon: ROUTES.fileStorage.icon,
      href: ROUTES.fileStorage.url(),
    },

  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          w-72 bg-white h-screen fixed left-0 top-0 flex flex-col shadow-xl 
          border-r border-gray-200 z-50 transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Logo section */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center justify-center">
            <Link href="/dashboard">
              <Image
                src={image_}
                alt="ICS Canada Logo"
                width={160}
                height={80}
                className="object-contain"
              />
            </Link>
          </div>

          {/* Close for mobile */}
          <button
            onClick={onClose}
            className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onClick={() => onTabChange(item.id)}
                    className={`
                      w-full flex items-center gap-4 px-4 py-3.5 rounded-xl 
                      transition-all duration-200
                      ${isActive
                        ? "bg-[#e23a41] text-white shadow-lg shadow-[#e23a41]/40"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }
                    `}
                  >
                    <Icon
                      className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-600"
                        }`}
                    />
                    <span className={`text-sm`}>{item.label}</span>

                    {isActive && (
                      <div className="ml-auto">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info */}
        <UserInfo user={user} />

      </aside>
    </>
  );
}
