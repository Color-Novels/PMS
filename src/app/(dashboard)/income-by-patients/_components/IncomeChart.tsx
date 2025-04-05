"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { FaChartLine } from "react-icons/fa";

interface DailyIncomeData {
  date: Date;
  totalIncome: number;
  patientCount: number;
}

interface DailyIncomeChartProps {
  incomeData: DailyIncomeData[];
}

const DailyIncomeChart = ({ incomeData }: DailyIncomeChartProps) => {
  // Format the data for the chart
  const chartData = incomeData.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-LK", {
      day: "numeric",
      month: "short",
    }),
    income: item.totalIncome,
    patients: item.patientCount,
    avgPerPatient:
      item.patientCount > 0
        ? Math.round(item.totalIncome / item.patientCount)
        : 0,
  }));

  // Sort data by date
  chartData.sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return (
    <Card className="w-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 shadow-lg">
      <CardHeader className="border-b pb-3">
        <CardTitle className="flex items-center text-blue-700 dark:text-blue-400">
          <FaChartLine className="mr-2" />
          Daily Income Trends
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 30,
                bottom: 20,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#9CA3AF"
                opacity={0.3}
              />
              <XAxis
                dataKey="date"
                tick={{ fill: "#6B7280" }}
                tickLine={{ stroke: "#9CA3AF" }}
                axisLine={{ stroke: "#9CA3AF" }}
                label={{
                  value: "Date",
                  position: "insideBottom",
                  offset: -5,
                  fill: "#6B7280",
                }}
              />
              <YAxis
                yAxisId="left"
                tick={{ fill: "#6B7280" }}
                tickLine={{ stroke: "#9CA3AF" }}
                axisLine={{ stroke: "#9CA3AF" }}
                tickFormatter={(value) => `LKR ${value.toLocaleString()}`}
                label={{
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle" },
                  fill: "#6B7280",
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: "#6B7280" }}
                tickLine={{ stroke: "#9CA3AF" }}
                axisLine={{ stroke: "#9CA3AF" }}
                label={{
                  value: "Number of Patients",
                  angle: 90,
                  position: "insideRight",
                  style: { textAnchor: "middle" },
                  fill: "#6B7280",
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "8px",
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value: number, name: string) => {
                  if (name === "Income") {
                    return [`LKR ${value.toLocaleString()}`, name];
                  } else if (name === "Avg. Per Patient") {
                    return [`LKR ${value.toLocaleString()}`, name];
                  } else {
                    return [value, name];
                  }
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                name="Income"
                yAxisId="left"
                stroke="#4F46E5"
                strokeWidth={3}
                dot={{
                  stroke: "#312E81",
                  strokeWidth: 2,
                  fill: "#4F46E5",
                  r: 4,
                }}
                activeDot={{
                  r: 8,
                  stroke: "#312E81",
                  strokeWidth: 2,
                  fill: "#4F46E5",
                }}
              />
              <Line
                type="monotone"
                dataKey="patients"
                name="Patients"
                yAxisId="right"
                stroke="#F97316"
                strokeWidth={3}
                dot={{
                  stroke: "#EA580C",
                  strokeWidth: 2,
                  fill: "#FFEDD5",
                  r: 4,
                }}
                activeDot={{
                  r: 8,
                  stroke: "#EA580C",
                  strokeWidth: 2,
                  fill: "#F97316",
                }}
              />
              <Line
                type="monotone"
                dataKey="avgPerPatient"
                name="Avg. Per Patient"
                yAxisId="left"
                stroke="#10B981"
                strokeWidth={3}
                dot={{
                  stroke: "#047857",
                  strokeWidth: 2,
                  fill: "#ECFDF5",
                  r: 4,
                }}
                activeDot={{
                  r: 8,
                  stroke: "#047857",
                  strokeWidth: 2,
                  fill: "#10B981",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyIncomeChart;
