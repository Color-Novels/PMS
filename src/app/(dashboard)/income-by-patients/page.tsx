import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getDailyIncomes,
  getIncomeStats,
} from "@/app/lib/actions/dailyIncomes";
import IncomeCard from "@/app/(dashboard)/income-by-patients/_components/IncomeCard";
import IncomeHeader from "@/app/(dashboard)/income-by-patients/_components/IncomeHeader";
import DailyIncomeChart from "@/app/(dashboard)/income-by-patients/_components/IncomeChart";
import { Suspense } from "react";
import { FaClipboardList } from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { AiOutlineUser } from "react-icons/ai";
import { verifySession } from "@/app/lib/sessions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily Income",
  description: "View daily income and patient count.",
};

async function IncomeContent({ start, end }: { start: Date; end: Date }) {
  const dateRange = { startDate: start, endDate: end };
  const incomes = await getDailyIncomes(dateRange);
  const stats = await getIncomeStats(dateRange);

  return (
    <>
      {stats && (
        <Card className="w-full bg-primary/5">
          <CardHeader>
            <CardTitle>
              Summary
              <FaClipboardList className="inline-block ml-2" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <FaRegMoneyBillAlt className="text-lg" /> Total Income
                </p>
                <p className="text-xl font-bold">
                  {new Intl.NumberFormat("en-LK", {
                    style: "currency",
                    currency: "LKR",
                  }).format(stats.totalIncome)}
                </p>
              </div>
              <div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <IoIosPeople className="text-lg" /> Total Patients
                  </p>
                </div>
                <p className="text-xl font-bold">{stats.patientCount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <AiOutlineUser className="text-lg" /> Average per Patient
                </p>
                <p className="text-xl font-bold">
                  {new Intl.NumberFormat("en-LK", {
                    style: "currency",
                    currency: "LKR",
                  }).format(stats.averagePerPatient)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add the DailyIncomeChart component here */}
      <DailyIncomeChart incomeData={incomes} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {incomes.map((income) => (
          <IncomeCard
            key={income.date.toISOString()}
            date={income.date}
            totalIncome={income.totalIncome}
            patientCount={income.patientCount}
          />
        ))}
      </div>
    </>
  );
}

interface PageProps {
  start: string;
  end: string;
}

export default async function PatientIncomePage({
  searchParams,
}: {
  searchParams: Promise<PageProps>;
}) {
  // Verify session and get user role
  const session = await verifySession();
  const isNurse = session.role !== "DOCTOR";

  // Calculate date range based on role
  let end = new Date();
  let start = new Date();

  if (isNurse) {
    // For nurses: Show today to 3 days ahead
    end.setDate(end.getDate() + 3);
    start.setHours(23, 59, 59, 999);
  } else {
    // For doctors: Use search params or default to 7 days
    end.setDate(end.getDate() + 1);
    start.setDate(start.getDate() - 7);
    start.setHours(23, 59, 59, 999);

    const resolvedParams = await searchParams;
    if (resolvedParams.start) start = new Date(resolvedParams.start);
    if (resolvedParams.end) end = new Date(resolvedParams.end);
  }

  return (
    <div className="p-6 space-y-6">
      {!isNurse && <IncomeHeader start={start} end={end} />}
      <Suspense fallback={<div>Loading...</div>}>
        <IncomeContent start={start} end={end} />
      </Suspense>
    </div>
  );
}
