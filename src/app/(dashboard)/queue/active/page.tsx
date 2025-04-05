import React from 'react';
import {redirect} from "next/navigation";
import {getActiveQueue} from "@/app/lib/actions/queue";

const Page = async () => {
    const queue = await getActiveQueue();
    if (queue) {
        redirect(`/queue/${queue.id}`);
    }

    return (
        <div className="w-full h-full flex items-center justify-center">
            <p>No active queue</p>
        </div>
    );
};

export default Page;
