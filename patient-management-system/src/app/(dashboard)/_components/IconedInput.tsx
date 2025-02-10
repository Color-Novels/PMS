import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

type IconedInputProps = {
    icon: ReactNode;
    name: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: string;
    className?: string;
};

export const IconedInput = ({
                                icon,
                                name,
                                value,
                                onChange,
                                placeholder,
                                type = "text",
                                className,
                            }: IconedInputProps) => {
    return (
        <div className={cn("bg-white flex items-center border p-3 rounded-md w-full focus-within:ring-2 focus-within:ring-primary", className)}>
            <span className="text-gray-500 mr-3">{icon}</span>
            <Input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full focus:outline-none border-none shadow-none"
            />
        </div>
    );
};
