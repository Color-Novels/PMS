import React from "react";
import BatchTopBar from "@/app/(dashboard)/inventory/available-stocks/_components/BatchTopBar";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={'flex flex-col w-full'}>
            <BatchTopBar/>
            {children}
        </div>
    )
}