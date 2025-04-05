import React from 'react';
import FeeForm from "@/app/(dashboard)/admin/fees/_components/FeeForm";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "PMS - Fees Management",
    description: "Manage and configure patient fees and charges.",
};


const Page = async () => {

    return (
        <div className={'flex flex-col h-full w-full p-4 gap-6 overflow-y-auto'}>
            {/*Heading*/}
            <FeeForm/>
        </div>
    );
};

export default Page;