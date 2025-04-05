"use client";

import React, {useCallback, useEffect, useState} from 'react';
import {Calendar as CalendarIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {useRouter, useSearchParams} from 'next/navigation';

const DatePickerURL = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Function to get default dates
    const getDefaultDates = () => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        return {
            start: thirtyDaysAgo,
            end: tomorrow
        };
    };

    // Initialize dates from URL or defaults
    const [dateRange, setDateRange] = useState(() => {
        const defaults = getDefaultDates();
        return {
            startDate: new Date(searchParams.get('from') || defaults.start.toISOString()),
            endDate: new Date(searchParams.get('to') || defaults.end.toISOString())
        };
    });

    const formatDateForInput = (date: Date) => {
        return date.toISOString().split("T")[0];
    };

    const updateURLParameters = useCallback((start: Date, end: Date) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('from', formatDateForInput(start));
        params.set('to', formatDateForInput(end));
        router.push(`?${params.toString()}`);
    }, [router, searchParams]);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        const newDate = new Date(value);

        const newDateRange = {
            startDate: name === "from" ? newDate : dateRange.startDate,
            endDate: name === "to" ? newDate : dateRange.endDate
        };

        setDateRange(newDateRange);
        updateURLParameters(newDateRange.startDate, newDateRange.endDate);
    };

    // Sync URL parameters on component mount
    useEffect(() => {
        updateURLParameters(dateRange.startDate, dateRange.endDate);
    }, [dateRange.endDate, dateRange.startDate, updateURLParameters]);

    return (
        <div className="flex items-center justify-between">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="justify-start text-left font-normal bg-white hover:bg-white"
                    >
                        <CalendarIcon className="mr-2 h-4 w-4"/>
                        {dateRange.startDate && dateRange.endDate ? (
                            `${formatDateForInput(dateRange.startDate)} - ${formatDateForInput(dateRange.endDate)}`
                        ) : (
                            <span>Pick a date range</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4" align="start">
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium">From</label>
                        <input
                            type="date"
                            name="from"
                            value={formatDateForInput(dateRange.startDate)}
                            onChange={handleDateChange}
                            className="border rounded px-3 py-2"
                        />
                        <label className="text-sm font-medium">To</label>
                        <input
                            type="date"
                            name="to"
                            value={formatDateForInput(dateRange.endDate)}
                            onChange={handleDateChange}
                            className="border rounded px-3 py-2"
                        />
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default DatePickerURL;