import React, {Suspense} from 'react';
import {getAllReportCount, getPatientReportPages} from "@/app/lib/actions/reports";
import Search from "@/app/(dashboard)/_components/Search";
import RangeTabs from "@/app/(dashboard)/patients/[id]/reports/_components/RangeTabs";
import AllPatientReports from "@/app/(dashboard)/patients/[id]/reports/_components/AllPatientReports";
import Pagination from "@/app/(dashboard)/_components/Pagination";
import CardSkeleton from "@/app/(dashboard)/patients/[id]/reports/_components/CardSkeleton";
import AddReportDialog from "@/app/(dashboard)/patients/[id]/reports/_components/AddReportDialog.";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "PMS - Patient Reports",
    description: "Patient Management System - Patient Reports",
};

const Page = async ({params, searchParams}: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
        range?: string;
    }>,
    params: Promise<{ id: string }>
}) => {

    const recordsPerPage = 10;
    const id = Number((await params).id);
    const searchP = await searchParams;
    const query = searchP?.query || "";
    const range = searchP?.range || "ALL";
    const currentPage = Number(searchP?.page) || 1;
    const totalReports = await getPatientReportPages(query, range, id);
    const totalReportCount = await getAllReportCount(id);


    return (
        <div className={'flex flex-col gap-4 h-full'}>
            <div className={'flex justify-between items-center gap-4'}>
                <span className={'text-md'}>There are total {totalReportCount} reports</span>
                <div className={'flex gap-4'}>
                    <Link href={`/admin/reports`}>
                        <Button variant={"ghost"}><span className={'underline'}>Add new report template</span></Button>
                    </Link>
                    <AddReportDialog id={id}/>
                </div>
            </div>
            <div className={'flex gap-4 items-center'}>
                <Search placeholder={'Search Report...'}/>
                <RangeTabs currentTab={range}/>
            </div>
            <div className="flex-grow w-full">
                <Suspense fallback={<CardSkeleton/>}>
                    <AllPatientReports currentPage={currentPage} query={query} range={range} id={id}/>
                </Suspense>
            </div>
            <div className={'flex justify-center items-center sticky bottom-0'}>
                <Pagination totalPages={Math.ceil(totalReports / recordsPerPage)} itemsPerPage={recordsPerPage}/>
            </div>
        </div>
    );
};

export default Page;