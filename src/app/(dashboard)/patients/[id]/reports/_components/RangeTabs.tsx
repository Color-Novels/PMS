"use client";

import {useRouter, usePathname, useSearchParams} from "next/navigation";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";

const PeriodTabs = ({currentTab}: {currentTab: string}) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams()

    const handleTabChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("range", value);
        router.replace(`${pathname}?${params.toString()}`);
    };

    return (
        <Tabs defaultValue={currentTab} onValueChange={handleTabChange} className={'w-1/6'}>
            <TabsList className="grid grid-cols-4 w-full bg-white">
                <TabsTrigger value="1M" className={'data-[state=active]:bg-primary-100'}>1M</TabsTrigger>
                <TabsTrigger value="3M" className={'data-[state=active]:bg-primary-100'}>3M</TabsTrigger>
                <TabsTrigger value="12M" className={'data-[state=active]:bg-primary-100'}>12M</TabsTrigger>
                <TabsTrigger value="ALL" className={'data-[state=active]:bg-primary-100'}>ALL</TabsTrigger>
            </TabsList>
        </Tabs>
    );
};

export default PeriodTabs;