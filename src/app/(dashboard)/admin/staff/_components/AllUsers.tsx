import React from 'react';
import {StaffCard} from "@/app/(dashboard)/admin/staff/_components/StaffCard";
import {getStaff} from "@/app/lib/auth";

type Staff = Awaited<ReturnType<typeof getStaff>>;

const AllUsers = async () => {
    const staff: Staff = await getStaff();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staff.map((user) => (
                <StaffCard
                    gender={user.gender}
                    key={user.id}
                    name={user.name}
                    email={user.email}
                    telephone={user.mobile}
                    profilePic={user.image}
                    id={user.id}
                />
            ))}
        </div>
    );
};

export default AllUsers;