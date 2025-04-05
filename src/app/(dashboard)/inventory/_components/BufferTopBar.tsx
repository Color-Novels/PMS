"use client";

import SearchPanel from "@/app/(dashboard)/_components/Search";
import Dropdown from "@/app/(dashboard)/_components/Dropdown";

// interface StockTopbarProps {
//   defaultSelection?: string;
// }

// Commented out because it is not being used
export default function BufferTopbar() {
    // const searchParams = useSearchParams();

    //   const selection = searchParams.get("selection") || defaultSelection;

    return (
        <div className="px-4 py-2 bg-white border-b shadow-md flex gap-4 overflow-x-auto h-14">
            <SearchPanel
                placeholder="Search by Name"
                //   defaultValue={query}
            />

            <Dropdown
                items={[
                    {label: "Buffered", value: "buffered"},
                    {label: "Stocked", value: "stocked"},
                    {label: "Low to High Quantity", value: "quantity-asc"},
                    {label: "High to Low Quantity", value: "quantity-desc"},
                ]}
                urlParameterName="selection"
                //   defaultValue={selection}
            />
        </div>
    );
}
