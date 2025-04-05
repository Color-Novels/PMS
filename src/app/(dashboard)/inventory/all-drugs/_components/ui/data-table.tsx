// components/ui/data-table.tsx
"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {columns} from "@/app/(dashboard)/inventory/all-drugs/_components/Columns";
import {useRouter} from "next/navigation";

interface DataTableProps<TData> {
    data: TData[];
}

export function DataTable<TData>({data}: DataTableProps<TData>) {
    const table = useReactTable({
        data,
        columns: columns as ColumnDef<TData>[],
        getCoreRowModel: getCoreRowModel(),
    });

    const router = useRouter();

    const handleRowClick = (id: string) => {
        router.push(`/inventory/all-drugs/batch/${id}`);
    };

    return (
        <div className="rounded-md border shadow-sm overflow-hidden">
            <Table className="w-full">
                <TableHeader>
                    <TableRow>
                        {table.getHeaderGroups().map((headerGroup) =>
                            headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    className="whitespace-nowrap py-3 text-xs font-medium text-gray-800 uppercase tracking-tight mx-auto"
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            ))
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                                onClick={() => handleRowClick((row.original as { id: string }).id)}
                                className="cursor-pointer hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell
                                        key={cell.id}
                                        className="py-3 px-4 text-sm border-b border-gray-100 truncate max-w-[200px]"
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-16 text-center text-gray-500 text-sm">
                                No results found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}