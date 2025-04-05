import { Skeleton } from "@/components/ui/skeleton";
import {Card} from "@/components/ui/card";


export function PatientsTableSkeleton() {
    return (
      <div className="flex flex-col gap-4">
      {[...Array(5)].map((_, index) => (
        <Card
          key={index}
          className="flex items-center justify-between p-5 hover:bg-gray-50 hover:shadow-md transition-all duration-300"
        >
          {/* Patient Name */}
          <div className="flex items-center gap-3 flex-1">
            <Skeleton className="w-10 h-10 rounded-full" />
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
        </Card>
      ))}
    </div>
    );
  }
  