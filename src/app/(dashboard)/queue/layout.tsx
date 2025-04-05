import React from "react";
import TopBar from "@/app/(dashboard)/queue/_components/TopBar";

export default function Layout({
                                   children,
                               }: {
    children: React.ReactNode;
}) {
    return (
        <div className={'flex flex-col overflow-hidden h-full'}>
            {/* Top Bar */}
            <TopBar/>
            {children}
        </div>
    )
}