import React from 'react';
import { getFilteredDrugsByModel } from '@/app/lib/actions';
import DrugListByModel from '@/app/(dashboard)/inventory/available-stocks/_components/DrugListByModel';

async function Page({ params }: {
    params: Promise<{ brandId: string, currentPage: number }>
}) {

    const { brandId, currentPage } = await params;
    const filteredDrugsByModel = await getFilteredDrugsByModel({
        page: currentPage,
        brandId: Number(brandId),
    });

    return (
        <div className="flex h-full flex-col w-full">
            <DrugListByModel drugs={filteredDrugsByModel} />
        </div>
    );
}

export default Page;


