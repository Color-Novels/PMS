import SearchBox from "@/app/(dashboard)/_components/Search";
import {getTotalReportTemplateCount} from "@/app/lib/actions/reports";
import AllReportsTable from "@/app/(dashboard)/admin/reports/_components/AllReportsTable";
import AddReports from "@/app/(dashboard)/admin/reports/_components/AddReports";
import {Suspense} from "react";
import SkeletonLoader from "@/app/(dashboard)/admin/reports/_components/LoadingSkeleton";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "PMS - Report templates",
    description: "Manage and configure report templates.",
};

export default async function Page({
                                       searchParams,
                                   }: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
    }>;
}) {
    // Await the searchParams
    const params = await searchParams;
    const query = params?.query || "";
    const totalReports = await getTotalReportTemplateCount();

    return (
        <div className="flex flex-col h-full">
            <div className="w-full p-4 flex-grow flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-primary-700">All Report Templates <span
                        className="text-gray-500">({totalReports})</span></h1>
                    <AddReports/>
                </div>

                {/* Search & Filters */}
                <div className="flex items-center gap-4 mb-6">
                    <SearchBox placeholder="Search Reports..."/>
                </div>

                {/* Table */}
                <div className="flex-grow overflow-y-auto w-full">
                    <Suspense fallback={<SkeletonLoader/>}>
                        <AllReportsTable query={query}/>
                    </Suspense>
                </div>
            </div>
        </div>
    );
}