import { MdOutlineBrandingWatermark } from "react-icons/md";
import { Card } from "@/components/ui/card";
import { FaCoins } from "react-icons/fa";
import { StockData } from "@/app/lib/definitions";

export default function PriceListByBrand({ items }: { items: StockData[] }) {
  return (
    <div className="flex flex-col gap-4">
      {items.length > 0 ? (
        items.map((item) => (
          <Card
            key={item.id}
            className="flex items-center justify-between p-5 hover:bg-gray-50 hover:shadow-md transition-all duration-300"
          >
            {/* Brand Name */}
            <div className="flex gap-4 font-semibold text-md flex-1 text-primary-600">
              <MdOutlineBrandingWatermark className="w-5 h-5 text-gray-500" />
              <span>{item.name}</span>
            </div>

            {/* Total Price */}
            <div className="flex items-center gap-3 text-gray-700 text-md justify-end flex-1">
              <FaCoins className="w-5 h-5 text-gray-500" />
              <span className="font-medium">
                Rs. {item.totalPrice.toFixed(2)}
              </span>
            </div>
          </Card>
        ))
      ) : (
        <p className="text-gray-500">No brands found.</p>
      )}
    </div>
  );
}
