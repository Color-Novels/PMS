import React, {Suspense} from "react";
import SearchPanel from "@/app/(dashboard)/_components/Search";
import Dropdown from "@/app/(dashboard)/_components/Dropdown";
import AvailableStockPageTable from "@/app/(dashboard)/inventory/available-stocks/_components/AvailableStockPageTable";
import DrugListSkeleton from "@/app/(dashboard)/inventory/available-stocks/_components/DrugListSkeleton";


export default async function Page({
                                       searchParams, params
                                   }: {
    searchParams: Promise<{
        query?: string;
        page?: string;
        selection?: string;
        sort?: string;
    }>,
    params: Promise<{
        drugId: number;
        brandId: number;
    }>
}) {
    const {drugId, brandId} = await params;
    const searchParamsAwaited = await searchParams;

    const query = searchParamsAwaited?.query || "";
    const currentPage = Number(searchParamsAwaited?.page) || 1;
    const selection = searchParamsAwaited?.selection || "batch";
    const sort = searchParamsAwaited?.sort || "alphabetically";
    return (
        <div className="flex flex-col w-full">
            <div className="flex p-2 sticky top-0 bg-white border-b shadow-md gap-2 overflow-x-auto">
                <SearchPanel placeholder="Search Batch..."/>
                <Dropdown
                    items={[
                        {label: "Expiry Date", value: "expiryDate"},
                        {label: "Newly Added", value: "newlyAdded"},
                        {label: "Alphabetically", value: "alphabetically"},
                    ]}
                    urlParameterName="sort"
                />

            </div>
            <div className="flex-grow overflow-y-auto">
                <Suspense fallback={<DrugListSkeleton/>}>
                    <AvailableStockPageTable
                        query={query}
                        currentPage={currentPage}
                        selection={selection}
                        sort={sort}
                        drugId={drugId}
                        brandId={brandId}
                    />
                </Suspense>
            </div>

        </div>
    );
}
