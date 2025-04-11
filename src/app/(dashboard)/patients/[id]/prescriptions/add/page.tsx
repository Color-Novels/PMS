import React from 'react';
import PrescriptionForm from "@/app/(dashboard)/patients/[id]/prescriptions/add/_components/PrescriptionForm";
import SidebarHistoryList, {
    SidebarHistoryListSkeleton
} from '@/app/(dashboard)/patients/[id]/prescriptions/add/_components/CompactSidebarHistoryList';
import {Metadata} from "next";
import {getPatientSpecificVitals} from "@/app/lib/actions/prescriptions";
import {Suspense} from 'react';
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import AddHistoryForm from "@/app/(dashboard)/patients/[id]/prescriptions/add/_components/CompactAddHistory";
import SearchDropdown from "@/app/(dashboard)/_components/Dropdown";

export const metadata: Metadata = {
    title: "PMS - Add Prescription",
    description: "Add patient prescription",
};

const Page = async ({params, searchParams}: {
    searchParams?: Promise<{ filter?: string; }>,
    params: Promise<{ id: string }>;
}) => {
    const {id} = await params;
    const patientID = Number(id);
    const filter = (await searchParams)?.filter || '';
    const vitals = (await getPatientSpecificVitals(patientID)).map(vital => ({
        ...vital,
        value: ''
    }));

    return (
        <div className="flex flex-row gap-4">
            <div className="flex-1">
                <PrescriptionForm patientID={patientID} vitals={vitals}/>
            </div>

            <Card className="flex flex-col sticky top-0 h-[calc(100vh-5.5rem)]">
                <CardHeader className="pb-2">
                    <div className="flex flex-row justify-center gap-2 items-center text-center">
                        <SearchDropdown
                            items={[
                                {value: "all", label: "All"},
                                {value: "medical", label: "Medical"},
                                {value: "social", label: "Social"},
                                {value: "family", label: "Family"},
                                {value: "allergy", label: "Allergy"}
                            ]}
                            urlParameterName="filter"
                        />
                        <AddHistoryForm patientID={patientID}/>
                    </div>
                </CardHeader>
                <CardContent className="p-3 h-full overflow-hidden">
                    <Suspense fallback={<SidebarHistoryListSkeleton/>}>
                        <SidebarHistoryList patientID={patientID} filter={filter}/>
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    );
};

export default Page;