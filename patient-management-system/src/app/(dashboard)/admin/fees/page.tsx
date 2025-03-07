import React from 'react';
import FeeForm from "@/app/(dashboard)/admin/fees/_components/FeeForm";
import {getCharges} from "@/app/lib/actions/charges";
import {ChargeType} from "@prisma/client";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "PMS - Fees Management",
    description: "Manage and configure patient fees and charges.",
};


const Page = async () => {
    const fees = await getCharges();

    const doctorFee = fees.find(fee => fee.name === ChargeType.DOCTOR);
    const dispensaryFee = fees.find(fee => fee.name === ChargeType.DISPENSARY);

    return (
        <div className={'flex flex-col h-full w-full p-4'}>
            {/*Heading*/}
            <h1 className="text-2xl font-bold text-primary-700">Fees Management</h1>
            <div className={'flex flex-col items-center justify-center h-full'}>
                <FeeForm initialDispensaryCharge={dispensaryFee?.value || 0}
                         initialDispensaryUpdatedAt={dispensaryFee?.updatedAt || new Date()}
                         initialDoctorCharge={doctorFee?.value || 0}
                         initialDoctorUpdatedAt={doctorFee?.updatedAt || new Date()}/>
            </div>
        </div>
    );
};

export default Page;