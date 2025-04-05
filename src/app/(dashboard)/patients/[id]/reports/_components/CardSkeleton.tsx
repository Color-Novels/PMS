import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const PatientReportsSkeleton = () => {
    return (
        <div className="grid grid-cols-1 gap-4">
            <Card className="w-full hover:shadow-lg transition duration-300 ease-in-out h-fit">
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-4 w-1/6" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-2">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="flex justify-start items-center gap-4">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-4 w-1/6" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="w-full hover:shadow-lg transition duration-300 ease-in-out h-fit">
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-4 w-1/6" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-2">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="flex justify-start items-center gap-4">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-4 w-1/6" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PatientReportsSkeleton;