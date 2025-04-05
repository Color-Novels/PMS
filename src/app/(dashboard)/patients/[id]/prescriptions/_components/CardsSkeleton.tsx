import React from "react";
import {Skeleton} from "@/components/ui/skeleton";
import {Card, CardContent, CardHeader} from "@/components/ui/card";  // Assuming you have a Skeleton component in your UI kit

const PrescriptionListSkeleton = () => {
    return (
        <div className="grid grid-cols-1 gap-4">
            {/* First Card Skeleton */}
            <Card className="p-4 hover:shadow-md transition h-full">
                <CardHeader className={'pb-2'}>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Skeleton className="w-24 h-6"/>
                            <Skeleton className="w-10 h-6"/>
                        </div>
                        <Skeleton className="w-24 h-4"/>
                    </div>
                </CardHeader>
                <CardContent className={'flex items-center flex-wrap gap-2'}>
                    <Skeleton className="w-full h-6"/>
                    <div className="flex gap-2">
                        <Skeleton className="w-24 h-4"/>
                        <Skeleton className="w-24 h-4"/>
                    </div>
                    <div className="flex items-center flex-wrap gap-2">
                        <Skeleton className="w-24 h-4"/>
                        <Skeleton className="w-24 h-4"/>
                    </div>
                </CardContent>
            </Card>

            {/* Second Card Skeleton */}
            <Card className="p-4 hover:shadow-md transition h-full">
                <CardHeader className={'pb-2'}>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Skeleton className="w-24 h-6"/>
                            <Skeleton className="w-10 h-6"/>
                        </div>
                        <Skeleton className="w-24 h-4"/>
                    </div>
                </CardHeader>
                <CardContent className={'flex items-center flex-wrap gap-2'}>
                    <Skeleton className="w-full h-6"/>
                    <div className="flex gap-2">
                        <Skeleton className="w-24 h-4"/>
                        <Skeleton className="w-24 h-4"/>
                    </div>
                    <div className="flex items-center flex-wrap gap-2">
                        <Skeleton className="w-24 h-4"/>
                        <Skeleton className="w-24 h-4"/>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PrescriptionListSkeleton;
