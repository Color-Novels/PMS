'use client';

import Button from "@/app/_components/PrimaryButton";
import {redirect, usePathname, useSearchParams} from "next/navigation";
import {useRouter} from "next/navigation";
import {handleServerAction} from "@/app/lib/utils";

import {addQueue} from "@/app/lib/actions/queue";

// Queue Button Component
const QueueButton = () => {

    const searchParams = useSearchParams();
    const {replace} = useRouter();
    const pathName = usePathname();

    const handleClick = async () => {
        const result = await handleServerAction(() => addQueue(), {
            loadingMessage: 'Creating Queue...'
        })

        if (!result.success) {
            return;
        }

        const params = new URLSearchParams(searchParams);
        params.set('page', '1');
        replace(`${pathName}?${params.toString()}`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        redirect("/queue/active");
    };

    return (
        <Button handleClick={handleClick} text={'Create A Queue'}/>
    );
};

export default QueueButton;