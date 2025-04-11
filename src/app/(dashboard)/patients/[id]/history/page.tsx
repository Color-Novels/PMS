import {Metadata} from "next";
import React from "react";
import HistoryList from "@/app/(dashboard)/patients/[id]/history/_components/HistoryList";
import AddHistoryForm from "@/app/(dashboard)/patients/[id]/history/_components/AddHistoryForm";
import {getAllHistory} from "@/app/lib/actions/history";

export const metadata: Metadata = {
    title: "PMS - Patient History",
    description: "Patient Management System - Patient History",
};

const Page = async ({params, searchParams}: {
    params: Promise<{ id: string }>
    searchParams: Promise<{ query: string; }>
}) => {
    const id = Number((await params).id);
    const query = (await searchParams).query || '';
    const histories = await getAllHistory({patientID: id});
    const count = histories.length

    return (
        <div className={'flex flex-col gap-4 h-full'}>
            <div className={'flex justify-between gap-4 items-center'}>
                <h3 className={'text-md'}>There are total {count} history records</h3>
                <AddHistoryForm patientID={id}/>
            </div>
            <div className="flex-grow w-full">
                <HistoryList initialHistory={histories} query={query} />
            </div>
        </div>
    );
}

export default Page;