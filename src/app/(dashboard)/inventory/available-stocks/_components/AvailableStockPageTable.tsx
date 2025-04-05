import React from "react";
import {
    getFilteredDrugsByModel,
    getFilteredDrugsByBrand,
    getFilteredDrugsByBatch,
    getTotalPagesForFilteredDrugsByBrand,
    getTotalPagesForFilteredDrugsByModel,
    getTotalPagesForFilteredDrugsByBatch,
} from "@/app/lib/actions";
import DrugListByModel from "./DrugListByModel";
import DrugListByBrand from "./DrugListByBrand";
import DrugListByBatch from "./DrugListByBatch";
import Pagination from "@/app/(dashboard)/_components/Pagination";

export default async function AvailableStockPageTable({
                                                          query,
                                                          currentPage,
                                                          selection,
                                                          sort,
                                                          drugId,
                                                          brandId,
                                                      }: {
    query: string;
    currentPage: number;
    selection: string;
    sort: string;
    drugId?: number;
    brandId?: number;
}) {
    let content = null;

    if (selection === "brand") {
        const totalPages = await getTotalPagesForFilteredDrugsByBrand({
            query,
            modelId: 0,
        });
        const filteredDrugsByBrand = await getFilteredDrugsByBrand({
            query,
            page: currentPage,
            sort,
            modelId: 0,
        });
        content = (
            <div className="flex h-full flex-col w-full">
                <div>
                    <DrugListByBrand brands={filteredDrugsByBrand}/>
                </div>
                <div className="mt-auto flex justify-center py-4 sticky bottom-0">
                    <Pagination totalPages={totalPages} itemsPerPage={9}/>
                </div>
            </div>
        );
    } else if (selection === "model") {
        const totalPages = await getTotalPagesForFilteredDrugsByModel({
            query,
            brandId: 0,
        });
        const filteredDrugsByModel = await getFilteredDrugsByModel({
            query,
            page: currentPage,
            sort,
            brandId: 0,
        });

        content = (
            <div>
                <div>
                    <DrugListByModel drugs={filteredDrugsByModel}/>
                </div>
                <div className="mt-auto flex justify-center py-4 sticky bottom-0">
                    <Pagination totalPages={totalPages} itemsPerPage={9}/>
                </div>
            </div>
        );
    } else if (selection === "batch") {
        const totalPages = await getTotalPagesForFilteredDrugsByBatch({
            query,
            modelId: drugId,
            brandId: brandId,
        });
        const filteredDrugsByBatch = await getFilteredDrugsByBatch({
            query,
            page: currentPage,
            sort,
            modelId: drugId,
            brandId: brandId,
        });

        content = (
            <div>
                <div>
                    <DrugListByBatch batches={filteredDrugsByBatch}/>
                </div>
                <div className="mt-auto flex justify-center py-4 sticky bottom-0">
                    <Pagination totalPages={totalPages} itemsPerPage={6}/>
                </div>
            </div>
        );
    }

    return <div>{content}</div>;
}
