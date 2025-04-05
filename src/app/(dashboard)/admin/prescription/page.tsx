import React, {Suspense} from 'react';
import {Metadata} from "next";
import VitalsForm, {VitalsFormSkeleton} from "@/app/(dashboard)/admin/prescription/_components/VitalsForm";

export const metadata: Metadata = {
    title: "PMS - Prescription Vitals",
    description: "Add prescription vitals"
};

const Page = () => {
    return (
        <div className={'flex flex-col h-full w-full p-4 overflow-y-auto'}>
            {/*Heading*/}
            <h1 className="text-2xl font-bold text-primary-700 mb-6">Prescription Vitals</h1>
            <Suspense fallback={<VitalsFormSkeleton/>}>
                <VitalsForm/>
            </Suspense>
        </div>
    );
};

export default Page;