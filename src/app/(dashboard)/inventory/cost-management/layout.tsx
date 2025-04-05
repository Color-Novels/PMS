import React from "react";
import TabsBar from "@/app/(dashboard)/inventory/cost-management/_components/TabBar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PMS - Cost Management",
  description: "Manage and view cost management.",
};

const InventoryLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-full w-full">
      <div className="w-full bg-white border-b border-primary-900/25 shadow py-2 px-4 h-14">
        <TabsBar />
      </div>
      <div className="flex flex-col min-h-0 h-full">{children}</div>
    </div>
  );
};

export default InventoryLayout;
