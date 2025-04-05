import {Skeleton} from "@/components/ui/skeleton";

export default function DrugList() {
    return (
        <div className="space-y-6 p-4">
            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 h-screen">
                {Array(12)
                    .fill(0)
                    .map((_, index) => (
                        <div key={index} className="p-4 rounded-md shadow-md">
                            <Skeleton className="h-6 w-3/4 mb-4"/> {/* Title placeholder */}
                            <Skeleton className="h-4 w-full mb-2"/> {/* Line 1 placeholder */}
                            <Skeleton className="h-4 w-3/4"/> {/* Line 2 placeholder */}
                        </div>
                    ))}
            </div>
        </div>
    );
}
