import React from 'react';
import {verifySession} from "@/app/lib/sessions";
import Tabs from '@/app/(dashboard)/patients/[id]/_components/Tabs';
import {Skeleton} from "@/components/ui/skeleton";

const TabsWrapper = async ({id}: { id: number }) => {
    const session = await verifySession();
    return (
        <Tabs patientId={id} role={session.role}/>
    );
};

const TabsSkeleton = () => {
    return (
        <div className="mt-6 border-t pt-4 h-14">
            <Skeleton className="w-full h-full"/>
        </div>
    )
}

export default TabsWrapper;
export {TabsSkeleton};