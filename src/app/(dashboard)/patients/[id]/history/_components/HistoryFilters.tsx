'use client';

import React, {useState, useEffect, useCallback} from 'react';
import {Search} from 'lucide-react';
import {Input} from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {getAllHistory} from "@/app/lib/actions/history";

interface HistoryFiltersProps {
    history: Awaited<ReturnType<typeof getAllHistory>>;
    onFilterChange: (filteredHistory: Awaited<ReturnType<typeof getAllHistory>>) => void;
}

const HistoryFilters: React.FC<HistoryFiltersProps> = ({history, onFilterChange}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState<string>('');

    // Get unique types from history
    const historyTypes = ['ALL', ...Array.from(new Set(history.map(item => item.type)))];

    // Use useCallback to memoize the filter function
    const applyFilters = useCallback(() => {
        // Apply filters
        let filteredResults = [...history];

        // Filter by search term
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filteredResults = filteredResults.filter(item =>
                item.name.toLowerCase().includes(searchLower) ||
                (item.description && item.description.toLowerCase().includes(searchLower))
            );
        }

        // Filter by type
        if (selectedType && selectedType !== 'ALL') {
            filteredResults = filteredResults.filter(item => item.type === selectedType);
        }

        return filteredResults;
    }, [searchTerm, selectedType, history]);

    // Apply filters when dependencies change
    useEffect(() => {
        const filteredResults = applyFilters();
        onFilterChange(filteredResults);
    }, [applyFilters, onFilterChange]);

    return (
        <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search Input - Styled like the example */}
                <div className="col-span-2 relative w-full min-w-56 h-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"/>
                    <Input
                        id="search-history"
                        className="h-full peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                        placeholder="Search by name or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>


                {/* Type Filter */}
                <Select
                    value={selectedType}
                    onValueChange={setSelectedType}
                >
                    <SelectTrigger id="type-filter" className="w-full">
                        <SelectValue placeholder="Select type"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {historyTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                    {type}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default HistoryFilters;