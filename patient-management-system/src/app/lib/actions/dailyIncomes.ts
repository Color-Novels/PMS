"use server";

//server actions for getting daily income.

import { DateRange } from "@/app/lib/definitions";
import { prisma } from "@/app/lib/prisma";
import { verifySession } from "@/app/lib/sessions";

export async function getDailyIncomes(dateRange: DateRange) {
    const { startDate, endDate } = dateRange;
    // Only tomorrow to one day back for the nurse
    const session = await verifySession();
    if (session.role !== "DOCTOR") {
        const today = new Date();
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        endDate.setDate(today.getDate() + 1);
        startDate.setDate(today.getDate() - 4);
    }

    const prescriptions = await prisma.prescription.findMany({
        where: {
            time: {
                gte: startDate,
                lte: endDate,
            },
        },
        select: {
            finalPrice: true,
            time: true,
        },
    });

    // Group bills by date and calculate totals
    const groupedByDate = prescriptions.reduce((acc, prescription) => {
        // Convert to Date object right away instead of string
        const date = new Date(prescription.time);
        // Use midnight of the day for consistent grouping
        const dateKey = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        );

        const dateKeyString = dateKey.toISOString().split("T")[0];
        if (!acc[dateKeyString]) {
            acc[dateKeyString] = {
                date: dateKey, // Store the Date object
                totalIncome: 0,
                patientCount: 0,
            };
        }

        const totalBillAmount = prescription.finalPrice || 0;

        acc[dateKeyString].totalIncome += totalBillAmount;
        acc[dateKeyString].patientCount += 1;

        return acc;
    }, {} as Record<string, { date: Date; totalIncome: number; patientCount: number }>);

    // Convert to array and sort by date
    const dailyIncomes = Object.values(groupedByDate).map((data) => ({
        date: data.date,
        totalIncome: data.totalIncome,
        patientCount: data.patientCount,
    }));

    // Sort by date in descending order using timestamp comparison
    return dailyIncomes.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export async function getIncomeStats(dateRange: DateRange) {
    const dailyIncomes = await getDailyIncomes(dateRange);

    const totalIncome = dailyIncomes.reduce(
        (sum, day) => sum + day.totalIncome,
        0
    );
    const patientCount = dailyIncomes.reduce(
        (sum, day) => sum + day.patientCount,
        0
    );

    return {
        totalIncome,
        patientCount,
        averagePerPatient: patientCount > 0 ? totalIncome / patientCount : 0,
    };
}
