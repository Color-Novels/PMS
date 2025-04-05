import React from "react";
import {Skeleton} from "@/components/ui/skeleton";
import {Card, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {
    SidebarHistoryListSkeleton
} from "@/app/(dashboard)/patients/[id]/prescriptions/add/_components/CompactSidebarHistoryList";

const PrescriptionFormSkeleton = () => {
    return (
        <div className="grid grid-cols-4 gap-4">
            <Card className="p-4 space-y-4 col-span-3">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-40"/>
                    <Skeleton className="h-4 w-16"/>
                </div>
                <Card className="bg-slate-100 p-4 space-y-6">
                    <Skeleton className="h-5 w-48"/>
                    <Skeleton className="h-10 w-full"/>
                    <Skeleton className="h-5 w-48"/>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Array(4).fill(0).map((_, index) => (
                            <div key={index} className="space-y-2">
                                <Skeleton className="h-5 w-32"/>
                                <Skeleton className="h-10 w-full"/>
                            </div>
                        ))}
                    </div>
                    <Skeleton className="h-5 w-48"/>
                    <Skeleton className="h-20 w-full"/>
                    <Skeleton className="h-5 w-48"/>
                    <Skeleton className="h-10 w-full"/>
                </Card>
                <Card className='bg-slate-100 p-4 space-y-6'>
                    <Skeleton className={'h-5 w-24'}/>
                    <Skeleton className="h-5 w-48"/>
                    <Skeleton className="h-16 w-full"/>
                    <Skeleton className="h-5 w-48"/>
                    <Skeleton className="h-16 w-full"/>
                </Card>
                <div className="flex">
                    <Button disabled className="px-8 w-full">
                        <Skeleton className="h-6 w-24"/>
                    </Button>
                </div>
            </Card>
            <Card className={'col-span-1'}>
                <CardHeader className={'pb-2'}>
                    <div className={'flex flex-row justify-center gap-2 items-center text-center'}>
                        <Skeleton className="h-5 w-24"/>
                        <Skeleton className="h-10 w-full"/>
                    </div>
                </CardHeader>
                <SidebarHistoryListSkeleton/>
            </Card>
        </div>
    );
};

export default PrescriptionFormSkeleton;