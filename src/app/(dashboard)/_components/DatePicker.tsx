"use client";
import React, { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function DatePicker() {
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  const handleDateChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex items-center justify-between">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !dateRange.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange.from && dateRange.to ? (
              `${dateRange.from} - ${dateRange.to}`
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
              value={dateRange.from}
              onChange={handleDateChange}
              className="border rounded px-3 py-2"
            />
            <label className="text-sm font-medium">To</label>
            <input
              type="date"
              name="to"
              value={dateRange.to}
              onChange={handleDateChange}
              className="border rounded px-3 py-2"
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
