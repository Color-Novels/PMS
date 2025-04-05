import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader, SidebarSeparator
} from "@/components/ui/sidebar"
import {Stethoscope} from 'lucide-react';
import {Suspense} from "react";
import AppSidebarLinksWrapper from "@/app/(dashboard)/_components/sidebar/app-sidebar-links-wrapper";
import AppSidebarLinkSkeleton from "@/app/(dashboard)/_components/sidebar/app-sidebar-link-skeleton";
import Link from "next/link";

export async function AppSidebar() {
    return (
        <Sidebar className="h-full">
            <SidebarHeader className="p-4">
                <Link className="flex items-center space-x-3" href={"/"}>
                    <div className="bg-primary p-2 rounded-md">
                        <Stethoscope className="h-6 w-6 text-primary-foreground"/>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">MediPanel</h2>
                        <p className="text-sm">Thoduwawa Medical Center</p>
                    </div>
                </Link>
            </SidebarHeader>
            <SidebarSeparator/>
            <SidebarContent>
                <Suspense fallback={<AppSidebarLinkSkeleton/>}>
                    <AppSidebarLinksWrapper/>
                </Suspense>

            </SidebarContent>
            <SidebarSeparator/>
            <SidebarFooter className="p-4">
                <p className="text-xs text-center">
                    © 2025 ColorNovels
                </p>
            </SidebarFooter>
        </Sidebar>
    )
}