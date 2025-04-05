import React from 'react';
import {Skeleton} from "@/components/ui/skeleton";

const Loading = () => {
    return (
        <div className="flex flex-col w-full gap-6 p-4">
            <Skeleton className="w-1/4 h-10"/>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="w-full h-48"/>
                ))}
            </div>
        </div>
    );
};

export default Loading;