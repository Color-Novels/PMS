import React from 'react';
import UserAvatar from "@/app/(dashboard)/_components/UserAvatar";
import {Skeleton} from "@/components/ui/skeleton";
import Link from "next/link";
import {getUser} from "@/app/lib/actions/account";
import {SessionPayload} from "@/app/lib/definitions";

const UserDetails = async ({session}: { session: SessionPayload }) => {
    const user = await getUser(session.id);

    if (!user) {
        return null
    }

    return (
        <Link href={'/admin/profile'}>
            <div className="flex items-center gap-3">
                <div className="flex flex-col">
                    <span className="font-medium text-sm">{user.name}</span>
                </div>
                <UserAvatar
                    role={user.role}
                    imageUrl={user.image}
                    size="sm"
                    gender={user.gender}
                />
            </div>
        </Link>
    );
};


const UserDetailsSkeleton = () => {
    return (
        <div className="flex items-center gap-3">
            <Skeleton className="w-20 h-4"/>
            <Skeleton className="w-8 h-8 rounded-full"/>
        </div>
    );
}

export {UserDetailsSkeleton};

export default UserDetails;