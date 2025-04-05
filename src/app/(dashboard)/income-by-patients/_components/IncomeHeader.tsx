"use client";

import {useState} from "react";
import DatePicker from "@/app/(dashboard)/inventory/cost-management/_components/DatePickerCM";
import {DateRange} from "@/app/lib/definitions";
import {useRouter} from "next/navigation";

interface IncomeHeaderProps {
    start: Date;
    end: Date;
}

export default function IncomeHeader({start, end}: IncomeHeaderProps) {
    const router = useRouter();

    // Manage state
    const [dateRange, setDateRange] = useState<DateRange>({
        startDate: start,
        endDate: end,
    });

    // Handle date change and update URL
    const handleDateChange = (newDateRange: DateRange) => {
        setDateRange(newDateRange);
        const start = newDateRange.startDate.toISOString().split("T")[0];
        const end = newDateRange.endDate.toISOString().split("T")[0];
        router.push(`/income-by-patients?start=${start}&end=${end}`);
    };

    return (
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-primary-700">
                Daily Income
            </h1>
            <DatePicker
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
                action={handleDateChange}
            />
        </div>
    );
}
