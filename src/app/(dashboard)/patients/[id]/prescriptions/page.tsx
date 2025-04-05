import React, {Suspense} from 'react';
import {getPrescriptionsCount, searchPrescriptionCount} from "@/app/lib/actions/prescriptions";
import Search from "@/app/(dashboard)/_components/Search";
import SearchDropdown from "@/app/(dashboard)/_components/Dropdown";
import PrescriptionList from "@/app/(dashboard)/patients/[id]/prescriptions/_components/PrescriptionList";
import Pagination from "@/app/(dashboard)/_components/Pagination";
import PrescriptionListSkeleton from "@/app/(dashboard)/patients/[id]/prescriptions/_components/CardsSkeleton";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {verifySession} from "@/app/lib/sessions";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "PMS - Patient's Prescriptions",
    description: "Patient's Prescriptions",
};

const Page = async ({searchParams, params}: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
        filter?: string;
    }>,
    params: Promise<{ id: string }>
}) => {
    const recordsPerPage = 10
    const id = Number((await params).id);
    const resolvedParams = await searchParams;
    const query = resolvedParams?.query || "";
    const currentPage = Number(resolvedParams?.page) || 1;
    const filter = resolvedParams?.filter || "symptom";
    const prescriptionsCount = await getPrescriptionsCount(id);
    const filteredCount = await searchPrescriptionCount({
        query: query,
        patientID: id,
        filter: filter
    })
    const session = await verifySession();


    return (
        <div className={'flex flex-col gap-4 h-full'}>
            <div className={'flex justify-between items-center gap-4'}>
                <span className={'text-md'}>There are total {prescriptionsCount} prescriptions</span>
                <div>
                    <Link href={session?.role === 'DOCTOR' ? `/patients/${id}/prescriptions/add` : '#'}>
                        <Button
                            disabled={session?.role !== 'DOCTOR'}
                            className={session?.role !== 'DOCTOR' ? 'opacity-50 cursor-not-allowed' : ''}
                        >
                            Add Prescription
                        </Button>
                    </Link>
                </div>
            </div>


            <div className={'flex gap-4 items-center'}>
                <Search placeholder={`Search Prescription by ${filter}...`}/>
                <SearchDropdown items={[
                    {label: "Symptom", value: "symptom"},
                    {label: "Medicine", value: "drug"},
                ]} urlParameterName="filter"/>
            </div>

            <div className="flex-grow w-full">
                <Suspense fallback={<PrescriptionListSkeleton/>}>
                    <PrescriptionList currentPage={currentPage} query={query} patientID={id} perPage={recordsPerPage}
                                      filter={filter}/>
                </Suspense>
            </div>

            <div className={'flex justify-center items-center sticky bottom-0'}>
                <Pagination totalPages={Math.ceil(filteredCount / recordsPerPage)} itemsPerPage={recordsPerPage}/>
            </div>
        </div>
    );
};

export default Page;