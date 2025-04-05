import React from 'react';
import {
    SidebarGroup,
    SidebarGroupContent, SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuSkeleton
} from "@/components/ui/sidebar";

const AppSidebarLinkSkeleton = () => {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>
                Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {Array.from({length: 8}).map((_, index) => (
                        <SidebarMenuItem key={index}>
                            <SidebarMenuSkeleton showIcon/>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
};

export default AppSidebarLinkSkeleton;