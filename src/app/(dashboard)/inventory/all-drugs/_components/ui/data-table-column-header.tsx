import { Column } from "@tanstack/react-table";

interface DataTableColumnHeaderProps<TData, TValue> {
    column: Column<TData, TValue>;
    title: string;
}

export function DataTableColumnHeader<TData, TValue>({
    title,
}: DataTableColumnHeaderProps<TData, TValue>) {
    return (
        <div className="flex items-center space-x-2 justify-center">
            <span>{title}</span>
            <span className="inline-flex"></span>
        </div>
    );
}
