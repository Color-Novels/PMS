import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {IssuingStrategy} from "@prisma/client";
import React from "react";

interface MedicationStrategyTabsProps {
    selectedStrategy: {
        selectedStrategy: IssuingStrategy | null;
        setSelectedStrategy: (strategy: IssuingStrategy) => void;
    }
    disabled?: boolean;
}

type issueData = {
    name: IssuingStrategy;
    value: string;
}

const issues: issueData[] = [
    {
        name: IssuingStrategy.TDS,
        value: "TDS",
    },
    {
        name: IssuingStrategy.BD,
        value: "BD",
    },
    {
        name: IssuingStrategy.OD,
        value: "OD",
    },
    {
        name: IssuingStrategy.QDS,
        value: "QDS",
    },
    {
        name: IssuingStrategy.SOS,
        value: "SOS",
    },
    {
        name: IssuingStrategy.NOCTE,
        value: "NOCTE",
    },
    {
        name: IssuingStrategy.MANE,
        value: "MANE",
    },
    {
        name: IssuingStrategy.VESPE,
        value: "VESPE",
    },
    {
        name: IssuingStrategy.NOON,
        value: "NOON",
    },
    {
        name: IssuingStrategy.WEEKLY,
        value: "WEEKLY",
    },
    {
        name: IssuingStrategy.OTHER,
        value: "OTHER",
    },
]

const MedicationStrategyTabs = ({selectedStrategy, disabled = false}: MedicationStrategyTabsProps) => {

    const handleTabChange = (strategy: IssuingStrategy) => {
        selectedStrategy.setSelectedStrategy(strategy);
    }

    return (
        <Tabs defaultValue="MEAL" className="w-full mx-auto"
              value={selectedStrategy.selectedStrategy ? selectedStrategy.selectedStrategy : ''}
              onValueChange={(value) => handleTabChange(value as IssuingStrategy)}>
            <div className="h-10">
                <TabsList className="w-full">
                    {issues.map((issue) => (
                        <TabsTrigger value={issue.name} key={issue.name} disabled={disabled}
                                     className="flex items-center">
                            {issue.name}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </div>
        </Tabs>
    );
};

export default MedicationStrategyTabs;