import {
  getStockByBrand,
  getStockByModel,
  getStockByBatch,
} from "@/app/lib/actions";
import { StockData, StockQueryParams } from "@/app/lib/definitions";
import PriceListByBrand from "@/app/(dashboard)/inventory/cost-management/_components/PriceListByBrand";
import PriceListByModel from "@/app/(dashboard)/inventory/cost-management/_components/PriceListByModel";
import PriceListByBatch from "@/app/(dashboard)/inventory/cost-management/_components/PriceListByBatch";
import { SortOption } from "@/app/lib/definitions";

export default async function PriceTable({
  query,
  currentPage,
  selection,
  sort,
  startDate,
  endDate,
}: {
  query: string;
  currentPage: number;
  selection: string;
  sort: SortOption;
  startDate: Date;
  endDate: Date;
}) {
  let items: StockData[] = [];
  const params: StockQueryParams = {
    query,
    page: currentPage,
    sort,
    startDate,
    endDate,
  };

  try {
    switch (selection) {
      case "brand":
        items = await getStockByBrand(params);
        return <PriceListByBrand items={items} />;
      case "model":
        items = await getStockByModel(params);
        return <PriceListByModel items={items} />;
      case "batch":
        items = await getStockByBatch(params);
        return <PriceListByBatch items={items} />;
      default:
        return <p className="text-gray-500">Invalid selection type</p>;
    }
  } catch (error) {
    console.error(error);
    return (
      <p className="text-red-500">Error loading data. Please try again.</p>
    );
  }
}
