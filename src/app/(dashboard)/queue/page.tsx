import QueueTable from "@/app/(dashboard)/queue/_components/QueueTable";
import Pagination from "@/app/(dashboard)/queue/_components/Pagination";
import AddQueue from "@/app/(dashboard)/queue/_components/AddQueue";
import React from "react";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "All queues - Patient Management System",
    description: "View all queues in the patient management system",
};

const rowsPerPage = 7;

export default async function Page(props: {
    searchParams?: Promise<{
        page?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const currentPage = Number(searchParams?.page) || 1;

    return (
        <div className="flex flex-col flex-1 h-full p-4 overflow-y-auto items-center justify-between">
            <div className=" min-h-52 flex flex-col w-4/5">
                <div className={'flex justify-end mb-2.5'}>
                <AddQueue/>
                </div>
                {/*Table*/}
                <QueueTable currentPage={currentPage} size={rowsPerPage}/>
            </div>
            <div className={'mt-2.5 shadow-md'}>
                <Pagination size={rowsPerPage}/>
            </div>
        </div>
    );
}
