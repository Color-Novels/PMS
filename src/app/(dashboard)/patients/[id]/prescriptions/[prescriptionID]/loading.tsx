import {Skeleton} from "@/components/ui/skeleton";
import React from "react";
import {
    OffRecordIssueSkeleton,
    PrescriptionIssueSkeleton
} from "@/app/(dashboard)/patients/[id]/prescriptions/[prescriptionID]/_components/Skeletons";

const PrescriptionCardSkeleton = () => {
    return (
        <div className="p-4 border rounded-lg shadow-sm bg-white animate-pulse">
            {/* Header Skeleton */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-32"/>
                    <Skeleton className="h-6 w-12"/>
                    <Skeleton className="h-6 w-16"/>
                </div>
                <Skeleton className="h-4 w-24"/>
            </div>

            {/* Details Skeleton */}
            <div className="space-y-3 mb-4">
                <Skeleton className="h-5 w-40"/>
                <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-6 w-48"/>
                    <Skeleton className="h-6 w-48"/>
                    <Skeleton className="h-6 w-48"/>
                </div>
            </div>

            {/* Prescription Issues Skeleton */}
            <div className="space-y-4 border-t border-gray-200 pt-4">
                <Skeleton className="h-5 w-48"/>
                <PrescriptionIssueSkeleton/>
                <PrescriptionIssueSkeleton/>
            </div>

            {/* Off Record Medications Skeleton */}
            <div className="space-y-4 border-t border-gray-200 pt-4">
                <Skeleton className="h-5 w-48"/>
                <OffRecordIssueSkeleton/>
                <OffRecordIssueSkeleton/>
            </div>
        </div>
    );
};

export default PrescriptionCardSkeleton;