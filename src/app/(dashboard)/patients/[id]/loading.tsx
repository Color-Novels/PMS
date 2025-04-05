import React from 'react';
import {Skeleton} from "@/components/ui/skeleton";

const Loading = () => {
    return (
        <div className={'flex flex-col gap-y-4'}>
            <Skeleton className={'w-full h-[250px]'}/>
            <Skeleton className={'w-full h-[80px]'}/>
            <Skeleton className={'w-full h-[80px]'}/>
        </div>
    );
};

export default Loading;