import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {Cell, flexRender} from "@tanstack/react-table";
import {TableCell} from "@/components/ui/table";

class TData {
}

const TableCellWithTooltip = ({cell}: {cell : Cell<TData, unknown>}) => {
    const cellContent = flexRender(cell.column.columnDef.cell, cell.getContext());

    // Convert cellContent to string if it's not already
    const contentString = typeof cellContent === 'object' ?
        JSON.stringify(cellContent) : String(cellContent);

    return (
        <TableCell
            key={cell.id}
            className="py-2 px-4 text-sm border-b border-gray-100 max-w-[200px]"
        >
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger className="w-full">
                        <div className="truncate w-full">
                            {cellContent}
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="max-w-xs break-words">{contentString}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </TableCell>
    );
};

export default TableCellWithTooltip;