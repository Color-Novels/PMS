import React from 'react';
import {Skeleton} from "@/components/ui/skeleton";
import CardSkeleton from "@/app/(dashboard)/patients/[id]/reports/_components/CardSkeleton";

const Loading = () => {
    return (
        <div className="flex flex-col w-full gap-4">
            <div className={'flex w-full'}>
                {/*    Searchbar*/}
                <Skeleton className={'w-full h-10'}/>
            </div>
            <CardSkeleton/>
        </div>
    );
};

export default Loading;