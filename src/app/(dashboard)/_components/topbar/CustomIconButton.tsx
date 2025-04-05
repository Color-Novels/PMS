import React from "react";
import {cn} from "@/lib/utils";
import {LucideIcon} from "lucide-react";

interface CustomIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: LucideIcon;
    className?: string;
    iconSize?: number;
}

const CustomIconButton: React.FC<CustomIconButtonProps> = ({
                                                               icon: Icon,
                                                               className,
                                                               iconSize = 20,  // Default to 20px
                                                               ...props
                                                           }) => {
    return (
        <button
            className={cn(
                "flex items-center justify-center rounded-md p-2 transition-all hover:bg-gray-100",
                className
            )}
            {...props}
        >
            <Icon size={iconSize}/>
        </button>
    );
};

export default CustomIconButton;
