import React from 'react';
import {Skeleton} from "@/components/ui/skeleton"

const StatusCardSkeleton = () => {
    return (
        <div className="bg-white py-6 px-6 rounded-md shadow-md flex justify-start gap-5 w-full">
            <Skeleton className="h-14 w-14"/>
            <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-24"/>
                <Skeleton className="h-6 w-16"/>
            </div>
        </div>
    );
};

const CardSet = ({number}: { number: number }) => {
    return (
        <div className={'flex gap-5'}>
            {[...Array(number)].map((_, index) => <StatusCardSkeleton key={index}/>)}
        </div>
    );
}

export {StatusCardSkeleton, CardSet};