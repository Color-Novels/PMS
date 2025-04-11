import React from "react";
import {getHistorySidebar} from "@/app/lib/actions/history";
import {format} from "date-fns";
import {
    Slice,
    Stethoscope,
    HeartPulse,
    Users,
    AlertCircle,
} from "lucide-react";
import {CardContent} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import Link from "next/link";
import {ScrollArea} from "@/components/ui/scroll-area";

// Reuse the getHistoryTypeDetails helper function from the original component
const getHistoryTypeDetails = (type: string) => {
    switch (type) {
        case "MEDICAL":
            return {
                icon: <Stethoscope className="h-5 w-5"/>,
                color: "bg-blue-500",
            };
        case "SURGICAL":
            return {
                icon: <Slice className="h-5 w-5"/>,
                color: "bg-purple-500",
            };
        case "FAMILY":
            return {
                icon: <Users className="h-5 w-5"/>,
                color: "bg-green-500",
            };
        case "SOCIAL":
            return {
                icon: <HeartPulse className="h-5 w-5"/>,
                color: "bg-pink-500",
            };
        case "ALLERGY":
            return {
                icon: <AlertCircle className="h-5 w-5"/>,
                color: "bg-red-500",
            };
        default:
            return {
                icon: <Slice className="h-5 w-5"/>,
                color: "bg-gray-500",
            };
    }
};

const SidebarHistoryList = async ({
                                      patientID,
                                      filter,
                                  }: {
    patientID: number;
    filter: string;
}) => {
    const history = await getHistorySidebar({filter: filter, patientID});

    if (history.length === 0) {
        return (
            <div className={"flex flex-col items-center justify-center h-full"}>
                <Slice className="h-8 w-8 text-gray-400 mx-auto mb-2"/>
                <p className="text-sm text-gray-500">No history records</p>
            </div>
        );
    }

    return (
        <ScrollArea
            className={'flex flex-col h-full'}
            type="always"
        >
            <h3 className="text-md font-semibold px-2">Recent History</h3>
            {history.map((item) => {
                const {icon, color} = getHistoryTypeDetails(item.type);
                return (
                    <Link
                        href={`/patients/${patientID}/history?query=${item.name}`}
                        key={item.id}
                        className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-md"
                    >
                        <div className={`rounded-full p-1 ${color} text-white`}>
                            {icon}
                        </div>
                        <div className="flex-grow overflow-hidden">
                            <p className="text-sm font-medium truncate">
                                {item.name}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                                {format(new Date(item.time), "MMM d, h:mm a")}
                            </p>
                        </div>
                    </Link>
                );
            })}
        </ScrollArea>
    );
};

const SidebarHistoryListSkeleton = () => (
    <CardContent className="p-2 space-y-2">
        <Skeleton className="h-4 w-1/2 mx-2 mt-2"/>
        {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center gap-2 p-2">
                <Skeleton className="h-8 w-8 rounded-full"/>
                <div className="flex-grow space-y-1">
                    <Skeleton className="h-3 w-3/4"/>
                    <Skeleton className="h-2 w-1/2"/>
                </div>
            </div>
        ))}
    </CardContent>
);

export {SidebarHistoryListSkeleton};
export default SidebarHistoryList;
