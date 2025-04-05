import React from "react";
import BatchTopBar from "@/app/(dashboard)/inventory/available-stocks/_components/BatchTopBar";

export default function Layout({
                                   children,
                               }: {
    children: React.ReactNode;
}) {
    return (
        <div className={'flex flex-col h-full w-full'}>
            <div className="flex-none bg-white border-b border-primary-900/25 shadow z-10  py-2 px-4">
                <BatchTopBar/>
            </div>
            {children}
        </div>
    )
}