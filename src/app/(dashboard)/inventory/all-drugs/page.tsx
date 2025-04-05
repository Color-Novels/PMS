// app/inventory/all-drugs/page.tsx
import {Suspense} from 'react';
import {Drugs} from './_components/Drugs';
import {SearchAndSort} from './_components/SearchAndSort';
import {BatchStatus, DrugType} from '@prisma/client';
import {TableBody, TableHead, TableHeader, TableRow, Table, TableCell} from "@/components/ui/table";
import {Skeleton} from "@/components/ui/skeleton";
import {DrugForm} from "@/app/(dashboard)/inventory/_components/DrugForm";

interface SearchParams {
    page?: string;
    per_page?: string;
    sort?: string;
    query?: string;
    drugName?: string;
    drugBrand?: string;
    supplier?: string;
    drugType?: string;
    batchStatus?: string;
    [key: string]: string | undefined;
}

export default async function DrugsPage({
                                            searchParams,
                                        }: {
    searchParams: Promise<SearchParams>;
}) {
    // Await searchParams if it's a promise (though it shouldn't be in Next.js 13+)
    const params = await Promise.resolve(searchParams);

    const page = params.page ? parseInt(params.page) : 1;
    const per_page = params.per_page ? parseInt(params.per_page) : 15;
    const sort = params.sort || 'stockDate:desc';

    // Extract and convert filter parameters
    const filters = {
        query: params.query,
        drug_brand: params.drugBrand,
        supplier: params.supplier,
        drug_model: params.drugModel,
        drug_type: params.drugType ? params.drugType as DrugType : undefined,
        batch_status: params.batchStatus ? params.batchStatus as BatchStatus : undefined,
    };

    return (
        <div className={'flex h-full w-full flex-col p-4 overflow-y-auto gap-4'}>
            <div className={'flex items-center justify-between'}>
                <h1 className="text-2xl font-bold tracking-tight">Drugs Inventory</h1>
                <DrugForm/>
            </div>
            <div className="container gap-6">
                <div className="flex flex-col space-y-4">
                    <SearchAndSort/>
                    <div className={'container w-full'}>
                        <Suspense fallback={<DrugsTableSkeleton/>}>
                            <Drugs
                                page={page}
                                per_page={per_page}
                                sort={sort}
                                filters={filters}
                            />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DrugsTableSkeleton() {
    // Create array for columns (adjust number based on your actual table)
    const columnCount = 6;

    return (
        <div className="rounded-md border shadow-sm overflow-hidden">
            <Table className="w-full border-collapse">
                <TableHeader>
                    <TableRow className="divide-x divide-gray-200">
                        {Array.from({length: columnCount}).map((_, i) => (
                            <TableHead
                                key={i}
                                className="whitespace-nowrap py-3 text-xs font-medium border-r border-gray-200 last:border-r-0"
                            >
                                <Skeleton className="h-4 w-full mx-auto"/>
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({length: 5}).map((_, rowIndex) => (
                        <TableRow
                            key={rowIndex}
                            className="divide-x divide-gray-200"
                        >
                            {Array.from({length: columnCount}).map((_, cellIndex) => (
                                <TableCell
                                    key={cellIndex}
                                    className="py-3 px-4 border-b border-gray-100 border-r last:border-r-0"
                                >
                                    <Skeleton
                                        className={`h-4 w-${cellIndex === 0 ? '12' : Math.floor(Math.random() * 24) + 12}`}/>
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}