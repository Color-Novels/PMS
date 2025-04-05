import { Suspense } from "react";
import { getAvailableDrugsTotalPages } from "@/app/lib/actions";
import { SortOption } from "@/app/lib/definitions";
import Pagination from "@/app/(dashboard)/_components/Pagination";
import PriceTable from "@/app/(dashboard)/inventory/cost-management/_components/PriceTable";
import { PriceTableSkeleton } from "../_components/PriceTableSkeleton";
import StockTopbar from "../_components/StockTopBar";

export default async function StockPage({
  searchParams,
}: {
  searchParams: Promise<{
    query?: string;
    page?: string;
    selection?: string;
    sort?: string;
    startDate?: string;
    endDate?: string;
  }>;
}) {
  // Await for the search
  const resolvedSearchParams = await searchParams;

  const query = resolvedSearchParams?.query || "";
  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const selection = resolvedSearchParams?.selection || "model";
  const sort: SortOption =
    (resolvedSearchParams?.sort as SortOption) || "alphabetically";

  // Default to last month if no dates are provided
  const defaultStartDate = new Date(
    new Date().setMonth(new Date().getMonth() - 1)
  );
  const defaultEndDate = new Date();
  defaultEndDate.setHours(23, 59, 59, 999);

  const startDate = resolvedSearchParams?.startDate
    ? new Date(resolvedSearchParams.startDate)
    : defaultStartDate;
  const endDate = resolvedSearchParams?.endDate
    ? new Date(resolvedSearchParams.endDate)
    : defaultEndDate;

  const totalPages = await getAvailableDrugsTotalPages(query, selection);

  return (
    <div className="flex flex-col h-full w-full">
      {/* Top Bar */}
      <StockTopbar
        defaultStartDate={startDate}
        defaultEndDate={endDate}
        defaultSelection={selection}
      />

      {/* Content */}
      <div className="flex flex-col h-full p-4 overflow-y-auto">
        <Suspense
          fallback={
            <div className="text-center">
              <PriceTableSkeleton />
            </div>
          }
        >
          <PriceTable
            query={query}
            currentPage={currentPage}
            selection={selection}
            sort={sort}
            startDate={startDate}
            endDate={endDate}
          />
        </Suspense>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="mt-4 flex justify-center">
            <Pagination totalPages={totalPages} />
          </div>
        )}
      </div>
    </div>
  );
}
