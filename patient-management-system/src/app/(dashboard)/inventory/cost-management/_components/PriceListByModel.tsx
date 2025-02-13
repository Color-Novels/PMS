import React from "react";
import Link from "next/link";
import { AiOutlineMedicineBox, AiOutlineDollar } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface StockData {
  id: number;
  name: string;
  totalPrice: number;
  unitPrice?: number;
  remainingQuantity?: number;
}

export default function PriceListByModel({ items }: { items: StockData[] }) {
  return (
    <div className="flex flex-col gap-4">
      {items.length > 0 ? (
        items.map((item) => (
          <Card
            key={item.id}
            className="flex items-center justify-between p-5 hover:bg-gray-50 hover:shadow-md transition-all duration-300"
          >
            {/* Model Name */}
            <div className="flex items-center gap-4 font-semibold text-md flex-1 text-primary-600">
              <AiOutlineMedicineBox className="w-5 h-5 text-gray-500" />
              <span>{item.name}</span>
            </div>

            {/* Total Price */}
            <div className="flex items-center gap-3 text-gray-700 text-md justify-end flex-1">
              <AiOutlineDollar className="w-5 h-5 text-gray-500" />
              <span className="font-medium tracking-wide">
                Rs. {item.totalPrice.toFixed(2)}
              </span>
              <Button asChild variant="default" size="sm">
                <Link href={`/inventory/cost-management/stocks/${item.id}`}>
                  View Info
                </Link>
              </Button>
            </div>
          </Card>
        ))
      ) : (
        <p className="text-gray-500">No models found.</p>
      )}
    </div>
  );
}
