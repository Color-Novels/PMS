import React from 'react';
import UserAvatar from "@/app/(dashboard)/_components/UserAvatar";
import {Button} from "@/components/ui/button";
import {Edit, Key} from "lucide-react";
import {Card, CardContent} from "@/components/ui/card";
import {verifySession} from "@/app/lib/sessions";
import {Skeleton} from "@/components/ui/skeleton";
import EditProfileDialog from "@/app/(dashboard)/admin/_components/EditProfileDialog";
import ChangePasswordDialog from "@/app/(dashboard)/admin/_components/ChangePasswordDialog";

import {getUser} from "@/app/lib/actions/account";

const ProfileCard = async () => {
    const session = await verifySession();
    const user = await getUser(session.id);

    if (!user) {
        return null;
    }

    return (
        <Card className={"flex py-12 px-6 shadow-lg text-center max-w-md w-full"}>
            <CardContent className={"flex flex-col items-center gap-4 w-full"}>
                {/* Profile Picture */}
                <div className="flex flex-col items-center gap-1">
                    <UserAvatar
                        imageUrl={user.image}
                        size="xl"
                        gender={user.gender}
                        role={user.role}
                    />
                    <h2 className="mt-4 text-2xl font-semibold text-primary-700">{user.name}</h2>
                    <p className="text-gray-500">{user.email}</p>
                    <p className="text-gray-500">{user.mobile}</p>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex flex-col gap-4">
                    <EditProfileDialog initial={{
                        id: session.id,
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        gender: user.gender,
                        telephone: user.mobile,
                    }} trigger={
                        <Button variant="outline" className="flex items-center justify-center gap-2 w-full">
                            <Edit size={16}/> Edit Profile
                        </Button>
                    }/>
                    <ChangePasswordDialog userID={session.id} currentPw={true} trigger={
                        <Button className="flex items-center justify-center gap-2 w-full">
                            <Key size={16}/> Change Password
                        </Button>
                    }/>
                </div>
            </CardContent>
        </Card>
    )
        ;
};


const ProfileCardSkeleton = () => {
    return (
        <div className="w-full max-w-md">
            <Card className="py-12 px-6 shadow-lg text-center">
                <CardContent className="flex flex-col items-center gap-4">
                    {/* Profile Picture Skeleton */}
                    <Skeleton className="w-24 h-24 rounded-full"/>
                    <Skeleton className="w-32 h-6"/>
                    <Skeleton className="w-40 h-4"/>
                    <Skeleton className="w-36 h-4"/>

                    {/* Action Buttons Skeleton */}
                    <div className="mt-6 flex flex-col gap-4 w-full">
                        <Skeleton className="h-10 w-full"/>
                        <Skeleton className="h-10 w-full"/>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export {ProfileCardSkeleton};

export default ProfileCard;