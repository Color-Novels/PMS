import React from 'react';
import StatusCard from "@/app/(dashboard)/queue/[id]/_components/StatusCard";

import {getQueueStatusesCount} from "@/app/lib/actions/queue";

const CardWrapper = async ({id}: { id: number }) => {
    const statuses = await getQueueStatusesCount(id);
    
    return (
        <div className={'flex gap-5'}>
            <StatusCard icon={'⌛'} text={'Pending'} number={statuses.PENDING}/>
            <StatusCard icon={'💊'} text={'Prescribed'} number={statuses.PRESCRIBED}/>
            <StatusCard icon={'✅'} text={'Completed'} number={statuses.COMPLETED}/>
        </div>
    );
};

export default CardWrapper;