import React from 'react';
import {Skeleton} from "@/components/ui/skeleton";
import {Card, CardContent} from "@/components/ui/card";

const HistoryListSkeleton = () => {
    return (
        <div className="space-y-3 py-2">
            {[1, 2, 3].map((item) => (
                <Card key={item} className="overflow-hidden border-l-4 border-l-gray-300 shadow-sm">
                    <CardContent className="p-0">
                        <div className="flex items-center p-4">
                            {/* Skeleton for Timeline dot */}
                            <Skeleton className="rounded-full h-10 w-10 mr-4"/>

                            <div className="flex-grow min-w-0 space-y-2">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-4 w-20"/> {/* Badge */}
                                        <Skeleton className="h-3 w-24"/> {/* Date */}
                                    </div>
                                    <Skeleton className="h-5 w-5"/> {/* Delete Icon */}
                                </div>
                                <div className="space-y-1">
                                    <Skeleton className="h-4 w-3/4"/> {/* Name */}
                                    <Skeleton className="h-3 w-full"/> {/* Description */}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

const Loading = () => {
    return (
        <div className={'flex flex-col gap-4 h-full'}>
            <div className={'flex w-full gap-4'}>
                <Skeleton className={'w-full h-8'}/>
                <Skeleton className={'w-40 h-8'}/>
            </div>
            <HistoryListSkeleton/>
        </div>
    );
};

export default Loading;