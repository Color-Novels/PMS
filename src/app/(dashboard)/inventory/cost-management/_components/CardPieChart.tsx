"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import DatePicker from "@/app/(dashboard)/inventory/cost-management/_components/DatePickerCM";
import StockPieChart from "@/app/(dashboard)/inventory/cost-management/_components/StockPieChart";
import { getStockAnalysis } from "@/app/lib/actions";
import { StockAnalysis, PieChartData, DateRange } from "@/app/lib/definitions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CardOfPieChart() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Get dates from URL or use defaults
  const defaultStartDate = new Date(
    new Date().setMonth(new Date().getMonth() - 1)
  );
  const defaultEndDate = new Date();
  defaultEndDate.setHours(23, 59, 59, 999);

  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: searchParams.get("startDate")
      ? new Date(searchParams.get("startDate")!)
      : defaultStartDate,
    endDate: searchParams.get("endDate")
      ? new Date(searchParams.get("endDate")!)
      : defaultEndDate,
  });

  const [analysisData, setAnalysisData] = useState<StockAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getStockAnalysis(dateRange);
        setAnalysisData(data);
      } catch (error) {
        console.error("Error fetching analysis data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [dateRange]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
    }).format(value);
  };

  const getPieChartData = (data: StockAnalysis): PieChartData[] => {
    return [
      {
        name: "Available Stock Value",
        value: data.available,
        color: "#4CAF50",
      },
      { name: "Sold Value", value: data.sold, color: "#2196F3" },
      { name: "Expired Stock Value", value: data.expired, color: "#FF9800" },
      { name: "Disposed Stock Value", value: data.disposed, color: "#F44336" },
      {
        name: "Quality Failed Stock Value",
        value: data.quality_failed,
        color: "violet",
      },
      { name: "Error Stock Value", value: data.errors, color: "#9E9E9E" },
    ];
  };

  const handleDateChange = (newDateRange: DateRange) => {
    const params = new URLSearchParams(searchParams);
    params.set("startDate", newDateRange.startDate.toISOString().split("T")[0]);
    params.set("endDate", newDateRange.endDate.toISOString().split("T")[0]);
    replace(`${pathname}?${params.toString()}`);

    setDateRange(newDateRange);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary-500">
          Stock Value Analysis
        </CardTitle>
        <div className="flex items-center justify-end gap-4 mt-4">
          <h3 className="text-lg font-semibold text-primary-700 font-montserrat">
            Select the duration
          </h3>
          <DatePicker
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            action={handleDateChange}
          />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
          </div>
        ) : analysisData ? (
          <>
            <StockPieChart data={getPieChartData(analysisData)} />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
              {Object.entries(analysisData).map(([key, value]) => (
                <Card key={key}>
                  <CardContent className="p-4">
                    <p className="text-sm font-medium text-gray-500 capitalize">
                      {key.replace("_", " ")} Value
                    </p>
                    <p className="text-lg font-bold mt-2">
                      {formatCurrency(value)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">No data available</p>
        )}
      </CardContent>
    </Card>
  );
}
