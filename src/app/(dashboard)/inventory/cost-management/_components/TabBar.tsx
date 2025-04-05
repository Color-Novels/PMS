"use client";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { PiChartDonutFill } from "react-icons/pi";
import { FaStoreAlt } from "react-icons/fa";
import Link from "next/link";

export default function TabsBar() {
  const pathname = usePathname();
  // Determine the active tab based on the current pathname
  const getActiveTab = (path: string) => {
    if (path.includes("analysis")) {
      return "analysis";
    } else if (path.includes("stocks")) {
      return "stock";
    }
    // Default to analysis if path doesn't match either
    return "analysis";
  };

  // Set the initial state based on the current pathname
  const [activeTab, setActiveTab] = useState(() => getActiveTab(pathname));

  // Keep activeTab in sync with pathname changes
  useEffect(() => {
    const currentTab = getActiveTab(pathname);
    setActiveTab(currentTab);
  }, [pathname]);

  return (
    <Tabs value={activeTab} className="w-full h-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="stock" asChild>
          <Link href="/inventory/cost-management/stocks">
            <span className="mr-2">Stock</span>
            <FaStoreAlt />
          </Link>
        </TabsTrigger>
        <TabsTrigger value="analysis" asChild>
          <Link href="/inventory/cost-management/analysis">
            <span className="mr-2">Analysis</span>
            <PiChartDonutFill />
          </Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
