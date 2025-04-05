import PendingPatients from "@/app/(dashboard)/_components/topbar/PendingPatients";
import React, {Suspense} from "react";
import CustomSideBarTrigger from "@/app/(dashboard)/_components/topbar/CustomSideBarTrigger";
import UserDetails, {UserDetailsSkeleton} from "@/app/(dashboard)/_components/topbar/user-details";
import Link from "next/link";
import {LogOut} from "lucide-react";
import {verifySession} from "@/app/lib/sessions";


export default async function TopBar() {
    const session = await verifySession();

    return (
        <div
            className={"h-14 w-full bg-white flex items-center justify-between px-1 py-3 border-b border-primary-900/25 shadow"}>
            <div className={"flex items-center gap-3"}>
                <CustomSideBarTrigger/>
                <PendingPatients session={session} />
            </div>
            <div>
                <div className={"flex gap-3 items-center"}>
                    <Suspense fallback={<UserDetailsSkeleton/>}>
                        <UserDetails session={session}/>
                    </Suspense>
                    <Link href={"/logout"} className={'flex items-center justify-center rounded-md p-2 transition-all hover:bg-gray-100'}>
                        <LogOut className={"cursor-pointer"} size={18}/>
                    </Link>
                </div>
            </div>
        </div>
    );
}