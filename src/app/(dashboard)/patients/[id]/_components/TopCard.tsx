import React, {Suspense} from 'react';
import {Card, CardContent} from "@/components/ui/card";
import PatientDetails from "@/app/(dashboard)/patients/[id]/_components/PatientDetails";
import PatientDetailsSkeleton from "@/app/(dashboard)/patients/[id]/reports/_components/PatientDetailsSkeleton";
import TabsWrapper, {TabsSkeleton} from "@/app/(dashboard)/patients/[id]/_components/TabsWrapper";

const TopCard = async ({id}: { id: number }) => {
    return (
        <Card className={'hover:shadow-md transition duration-300'}>
            <CardContent className={'p-4'}>
                <Suspense fallback={<PatientDetailsSkeleton/>}>
                    <PatientDetails id={id}/>
                </Suspense>
                <Suspense fallback={<TabsSkeleton/>}>
                    <TabsWrapper id={id}/>
                </Suspense>
            </CardContent>
        </Card>
    );
};

export default TopCard;