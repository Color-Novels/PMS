'use client'

import React, {useState, useEffect} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {editReportType, getReportType} from "@/app/lib/actions/reports";
import {handleServerAction} from "@/app/lib/utils";
import {Edit} from "lucide-react";
import {Textarea} from "@/components/ui/textarea";

export interface Parameter {
    name: string;
    units: string;
    id?: number;
    isNew?: boolean;
}

export interface ReportForm {
    name: string;
    description: string;
    parameters: Parameter[];
}

interface ReportFormEditPopupProps {
    ID: number;
}

const ReportFormEditPopup: React.FC<ReportFormEditPopupProps> = ({ID}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState<ReportForm>({
        name: "",
        description: "",
        parameters: [],
    });
    const [errors, setErrors] = useState<{ name?: string; parameters?: string[] }>({});

    useEffect(() => {
        let isMounted = true;
        const fetchReport = async () => {
            if (!isOpen) return;

            try {
                setIsLoading(true);
                const report = await getReportType(ID);

                if (!isMounted) return;

                if (report) {
                    setForm({
                        name: report.name,
                        description: report.description ?? "",
                        parameters: report.parameters.map((param) => ({
                            name: param.name,
                            units: param.units ?? "",
                            id: param.id,
                            isNew: false,
                        })),
                    });
                }
            } catch (error) {
                console.error('Failed to fetch report:', error);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchReport().then(() => {
        });

        return () => {
            isMounted = false;
        };
    }, [ID, isOpen]);

    const validateForm = (): boolean => {
        const newErrors: { name?: string; parameters?: string[] } = {};
        const parameterErrors: string[] = [];

        if (!form.name.trim()) {
            newErrors.name = "Name is required";
        }

        form.parameters.forEach((param, index) => {
            if (!param.name.trim()) {
                parameterErrors[index] = "Parameter name is required";
            }
        });

        if (parameterErrors.length > 0) {
            newErrors.parameters = parameterErrors;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const addParameter = () => {
        setForm(prev => ({
            ...prev,
            parameters: [...prev.parameters, {name: "", units: "", isNew: true, id: -1}]
        }));
    };

    const removeParameter = (index: number) => {
        setForm(prev => ({
            ...prev,
            parameters: prev.parameters.filter((_, i) => i !== index)
        }));
    };

    const handleParameterChange = (index: number, field: keyof Parameter, value: string) => {
        setForm(prev => ({
            ...prev,
            parameters: prev.parameters.map((param, i) =>
                i === index ? {...param, [field]: value} : param
            )
        }));
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            const result = await handleServerAction(() => editReportType(form, ID), {
                loadingMessage: "Editing report type...",
            });

            if (result.success) {
                setIsOpen(false);
                setForm({name: "", description: "", parameters: []});
            }
        } catch (error) {
            console.error('Failed to submit form:', error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 p-0"
                    onClick={() => setIsOpen(true)}
                >
                    <Edit className="h-4 w-4"/>
                </Button>
            </DialogTrigger>
            <DialogContent className={"overflow-y-scroll max-h-screen"}>
                <DialogHeader>
                    <DialogTitle>Edit Report</DialogTitle>
                </DialogHeader>
                {isLoading ? (
                    <div className="flex justify-center p-4">Loading...</div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <Input
                                value={form.name}
                                onChange={(e) => setForm(prev => ({...prev, name: e.target.value}))}
                                className={errors.name ? "border-red-500" : ""}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <Textarea
                                value={form.description}
                                onChange={(e) => setForm(prev => ({...prev, description: e.target.value}))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Parameters</label>
                            <div className="space-y-2">
                                {form.parameters.map((param, index) => (
                                    <div key={index} className="flex gap-2 items-center">
                                        <Input
                                            placeholder="Name"
                                            value={param.name}
                                            onChange={(e) => handleParameterChange(index, "name", e.target.value)}
                                            className={errors.parameters?.[index] ? "border-red-500" : ""}
                                        />
                                        <Input
                                            placeholder="Units"
                                            value={param.units}
                                            onChange={(e) => handleParameterChange(index, "units", e.target.value)}
                                        />
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => removeParameter(index)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                                {errors.parameters && (
                                    <div className="text-red-500 text-sm mt-1">
                                        Please fill in all parameter names
                                    </div>
                                )}
                            </div>
                            <Button
                                variant="secondary"
                                size="sm"
                                className="mt-2"
                                onClick={addParameter}
                            >
                                Add Parameter
                            </Button>
                        </div>
                        <Button
                            className="w-full"
                            onClick={handleSubmit}
                        >
                            Save Changes
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ReportFormEditPopup;