import React from "react";
import {Card} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";

const SkeletonCard = () => {
    return (
        <Card className="p-6 flex space-y-4 flex-col">
            <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="w-12 h-12 rounded-full"></Skeleton>
                    <div>
                        <Skeleton className="w-24 h-4 rounded"></Skeleton>
                        <Skeleton className="w-16 h-3 mt-1 rounded"></Skeleton>
                    </div>
                </div>
                <Skeleton className="w-8 h-8  rounded"></Skeleton>
            </div>
            <div className="space-y-7">
                <div>
                    <Skeleton className="w-16 h-3 rounded"></Skeleton>
                    <Skeleton className="w-full h-6 mt-1 rounded"></Skeleton>
                </div>
                <div>
                    <Skeleton className="w-16 h-3 rounded"></Skeleton>
                    <Skeleton className="w-full h-6 mt-1 rounded"></Skeleton>
                </div>
                <div className="flex items-center justify-end gap-2">
                    <Skeleton className="w-10 h-8 rounded"></Skeleton>
                    <Skeleton className="w-10 h-8 rounded"></Skeleton>
                </div>
            </div>
        </Card>
    );
};

const StaffSkeleton = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonCard/>
            <SkeletonCard/>
        </div>
    );
};

export default StaffSkeleton;
