'use client';

import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popoverModified";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface Option {
    id: string | number;
    name: string;
}

interface PopoverSelectProps {
    options: Option[];
    value?: string | number | null;
    onChange: (value: string | number) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    noOptionsMessage?: string;
    isSearching?: boolean;
    onSearch?: (searchTerm: string) => void;
    className?: string;
    disabled?: boolean;
}

const PopoverSelect = ({
                           options,
                           value,
                           onChange,
                           placeholder = "Select an option...",
                           searchPlaceholder = "Search options...",
                           noOptionsMessage = "No options found.",
                           isSearching = false,
                           onSearch,
                           className,
                           disabled = false,
                       }: PopoverSelectProps) => {
    const [popoverOpen, setPopoverOpen] = useState(false);

    const handleSelect = (selectedValue: string) => {
        onChange(selectedValue);
        setPopoverOpen(false);
    };

    const handleSearch = (searchTerm: string) => {
        onSearch?.(searchTerm);
    };

    const selectedOption = options.find((option) => option.id === value);

    return (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={popoverOpen}
                    disabled={disabled}
                    className={cn(
                        "w-full justify-between h-10 rounded-lg border-2 transition-all duration-200",
                        value
                            ? "border-primary-500 shadow-sm"
                            : "border-gray-300 hover:border-gray-400",
                        className
                    )}
                >
                    {selectedOption ? selectedOption.name : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder={searchPlaceholder}
                        onValueChange={handleSearch}
                    />
                    <CommandList>
                        <CommandEmpty className="p-4 text-center">
                            {isSearching ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Searching...</span>
                                </div>
                            ) : (
                                noOptionsMessage
                            )}
                        </CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.id}
                                    value={String(option.id)}
                                    onSelect={() => handleSelect(String(option.id))}
                                    className="flex items-center justify-between"
                                >
                                    <span>{option.name}</span>
                                    <Check
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            value === option.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default PopoverSelect;