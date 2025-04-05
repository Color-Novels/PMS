import {Suspense} from "react";
import SearchBox from "../_components/Search";
import PatientTable from "./_components/PatientTable";
import {getTotalPages} from "@/app/lib/actions";
import Pagination from "../_components/Pagination";
import {PatientsTableSkeleton} from "./_components/PatientsTableSkeleton";
import SearchDropdown from "../_components/Dropdown";
import AddPatientForm from "./_components/AddPatientForm";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "PMS - All Patients",
    description: "List of all patients in the system.",
};


export default async function Page({
                                       searchParams,
                                   }: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
        filter?: string;
    }>;
}) {
    // Await the searchParams
    const params = await searchParams;
    const query = params?.query || "";
    const currentPage = Number(params?.page) || 1;
    const filter = params?.filter || "name";
    const totalPages = await getTotalPages(query, filter);

    return (
        <div className={"flex h-full flex-col p-4 overflow-y-auto"}>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-primary-700">All Patients</h1>
                <AddPatientForm/>
            </div>

            {/* Search & Filters */}
            <div className="flex items-center gap-4 mb-6">
                <SearchBox placeholder="Search patients..."/>
                <SearchDropdown
                    items={[
                        {label: "Name", value: "name"},
                        {label: "NIC", value: "NIC"},
                        {label: "Telephone", value: "telephone"},
                    ]}
                    urlParameterName="filter"
                />
            </div>

            {/* Table */}
            <Suspense key={query + currentPage} fallback={<PatientsTableSkeleton/>}>
                <PatientTable query={query} currentPage={currentPage} filter={filter}/>
            </Suspense>

            {/* Pagination */}
            <div className="flex justify-center bg-transparent w-full mt-4 sticky bottom-0">
                <Pagination totalPages={totalPages} itemsPerPage={10}/>
            </div>
        </div>
    );
}
