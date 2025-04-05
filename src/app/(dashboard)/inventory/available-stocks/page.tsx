import React, {Suspense} from "react";
import {DrugForm} from "@/app/(dashboard)/inventory/_components/DrugForm";
import SearchPanel from "@/app/(dashboard)/_components/Search";
import Dropdown from "@/app/(dashboard)/_components/Dropdown";
import SortingDropdown from "@/app/(dashboard)/inventory/_components/SortingDropdown";
import AvailableStockPageTable from "./_components/AvailableStockPageTable";
import DrugListSkeleton from "./_components/DrugListSkeleton";

export default async function InventoryAvailable({
                                                     searchParams,
                                                 }: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
        selection?: string;
        sort?: string;
    }>;
}) {
    const params = await searchParams;
    const query = params?.query || "";
    const currentPage = Number(params?.page) || 1;
    const selection = params?.selection || "model";
    const sort = params?.sort || "alphabetically";

    return (
        <div className="flex flex-col w-full">
            {/* Fixed header instead of sticky */}
            <div className="flex p-2 h-14 sticky top-0 bg-white border-b shadow-md gap-2 overflow-x-auto">
                <SearchPanel placeholder="Search by Name"/>
                <Dropdown
                    items={[
                        {label: "By Model", value: "model"},
                        {label: "By Brand", value: "brand"},
                        {label: "By Batch", value: "batch"},
                    ]}
                    urlParameterName="selection"
                />
                <SortingDropdown selection={selection}/>
                <DrugForm/>
            </div>

            {/* Scrollable content */}
            <div className="flex-grow overflow-y-auto">
                <Suspense fallback={<DrugListSkeleton/>}>
                    <AvailableStockPageTable
                        query={query}
                        currentPage={currentPage}
                        selection={selection}
                        sort={sort}
                    />
                </Suspense>
            </div>
        </div>
    );
}
