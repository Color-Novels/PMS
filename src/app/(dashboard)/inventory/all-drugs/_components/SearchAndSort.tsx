// components/drugs/search-and-sort.tsx
"use client"

import {useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Search, SlidersHorizontal, ChevronDown} from "lucide-react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {FilterSidebar} from "@/app/(dashboard)/inventory/all-drugs/_components/FilterSidebar";

export function SearchAndSort() {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("stockDate:desc");

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createQueryString = (name: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(name, value);
        return params.toString();
    };

    const handleSearch = () => {
        router.push(`${pathname}?${createQueryString("query", searchTerm)}`);
    };

    const handleSort = (value: string) => {
        setSortOption(value);
        router.push(`${pathname}?${createQueryString("sort", value)}`);
    };

    const sortOptions = [
        {value: "name:asc", label: "Name (A-Z)"},
        {value: "name:desc", label: "Name (Z-A)"},
        {value: "stockDate:asc", label: "Stock Date (Earliest)"},
        {value: "stockDate:desc", label: "Stock Date (Latest)"},
        {value: "expiry:asc", label: "Expiry Date (Earliest)"},
        {value: "expiry:desc", label: "Expiry Date (Latest)"},
        {value: "remaining_amount:asc", label: "Stock (Lowest)"},
        {value: "remaining_amount:desc", label: "Stock (Highest)"},
    ];

    return (
        <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"/>
                <Input
                    placeholder="Search drugs by name, brand, or batch..."
                    className="pl-9 h-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
            </div>

            <div className="flex gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex gap-1 bg-white">
                            <SlidersHorizontal className="h-4 w-4"/>
                            <span className="hidden sm:inline">Sort</span>
                            <ChevronDown className="h-3.5 w-3.5 opacity-70"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuRadioGroup value={sortOption} onValueChange={handleSort}>
                            {sortOptions.map(option => (
                                <DropdownMenuRadioItem key={option.value} value={option.value}>
                                    {option.label}
                                </DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button type="submit" onClick={handleSearch}>
                    Search
                </Button>
                <FilterSidebar/>
            </div>
        </div>
    );
}