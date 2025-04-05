// DashboardLayout
import TopBar from "@/app/(dashboard)/_components/topbar/TopBar";
import React, {Suspense} from "react";
import Loading from "@/app/(dashboard)/loading";
import {SidebarProvider} from "@/components/ui/sidebar";
import {AppSidebar} from "@/app/(dashboard)/_components/sidebar/app-sidebar";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "PMS",
    description: "Patient Management System",
};

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider className="h-screen w-screen flex overflow-hidden">
            <AppSidebar/>
            <main className="flex flex-col flex-1 overflow-hidden">
                <TopBar/>
                <Suspense fallback={<Loading/>}>
                    <div className="flex-1 overflow-auto">{children}</div>
                </Suspense>
            </main>
        </SidebarProvider>
    );
}
