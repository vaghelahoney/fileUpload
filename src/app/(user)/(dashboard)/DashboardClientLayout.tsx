"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/user/Header";
import Sidebar from "@/components/layout/user/Sidebar";
import ROUTES from "@/route/Route";

export default function DashboardClientLayout({
    children,
    user
}: {
    children: React.ReactNode;
    user: any;
}) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const activeTab = pathname?.split("/")[1] || "dashboard";

    const handleTabChange = () => {
        setIsSidebarOpen(false);
    };

    const getPageTitle = () => {
        return ROUTES[activeTab as keyof typeof ROUTES]?.label || "Dashboard";
    };

    return (
        <div className="min-h-screen bg-[--color-bg-light]">
            <Sidebar
                activeTab={activeTab}
                onTabChange={handleTabChange}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                user={user}
            />

            {/* MAIN SECTION */}
            <div className="md:ml-72 min-h-screen flex flex-col transition-all duration-300">
                <Header
                    title={getPageTitle()}
                    notificationCount={5}
                    onMenuClick={() => setIsSidebarOpen(true)}
                />
                <main className="flex-1 p-4 md:p-8 overflow-x-hidden">{children}</main>
            </div>
        </div>
    );
}
