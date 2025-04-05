import React from "react";
import TopCard from "@/app/(dashboard)/patients/[id]/_components/TopCard";

import {Metadata} from "next";

export const metadata: Metadata = {
    title: "PMS - Patient Profile",
    description: "View and manage patient profile.",
};

export default async function Layout({
                                         children, params
                                     }: {
    children: React.ReactNode,
    params: Promise<{ id: string }>
}) {
    const id = parseInt((await params).id);

    return (
        <div className={'flex flex-col flex-1 p-4 gap-4 overflow-y-auto h-full w-full'}>
            <TopCard id={id}/>
            {children}
        </div>
    )
}