import React from 'react';
import {Card} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';

const PrescriptionIssueSkeleton = () => {
    return (
        <Card className="p-4 space-y-4">
            <div className="flex items-start space-x-4">
                {/* Icon skeleton */}
                <Skeleton className="h-8 w-8 mt-1 rounded-full"/>

                <div className="space-y-3 flex-1">
                    {/* Title and badge row */}
                    <div className="flex items-center space-x-2">
                        <Skeleton className="h-5 w-32"/> {/* Drug name */}
                        <Skeleton className="h-5 w-24"/> {/* Strategy badge */}
                    </div>

                    {/* Details text */}
                    <Skeleton className="h-4 w-3/4"/>

                    {/* Drug info row */}
                    <div className="flex space-x-2">
                        <Skeleton className="h-4 w-40"/>
                        <Skeleton className="h-4 w-40"/>
                        <Skeleton className="h-4 w-32"/>
                    </div>

                    {/* Strategy details */}
                    <div className="space-y-2">
                        {/* Badges row */}
                        <div className="flex space-x-3">
                            <Skeleton className="h-6 w-24"/>
                            <Skeleton className="h-6 w-24"/>
                            <Skeleton className="h-6 w-24"/>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

const OffRecordIssueSkeleton = () => {
    return (
        <Card className="p-4">
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                    <Skeleton className="h-5 w-5 rounded-full"/>
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-32"/>
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-4 w-4"/>
                            <Skeleton className="h-4 w-48"/>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};
export {PrescriptionIssueSkeleton, OffRecordIssueSkeleton};