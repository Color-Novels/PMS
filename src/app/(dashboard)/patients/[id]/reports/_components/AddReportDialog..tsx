"use client";

import React, {useEffect, useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Switch} from "@/components/ui/switch";
import {addPatientReport, getReportParams, searchReportTypes} from "@/app/lib/actions/reports";
import {useDebouncedCallback} from "use-debounce";
import {handleServerAction} from "@/app/lib/utils";
import PopoverSelect from "@/app/(dashboard)/_components/PopOverSelect";
import {Skeleton} from "@/components/ui/skeleton";

interface Report {
    id: number;
    name: string;
}

interface ReportParam {
    id: number;
    name: string;
    units: string | null;
}

interface AddReportDialogProps {
    id: number;
}

const AddReportDialog = ({id}: AddReportDialogProps) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<number | null>(null);
    const [reports, setReports] = useState<Report[]>([]);
    const [params, setParams] = useState<ReportParam[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [paramValues, setParamValues] = useState<Record<number, { value: string; attention: boolean }>>({});
    const [error, setError] = useState<string | null>(null);
    const [isParamsLoading, setIsParamsLoading] = useState(false);

    const handleSearch = useDebouncedCallback(async (term: string) => {
        setIsSearching(true);
        try {
            const data = await searchReportTypes(term);
            setReports(data);
        } finally {
            setIsSearching(false);
        }
    }, 700);

    const resetForm = () => {
        setValue(null);
        setParamValues({});
        setError(null);
        handleSearch("");
    }

    useEffect(() => {
        if (open) {
            handleSearch("");
        }
    }, [handleSearch, open]);

    const handleSelect = async (selectedId: number) => {
        setValue(selectedId === value ? null : selectedId);
        if (selectedId !== value) {
            setIsParamsLoading(true);
            try {
                const paramsData = await getReportParams(selectedId);
                setParams(paramsData);
                setParamValues({});
            } finally {
                setIsParamsLoading(false);
            }
        }
    };


    const handleParamChange = (paramId: number, paramValue: string) => {
        setParamValues(prev => ({
            ...prev,
            [paramId]: {
                value: paramValue,
                attention: prev[paramId]?.attention || false
            }
        }));
    };

    const handleAttentionToggle = (paramId: number) => {
        setParamValues(prev => ({
            ...prev,
            [paramId]: {
                value: prev[paramId]?.value || "",
                attention: !prev[paramId]?.attention
            }
        }));
    };

    const handleSubmit = async () => {
        if (!value) {
            setError("Please select a report type");
            return;
        }
        const result = await handleServerAction(() => addPatientReport({
            patientID: id,
            reportTypeID: value,
            params: paramValues
        }), {
            loadingMessage: "Adding report..."
        });

        if (result.success) {
            setParamValues({});
            setOpen(false);
        } else {
            setError(result.message);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <span>Add Report</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl flex flex-col justify-start">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Add Report</DialogTitle>
                </DialogHeader>

                <div className="py-6 space-y-6">
                    <div className="space-y-2">
                        <div className={'flex justify-between'}>
                            <Label>Report Type</Label>
                            <Button onClick={resetForm} variant="ghost" className={'text-red-500'}>Reset</Button>
                        </div>
                        <PopoverSelect
                            options={reports}
                            value={value}
                            onChange={(selectedId) => handleSelect(Number(selectedId))}
                            onSearch={handleSearch}
                            isSearching={isSearching}
                            placeholder="Select report type..."
                            searchPlaceholder="Search reports..."
                            noOptionsMessage="No reports found."
                            className={value ? "border-primary-500 shadow-sm" : "border-gray-300 hover:border-gray-400"}
                        />
                    </div>

                    {error && <p className="text-red-500">{error}</p>}

                    {isParamsLoading ? (
                        <ParamsSkeleton/>
                    ) : (value && params.length > 0) && (
                        <div className="space-y-4">
                            <Label>Parameters</Label>
                            <ScrollArea className="h-[240px]">
                                <div className="space-y-4 p-4">
                                    {params.map((param) => (
                                        <div
                                            key={param.id}
                                            className="flex items-center justify-between border-b border-gray-300 pb-4"
                                        >
                                            <div className="flex items-center gap-8">
                                                <Label className="text-sm font-medium min-w-32">
                                                    {param.name}
                                                </Label>
                                                <div className="flex items-center gap-2">
                                                    <Switch
                                                        checked={paramValues[param.id]?.attention || false}
                                                        onCheckedChange={() => handleAttentionToggle(param.id)}
                                                        className="data-[state=checked]:bg-red-500"
                                                    />
                                                    <Label className="text-sm text-gray-700">
                                                        Mark as danger
                                                    </Label>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <Input
                                                    type="text"
                                                    value={paramValues[param.id]?.value || ""}
                                                    onChange={(e) => handleParamChange(param.id, e.target.value)}
                                                    className="h-9 w-48"
                                                />
                                                {param.units && (
                                                    <span
                                                        className="text-sm text-gray-500 min-w-16">{param.units}</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={!value}>
                        Add Report
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


const ParamsSkeleton = () => {
    return (
        <div className="space-y-4">
            <Label>Parameters</Label>
            <div className="space-y-4 p-4">
                {[...Array(3)].map((_, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between border-b border-gray-300 pb-4"
                    >
                        <div className="flex items-center gap-8">
                            <Skeleton className="h-6 w-32"/>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-6 w-10"/>
                                <Skeleton className="h-6 w-20"/>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-9 w-48"/>
                            <Skeleton className="h-6 w-16"/>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
};

export default AddReportDialog;