import React from "react";
import NextBreadcrumb from "@/app/(dashboard)/inventory/completed-stocks/_components/BreadCrumb";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "PMS - Completed Stocks",
    description: "Manage and view completed stocks.",
};

export default function Layout({
                                   children,
                               }: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto min-h-0">
                {children}
            </div>

            {/* Fixed footer - no need for sticky */}
            <NextBreadcrumb
                separator={<span className="text-gray-400 text-xs"> &gt; </span>}
                activeClasses="text-blue-500 font-semibold text-sm"
                containerClasses="flex items-center space-x-1 py-2 px-4 bg-white shadow-md sticky bottom-0 text-sm"
                listClasses="text-gray-600 hover:text-blue-500 transition-colors duration-200 last:font-bold last:text-black text-xs"
                capitalizeLinks
            />
        </div>
    )
}