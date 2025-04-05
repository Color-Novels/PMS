import { LucidePackagePlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { FaCoins } from "react-icons/fa";
import { IoPricetagsOutline } from "react-icons/io5";
import { StockData } from "@/app/lib/definitions";
import { PiHospitalFill } from "react-icons/pi";

export default function PriceListByBatch({ items }: { items: StockData[] }) {
  return (
    <div className="flex flex-col gap-4">
      {items.length > 0 ? (
        items.map((item) => (
          <Card
            key={item.id}
            className="flex items-center justify-between p-5 hover:bg-gray-50 hover:shadow-md transition-all duration-300"
          >
            {/* Batch Info */}
            <div className="flex items-start gap-4 font-semibold text-md flex-1 text-primary-600">
              <div>
                <LucidePackagePlus className="w-5 h-5 text-gray-500" />
              </div>

              <div className="flex flex-col">
                <span className="text-md">{item.name}</span>
                <span className="text-sm text-green-600">{item.drugName}</span>
                <span className="text-sm text-pink-700">{item.brandName}</span>
              </div>
            </div>

            {/* Supplier */}
            <div className="flex items-center gap-3 text-gray-700 text-md justify-center flex-1">
              <div>
                <PiHospitalFill className="w-5 h-5 text-gray-500" />
              </div>

              <span className="font-medium">
                {item.supplier || "Unknown Supplier"}
              </span>
            </div>

            {/* Unit Price */}
            <div className="flex items-center gap-3 text-gray-700 text-md justify-center flex-1">
              <IoPricetagsOutline className="w-5 h-5 text-gray-500" />
              <span className="font-medium">
                Rs. {item.retailPrice?.toFixed(2)} per unit
              </span>
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
        <p className="text-gray-500">No batches found.</p>
      )}
    </div>
  );
}
