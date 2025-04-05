import React from "react";
import Link from "next/link";
import { AiOutlineMedicineBox } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { StockData } from "@/app/lib/definitions";
import { SupplierPricingTable } from "@/app/(dashboard)/inventory/cost-management/_components/SupplierPricing";
import { getSupplierWisePricing } from "@/app/lib/actions";

export default async function PriceListByModel({
  items,
}: {
  items: StockData[];
}) {
  return (
    <div className="space-y-6">
      {items.length > 0 ? (
        items.map(async (item) => {
          const supplierData = await getSupplierWisePricing(item.id);
          return (
            <Card key={item.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <AiOutlineMedicineBox className="w-8 h-8 text-primary-500" />
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                </div>
                <Button asChild>
                  <Link
                    href={`/inventory/cost-management/stocks/info/${item.id}`}
                  >
                    View Info
                  </Link>
                </Button>
              </div>

              {/* Supplier-wise Pricing */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4 text-green-600">
                  Supplier-wise Pricing
                </h3>
                {supplierData.length > 0 ? (
                  supplierData.map((supplier) => (
                    <SupplierPricingTable
                      key={supplier.supplierId}
                      supplierName={supplier.supplierName}
                      batches={supplier.batches}
                    />
                  ))
                ) : (
                  <p className="text-gray-500">No supplier data available.</p>
                )}
              </div>
            </Card>
          );
        })
      ) : (
        <Card className="p-6 text-center">
          <p className="text-gray-500">No models found.</p>
        </Card>
      )}
    </div>
  );
}
