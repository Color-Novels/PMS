import React from 'react';
import {verifySession} from "@/app/lib/sessions";
import AppSidebarLinks from "@/app/(dashboard)/_components/sidebar/app-sidebar-links";

const AppSidebarLinksWrapper = async () => {
    const session = await verifySession();

    return (
        <AppSidebarLinks role={session.role}/>
    );
};

export default AppSidebarLinksWrapper;