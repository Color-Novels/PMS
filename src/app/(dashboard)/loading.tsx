import React from "react";
import {Skeleton} from "@/components/ui/skeleton";

export default function LoadingPage() {
    return (
        <div className="p-6 space-y-6">
            {/* Skeleton Cards */}
            <div className="grid grid-cols-3 gap-4">
                <Skeleton className="h-32 w-full"/>
                <Skeleton className="h-32 w-full "/>
                <Skeleton className="h-32 w-full "/>
            </div>

            {/* Skeleton Rows */}
            <div className="space-y-4">
                <Skeleton className="h-16 w-full"/>
                <Skeleton className="h-16 w-full"/>
                <Skeleton className="h-16 w-full"/>
                <Skeleton className="h-16 w-full"/>
                <Skeleton className="h-16 w-full"/>
            </div>
        </div>
    );
}
