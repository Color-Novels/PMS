// components/drugs/columns.tsx
import {ColumnDef} from "@tanstack/react-table";
import {format} from "date-fns";
import {Drug} from "../lib/types";
import {DataTableColumnHeader} from "./ui/data-table-column-header";
import {BatchStatus} from "@prisma/client";
import {BasicColorType, CustomBadge} from "@/app/(dashboard)/_components/CustomBadge";

export const columns: ColumnDef<Drug>[] = [
    {
        accessorKey: "name",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Drug Name"/>
        ),
        cell: ({row}) => (
            <div className="font-medium">{row.getValue("name")}</div>
        ),
    },
    {
        accessorKey: "brandName",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Brand"/>
        ),
    },
    {
        accessorKey: "supplierName",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Supplier"/>
        ),
    },
    {
        accessorKey: "batchNumber",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Batch No."/>
        ),
    },
    {
        accessorKey: "stockDate",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Stock Date"/>
        ),
        cell: ({row}) => {
            const date = new Date(row.getValue("stockDate"));
            return <div className="font-medium">{format(date, "MMM d, yyyy")}</div>;
        },
    },
    {
        accessorKey: "expiryDate",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Expiry Date"/>
        ),
        cell: ({row}) => {
            const date = new Date(row.getValue("expiryDate"));
            const now = new Date();
            const isExpiringSoon = date < new Date(now.setMonth(now.getMonth() + 3)) && date > now;

            return (
                <div className={`font-medium ${isExpiringSoon ? "text-amber-500" : ""}`}>
                    {format(date, "MMM d, yyyy")}
                </div>
            );
        },
    },
    {
        accessorKey: "drugType",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Type"/>
        ),
        cell: ({row}) => {
            const type = row.getValue("drugType") as string;
            return (
                <div className="font-medium capitalize">
                    {type.toLowerCase()}
                </div>
            );
        },
    },
    {
        accessorKey: "batchStatus",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Status"/>
        ),
        cell: ({row}) => {
            const status = row.getValue("batchStatus") as BatchStatus;
            const badgeColors: Record<BatchStatus, keyof BasicColorType> = {
                AVAILABLE: "green",
                COMPLETED: "blue",
                EXPIRED: "yellow",
                QUALITY_FAILED: "violet",
                DISPOSED: "red"
            };

            return <CustomBadge text={status} color={badgeColors[status]} className={'text-xs'}/>;
        },
    },
    {
        accessorKey: "fullAmount",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Full Amount"/>
        ),
        cell: ({row}) => (
            <div className="font-medium text-right">
                {row.getValue("fullAmount")}
            </div>
        ),
    },
    {
        accessorKey: "remainingQuantity",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Remaining"/>
        ),
        cell: ({row}) => {
            const fullAmount = row.getValue("fullAmount") as number;
            const remainingAmount = row.getValue("remainingQuantity") as number;
            const percentage = (remainingAmount / fullAmount) * 100;

            // Color based on remaining percentage
            const barColor = percentage > 75 ? "bg-green-500" :
                percentage > 25 ? "bg-blue-500" :
                    "bg-amber-500";

            return (
                <div className="flex items-center gap-3">
                    <span className="font-medium">{remainingAmount}</span>
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                        <div
                            className={`h-full ${barColor} rounded-full transition-all duration-300`}
                            style={{width: `${percentage}%`}}
                        />
                    </div>
                    <span className="text-xs text-gray-500">{Math.round(percentage)}%</span>
                </div>
            );
        },
    },
    {
        accessorKey: "unitConcentration",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Concentration"/>
        ),
        cell: ({row}) => (
            <div className="font-medium">
                {row.getValue("unitConcentration")}
            </div>
        ),
    },
];