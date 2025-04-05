import React from 'react';
import {Card} from "@/components/ui/card";

const StatusCard = ({icon, text, number}: { icon: string, text: string, number: number }) => {
    return (
        <Card className={'py-6 px-4 flex justify-start gap-5 w-full'}>
            <Card className={'bg-white text-3xl size-14 flex items-center justify-center'}>
                {icon}
            </Card>
            <div className={'flex flex-col'}>
                <span className={'text-md font-semibold text-gray-800'}>{text}</span>
                <span className={'text-gray-900 text-lg font-bold'}>{number}</span>
            </div>
        </Card>
    )
        ;
};

export default StatusCard;