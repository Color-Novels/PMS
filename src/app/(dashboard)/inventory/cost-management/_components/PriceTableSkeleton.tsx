import { Skeleton } from "@/components/ui/skeleton";

export function PriceTableSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="flex justify-between items-center bg-white shadow-md rounded-2xl p-6 border border-gray-200"
        >
          {/* Patient Name */}
          <div className="flex items-center gap-3 flex-1">
            <Skeleton className="w-5 h-5 rounded-full" />
            <Skeleton className="h-5 w-32" />
          </div>

          {/* NIC */}
          <div className="flex items-center gap-3 flex-1 justify-center">
            <Skeleton className="w-5 h-5 rounded-full" />
            <Skeleton className="h-5 w-24" />
          </div>

          {/* Telephone */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            <Skeleton className="w-5 h-5 rounded-full" />
            <Skeleton className="h-5 w-20" />
          </div>

          <div className="flex items-center gap-3 flex-1 justify-end">
            <Skeleton className="w-5 h-5 rounded-full" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}
