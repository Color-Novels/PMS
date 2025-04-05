'use client';

import React, {useState, useCallback, JSX} from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Slice, Stethoscope, HeartPulse, Users, AlertCircle } from 'lucide-react';
import { BasicColorType, CustomBadge } from "@/app/(dashboard)/_components/CustomBadge";
import DeleteHistory from "@/app/(dashboard)/patients/[id]/history/_components/DeleteHistory";
import HistoryFilters from "./HistoryFilters";
import { getAllHistory } from "@/app/lib/actions/history";

// Helper function to get icon and color based on history type
const getHistoryTypeDetails = (type: string): {
    icon: JSX.Element;
    color: string;
    borderColor: string;
    badgeColor: keyof BasicColorType;
} => {
    switch (type) {
        case 'MEDICAL':
            return {
                icon: <Stethoscope className="h-5 w-5"/>,
                color: 'bg-blue-500',
                borderColor: 'border-l-blue-500',
                badgeColor: 'blue',
            };
        case 'SURGICAL':
            return {
                icon: <Slice className="h-5 w-5"/>,
                color: 'bg-purple-500',
                borderColor: 'border-l-purple-500',
                badgeColor: 'purple',
            };
        case 'FAMILY':
            return {
                icon: <Users className="h-5 w-5"/>,
                color: 'bg-green-500',
                borderColor: 'border-l-green-500',
                badgeColor: 'green',
            };
        case 'SOCIAL':
            return {
                icon: <HeartPulse className="h-5 w-5"/>,
                color: 'bg-pink-500',
                borderColor: 'border-l-pink-500',
                badgeColor: 'pink',
            };
        case 'ALLERGY':
            return {
                icon: <AlertCircle className="h-5 w-5"/>,
                color: 'bg-red-500',
                borderColor: 'border-l-red-500',
                badgeColor: 'red',
            };
        default:
            return {
                icon: <Slice className="h-5 w-5"/>,
                color: 'bg-gray-500',
                borderColor: 'border-l-gray-500',
                badgeColor: 'gray',
            };
    }
};

interface HistoryListProps {
    initialHistory: Awaited<ReturnType<typeof getAllHistory>>;
}

const HistoryList = ({ initialHistory }: HistoryListProps) => {
    const [filteredHistory, setFilteredHistory] = useState(initialHistory);

    // Use useCallback to memoize the filter change handler
    const handleFilterChange = useCallback((newFilteredHistory: typeof initialHistory) => {
        setFilteredHistory(newFilteredHistory);
    }, []);

    const renderEmptyState = () => (
        <div className="flex flex-col items-center justify-center p-8 text-center">
            <Slice className="h-12 w-12 text-gray-400 mb-3"/>
            <h3 className="text-lg font-medium">No history records found</h3>
            <p className="text-sm text-gray-500 mt-2">
                Adjust your search or filter criteria to see more results.
            </p>
        </div>
    );

    return (
        <>
            <HistoryFilters
                history={initialHistory}
                onFilterChange={handleFilterChange}
            />

            {filteredHistory.length === 0 ? (
                renderEmptyState()
            ) : (
                <div className="space-y-3 py-2">
                    {filteredHistory.map((item) => {
                        const {icon, color, borderColor, badgeColor} = getHistoryTypeDetails(item.type);

                        return (
                            <Card key={item.id}
                                  className={`overflow-hidden border-l-4 shadow-sm hover:shadow ${borderColor}`}>
                                <CardContent className="p-0">
                                    <div className="flex items-center p-4">
                                        {/* Timeline dot */}
                                        <div className={`rounded-full p-2 ${color} text-white mr-4`}>
                                            {icon}
                                        </div>

                                        <div className="flex-grow min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                                                <div className="flex items-center gap-2">
                                                    <CustomBadge color={badgeColor} text={item.type}/>
                                                    <span
                                                        className="text-xs text-gray-500">
                                                        {format(new Date(item.time), 'PPp')}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-semibold">{item.name}</p>
                                                <p className="text-sm text-gray-600">
                                                    {item.description ? item.description : 'No description'}
                                                </p>
                                            </div>
                                        </div>
                                        <DeleteHistory id={item.id}/>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </>
    );
};

export default HistoryList;