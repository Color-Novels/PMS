import React, {Suspense} from "react";

import SearchPanel from "@/app/(dashboard)/_components/Search";
import Dropdown from "@/app/(dashboard)/_components/Dropdown";

import CompletedStockPageTable from "@/app/(dashboard)/inventory/completed-stocks/_components/CompletedStockPageTable";
import DrugListSkeleton from "@/app/(dashboard)/inventory/available-stocks/_components/DrugListSkeleton";
import DatePickerURL from "./_components/DatePickerURL";

export default async function InventoryAvailable({
                                                     searchParams,
                                                 }: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
        selection?: string;
        sort?: string;
        status?: string;
        from: string;
        to: string;
    }>;
}) {
    const params = await searchParams;
    const query = params?.query || "";
    const currentPage = Number(params?.page) || 1;
    const selection = params?.selection || "model";
    const sort = params?.sort || "alphabetically";
    const status = params?.status || "ALL";
    const fromDate = params?.from || "";  // Get from date
    const toDate = params?.to || "";      // Get to date

    return (
        <div className="flex flex-col">
            <div
                className="flex p-2 h-14 sticky top-0 bg-white border-b shadow-md gap-2 overflow-x-auto">
                <div className="flex">
                    <SearchPanel placeholder="Search..."/>
                </div>
                <Dropdown
                    items={[
                        {label: "Search by Model", value: "model"},
                        {label: "Search by Brand", value: "brand"},
                        {label: "Search by Batch", value: "batch"},
                    ]}
                    urlParameterName="selection"
                />
                <Dropdown
                    items={[
                        {label: "Expiry Date", value: "expiryDate"},
                        {label: "Newly Added", value: "newlyAdded"},
                        {label: "Alphabetically", value: "alphabetically"},
                    ]}
                    urlParameterName="sort"
                />
                <Dropdown
                    items={[
                        {label: "All", value: "ALL"},
                        {label: "Completed", value: "COMPLETED"},
                        {label: "Expired", value: "EXPIRED"},
                        {label: "Trashed", value: "TRASHED"},
                    ]}
                    urlParameterName="status"
                />
                <DatePickerURL/>
            </div>
            <div className="flex-grow overflow-y-auto">
                <Suspense fallback={<DrugListSkeleton/>}>
                    <CompletedStockPageTable
                        query={query}
                        currentPage={currentPage}
                        selection={selection}
                        sort={sort}
                        status={status}
                        fromDate={fromDate}
                        toDate={toDate}
                    />
                </Suspense>
            </div>
        </div>
    );
}
