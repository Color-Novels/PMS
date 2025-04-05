import AddUserDialog from "@/app/(dashboard)/admin/staff/_components/AddUserDialog";
import AllUsers from "@/app/(dashboard)/admin/staff/_components/AllUsers";
import {Suspense} from "react";
import StaffSkeleton from "@/app/(dashboard)/admin/staff/_components/StaffCardSkeleton";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "PMS - Staff Management",
    description: "Manage and configure medical staff.",
};

// Awaited type of get staff


export default async function AdminPage() {
    return (
        <div className="p-4 h-full">
            <div className={'flex justify-between items-center mb-6'}>
                <h1 className="text-2xl font-bold text-primary-700">
                    Medical Staff Management
                </h1>
                <AddUserDialog/>
            </div>
            <Suspense fallback={<StaffSkeleton/>}>
                <AllUsers/>
            </Suspense>
        </div>
    );
}
