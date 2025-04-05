// app/(dashboard)/_components/DatePicker.tsx
"use client";

import React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "@/app/lib/definitions";
import { format } from "date-fns";
interface DatePickerProps {
  startDate: Date;
  endDate: Date;
  action: (dateRange: DateRange) => void;
}

export default function DatePicker({
  startDate,
  endDate,
  action,
}: DatePickerProps) {
  const formatDateForInput = (date: Date) => {
    return format(date, "yyyy-MM-dd"); // Formats as YYYY-MM-DD (local date)
  };

  const handleDateChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    const newDate = new Date(value);

    action({
      startDate: name === "from" ? newDate : startDate,
      endDate: name === "to" ? newDate : endDate,
    });
  };

  return (
    <div className="flex items-center justify-between">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !startDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {startDate && endDate ? (
              `${formatDateForInput(startDate)} - ${formatDateForInput(
                endDate
              )}`
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
              value={formatDateForInput(startDate)}
              onChange={handleDateChange}
              className="border rounded px-3 py-2"
            />
            <label className="text-sm font-medium">To</label>
            <input
              type="date"
              name="to"
              value={formatDateForInput(endDate)}
              onChange={handleDateChange}
              className="border rounded px-3 py-2"
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
