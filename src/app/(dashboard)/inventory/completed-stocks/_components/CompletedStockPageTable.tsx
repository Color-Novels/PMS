import React from 'react'
import { getCompletedFilteredDrugsByModel, getCompletedFilteredDrugsByBrand, getCompletedFilteredDrugsByBatch, getTotalPagesForCompletedFilteredDrugsByBrand, getTotalPagesForCompletedFilteredDrugsByModel, getTotalPagesForCompletedFilteredDrugsByBatch } from '@/app/lib/actions'
import Pagination from '@/app/(dashboard)/_components/Pagination'
import DrugListByBatch from '../../available-stocks/_components/DrugListByBatch';

interface Batch {
    id: number;
    batchNumber: string;
    brandName: string;
    modelName: string;
    expiryDate: string;
    stockDate: string;
    remainingAmount: number;
    fullAmount: number;
    status: string;
    unitConcentration: number;
    type: string;

}



export default async function CompletedStockPageTable({
    query,
    currentPage,
    selection,
    sort,
    status,
    fromDate,
    toDate
}: {
    query: string;
    currentPage: number;
    selection: string;
    sort: string;
    drugId?: number;
    brandId?: number;
    status?: string;
    fromDate?: string;
    toDate?: string;
}) {
    let totalPages = 0;
    let filteredDrugs: Batch[] = [];

    if (selection === "batch") {
        const batchTotalPages = await getTotalPagesForCompletedFilteredDrugsByBatch({
            query, fromDate, toDate, status
        });

        const batchDrugs = await getCompletedFilteredDrugsByBatch({
            query, page: currentPage, sort, fromDate, toDate, status
        });
        
        totalPages = batchTotalPages ?? 0;
        filteredDrugs = batchDrugs ?? [];
    } else if (selection === "brand") {
        const brandTotalPages = await getTotalPagesForCompletedFilteredDrugsByBrand({
            query, fromDate, toDate, status
        });
        const brandDrugs = await getCompletedFilteredDrugsByBrand({
            query, page: currentPage, sort, fromDate, toDate, status
        });
        
        totalPages = brandTotalPages ?? 0;
        filteredDrugs = brandDrugs ?? [];
    } else if (selection === "model") {
        const modelTotalPages = await getTotalPagesForCompletedFilteredDrugsByModel({
            query, fromDate, toDate, status
        });
        const modelDrugs = await getCompletedFilteredDrugsByModel({
            query, page: currentPage, sort, fromDate, toDate, status
        });
        
        totalPages = modelTotalPages ?? 0;
        filteredDrugs = modelDrugs ?? [];
    }

    return (
        <div>
            <div>
                <DrugListByBatch batches={filteredDrugs} />
            </div>
            <div className="mt-auto flex justify-center py-4 sticky bottom-0">
                <Pagination totalPages={totalPages} itemsPerPage={15} />
            </div>
        </div>
    );
}