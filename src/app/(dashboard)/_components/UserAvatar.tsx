import React from 'react';
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {FaUserDoctor} from "react-icons/fa6";
import {FaUserNurse} from "react-icons/fa";
import {cn} from "@/lib/utils";
import {Gender, Role} from "@prisma/client";

interface UserAvatarProps {
    role: Role;
    gender: Gender;
    imageUrl: string | null;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const UserAvatar = ({
                        role = 'DOCTOR',
                        imageUrl,
                        gender,
                        size = 'md',
                    }: UserAvatarProps) => {
    // Size mappings
    const sizeClasses = {
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-12 w-12',
        xl: 'h-32 w-32',
    };

    const iconSizes = {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
        xl: 'h-16 w-16',
    };

    return (
        <Avatar className={cn(
            sizeClasses[size],
            "transition-all duration-150"
        )}>
            {imageUrl && <AvatarImage src={imageUrl} alt={role}/>}
            <AvatarFallback className={cn(
                "flex items-center justify-center",
                gender === Gender.MALE
                    ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                    : "bg-pink-100 text-pink-600 hover:bg-pink-200"
            )}>
                {role === Role.DOCTOR ? (
                    <FaUserDoctor className={iconSizes[size]}/>
                ) : (
                    <FaUserNurse className={iconSizes[size]}/>
                )}
            </AvatarFallback>
        </Avatar>
    );
};

export default UserAvatar;