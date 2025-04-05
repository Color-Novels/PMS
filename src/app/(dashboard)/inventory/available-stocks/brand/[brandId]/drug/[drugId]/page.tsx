import React, { Suspense } from "react";
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
    }>;
}) {
    const { drugId, brandId } = await params;
    const searchParamsAwaited = await searchParams;

    const query = searchParamsAwaited?.query || "";
    const currentPage = Number(searchParamsAwaited?.page) || 1;
    const selection = searchParamsAwaited?.selection || "batch";
    const sort = searchParamsAwaited?.sort || "alphabetically";
    return (
        <div className="flex h-full flex-col w-full">
            <div className="sticky top-0 p-4 bg-white border-b shadow-md flex flex-wrap gap-4 z-20">
                <div className="relative w-[200px]">
                    <SearchPanel placeholder="Search Batch..." />
                </div>
                <Dropdown
                    items={[
                        { label: "Expiry Date", value: "expiryDate" },
                        { label: "Newly Added", value: "newlyAdded" },
                        { label: "Alphabetically", value: "alphabetically" },
                    ]}
                    urlParameterName="sort"
                />

            </div>
            <div className="flex-grow overflow-auto">
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
