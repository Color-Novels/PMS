import React from "react";
import { getDrugModelStats } from "@/app/lib/actions";
import StatCard from "@/app/(dashboard)/inventory/cost-management/_components/StatCard";
import BackButton from "@/app/(dashboard)/inventory/cost-management/_components/BackButton";

interface DrugModelStats {
  available: { quantity: number; value: number };
  sold: { quantity: number; value: number };
  expired: { quantity: number; value: number };
  disposed: { quantity: number; value: number };
  quality_failed: { quantity: number; value: number };
  errors: { quantity: number; value: number };
}

export default async function DrugDetailByModel({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const stats: DrugModelStats = await getDrugModelStats(parseInt(id));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <BackButton />
        <h1 className="text-2xl font-bold text-primary-500">
          Drug Model Statistics
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Available Stock"
          quantity={stats.available.quantity}
          value={stats.available.value}
          className="bg-green-500"
        />
        <StatCard
          title="Sold/Given"
          quantity={stats.sold.quantity}
          value={stats.sold.value}
          className="bg-blue-500"
        />
        <StatCard
          title="Expired"
          quantity={stats.expired.quantity}
          value={stats.expired.value}
          className="bg-orange-400"
        />
        <StatCard
          title="Disposed"
          quantity={stats.disposed.quantity}
          value={stats.disposed.value}
          className="bg-red-500"
        />
        <StatCard
          title="Quality Failed"
          quantity={stats.quality_failed.quantity}
          value={stats.quality_failed.value}
          className="bg-purple-500"
        />
        <StatCard
          title="Errors"
          quantity={stats.errors.quantity}
          value={stats.errors.value}
          className="bg-gray-400"
        />
      </div>
    </div>
  );
}
