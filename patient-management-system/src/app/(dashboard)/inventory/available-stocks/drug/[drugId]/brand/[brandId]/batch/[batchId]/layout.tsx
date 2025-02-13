import React from "react";
import BatchTopBar from "@/app/(dashboard)/inventory/available-stocks/_components/BatchTopBar";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={'flex flex-col h-full w-full'}>
            <BatchTopBar
            batchId= {5}
            />
            {children}
        </div>
    )
}