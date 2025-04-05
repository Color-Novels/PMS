// components/drugs/drugs.tsx
import {fetchDrugs} from '../lib/data';
import {DataTable} from './ui/data-table';
import {Pagination} from './ui/pagination';
import {BatchStatus, DrugType} from '@prisma/client';
import {FetchDrugsParams} from '../lib/types';

export async function Drugs({
                                page = 1,
                                per_page = 10,
                                sort = 'expiry:asc',
                                filters = {}
                            }: {
    page?: number;
    per_page?: number;
    sort?: string;
    filters?: {
        query?: string;
        drug_name?: string;
        drug_brand?: string;
        supplier?: string;
        drug_type?: DrugType;
        drug_Model?: string;
        batch_status?: BatchStatus;
        [key: string]: string | DrugType | BatchStatus | undefined;
    };
}) {
    // Convert string filters to correct types if needed
    const processedFilters: FetchDrugsParams['filters'] = {
        ...filters,
        drug_type: filters.drug_type as DrugType,
        batch_status: filters.batch_status as BatchStatus
    };

    const {data, totalPages} = await fetchDrugs({
        page,
        per_page,
        sort,
        filters: processedFilters
    });


    return (
        <div className="space-y-4">
            <DataTable data={data}/>
            <Pagination totalPages={totalPages} currentPage={page}/>
        </div>
    );
}