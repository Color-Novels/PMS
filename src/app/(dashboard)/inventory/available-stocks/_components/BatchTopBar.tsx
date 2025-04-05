"use client";

import {useRouter, usePathname} from "next/navigation";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {FileText, LucidePackagePlus} from "lucide-react";


const PatientTabs = () => {
    const router = useRouter();
    const pathname = usePathname();

    const handleTabChange = (value: string) => {
        // Find the position of '/batch/' in the URL
        const batchIndex = pathname.indexOf('/batch/');

        if (batchIndex !== -1) {
            // Find the end of the batch number by looking for the next '/' after '/batch/'
            const batchNumberStart = batchIndex + '/batch/'.length;
            const batchNumberEnd = pathname.indexOf('/', batchNumberStart);

            // Get the base path up to and including the batch number
            const basePath = batchNumberEnd === -1
                ? pathname // If no slash after batch number, use entire pathname
                : pathname.substring(0, batchNumberEnd);

            // Construct the new path
            const newPath = value === 'details'
                ? basePath
                : `${basePath}/${value}`;

            router.push(newPath);
        } else {
            console.error('Batch ID not found in the current path');
        }
    };

    return (
        <div className={'w-full bg-white p-2'}>
            <Tabs onValueChange={handleTabChange} defaultValue={'details'} className="w-full h-10">
                <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="details" className="flex items-center gap-2">
                        <LucidePackagePlus className="h-4 w-4"/>
                        Batch Details
                    </TabsTrigger>
                    <TabsTrigger value="issuedPatients" className="flex items-center gap-2">
                        <FileText className="h-4 w-4"/>
                        Issued Patients
                    </TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
    );
};

export default PatientTabs;
