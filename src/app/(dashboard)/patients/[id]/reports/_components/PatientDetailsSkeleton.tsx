import {Skeleton} from "@/components/ui/skeleton";

const PatientDetailsSkeleton = () => {
    return (
        <div className="flex gap-4 items-center">
            {/* Avatar skeleton */}
            <Skeleton className="size-20 rounded-full flex-shrink-0"/>

            <div className="flex-1">
                {/* Name and age, gender badge row */}
                <div className="flex gap-4 justify-start items-center mb-2.5">
                    <Skeleton className="h-7 w-64"/>
                    <Skeleton className="h-6 w-20"/>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
                    {/* Create 6 skeleton rows for details */}
                    {[...Array(6)].map((_, index) => (
                        <div key={index} className="flex items-center space-x-4 py-1.5">
                            <Skeleton className="h-4 w-4 flex-shrink-0"/>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-20"/>
                                    <Skeleton className="h-4 w-24"/>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PatientDetailsSkeleton;