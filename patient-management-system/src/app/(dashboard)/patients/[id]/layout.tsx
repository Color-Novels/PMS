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
        <div className={'flex flex-col p-4 h-full gap-4 overflow-y-auto'}>
            <TopCard id={id}/>
            {children}
        </div>
    )
}