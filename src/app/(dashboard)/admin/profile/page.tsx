import React, {Suspense} from 'react';
import ProfileCard, {ProfileCardSkeleton} from "@/app/(dashboard)/admin/profile/_compoenents/ProfileCard";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "PMS - Profile",
    description: "View and manage your profile.",
};

const ProfilePage = () => {
    return (
        <div className="flex items-center justify-center h-full">
            <Suspense fallback={<ProfileCardSkeleton/>}>
                <ProfileCard/>
            </Suspense>
        </div>
    );
};

export default ProfilePage;
