import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

interface IncomeCardProps {
    date: Date;
    totalIncome: number;
    patientCount: number;
}

import {CalendarDays, Users, DollarSign} from "lucide-react";
import {format, isSameDay} from "date-fns";

export default function IncomeCard({
                                       date,
                                       totalIncome,
                                       patientCount,
                                   }: IncomeCardProps) {
    const formattedDate = format(new Date(date), "eeee, MMMM dd, yyyy");
    const isToday = isSameDay(new Date(), date);

    const formattedIncome = new Intl.NumberFormat("en-LK", {
        style: "currency",
        currency: "LKR",
    }).format(totalIncome);

    const averagePerPatient =
        patientCount > 0
            ? new Intl.NumberFormat("en-LK", {
                style: "currency",
                currency: "LKR",
            }).format(totalIncome / patientCount)
            : "N/A";

    return (
        <Card className={`border-2 ${isToday ? "border-primary" : "border-transparent"}`}>
            <CardHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarDays className="w-5 h-5 text-primary"/>
                    <CardTitle className="text-md">{formattedDate}</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="w-5 h-5 text-green-600"/>
                        <span>Total Income:</span>
                    </div>
                    <span className="text-lg text-primary-700 font-bold">{formattedIncome}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-5 h-5 text-blue-600"/>
                        <span>Patients:</span>
                    </div>
                    <span className="text-md font-semibold">{patientCount}</span>
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="w-5 h-5 text-yellow-600"/>
                        <span>Avg. per Patient:</span>
                    </div>
                    <span className="text-md font-semibold">{averagePerPatient}</span>
                </div>
            </CardContent>
        </Card>
    );
}

