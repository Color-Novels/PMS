'use client';

import React, {useState} from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Plus} from "lucide-react";
import IconSelectorDialog from "@/app/(dashboard)/admin/prescription/_components/IconSelectorDialog_re-icons";
import {Gender, VitalType} from "@prisma/client";
import {BasicColorType} from "@/app/(dashboard)/_components/CustomBadge";
import DynamicIcon from "@/app/(dashboard)/_components/DynamicIcon";
import {addVital} from "@/app/lib/actions/prescriptions";
import {getTextColorClass, handleServerAction} from "@/app/lib/utils";
import type {IconName} from "@/app/lib/iconMapping";

export interface VitalFormData {
    id?: number;
    icon: IconName;
    color: keyof BasicColorType;
    name: string;
    placeholder: string;
    forGender: Gender | null;
    type: VitalType;
}

const AddVitalDialog = () => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<VitalFormData>({
        icon: 'Activity',
        color: 'red',
        name: '',
        placeholder: '',
        forGender: null,
        type: VitalType.TEXT
    });
    const [error, setError] = useState<string | null>(null);

    const reset = () => {
        setFormData({
            icon: 'BsActivity',
            color: 'red',
            name: '',
            placeholder: '',
            forGender: null,
            type: VitalType.TEXT
        })
        setError(null);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleGenderChange = (value: string) => {
        setFormData({
            ...formData,
            forGender: value === "null" ? null : value as Gender
        });
    };

    const handleVitalTypeChange = (value: VitalType) => {
        setFormData({
            ...formData,
            type: value
        });
    };

    const validateForm = () => {
        if (!formData.name || !formData.placeholder || !formData.icon || !formData.color) {
            setError('All fields are required');
            return false;
        }
        return true;
    };

    const handleInitialSubmit = async () => {
        if (validateForm()) {

            Object.keys(localStorage).forEach((key) => {
                if (key.startsWith("prescription-form-")) {
                    localStorage.removeItem(key);
                }
            });

            const result = await handleServerAction(() => addVital(formData), {
                loadingMessage: 'Adding new vital...',
            });

            if (result.success) {
                setOpen(false);
                reset();
            } else {
                setError(result.message);
            }
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Card
                        className="border-dashed border-2 p-4 flex justify-center items-center cursor-pointer hover:border-slate-400 transition-all duration-200 group">
                        <CardContent className="flex items-center justify-center h-full p-12">
                            <div className="flex flex-col items-center gap-2 text-gray-500">
                                <Plus className="w-12 h-12 text-gray-500 group-hover:text-slate-700"/>
                                <p className="font-medium text-sm group-hover:text-slate-700">
                                    Add New Vital
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add New Vital</DialogTitle>
                        <DialogDescription>
                            Create a new vital sign to track in patient records.
                        </DialogDescription>
                    </DialogHeader>

                    {error && (
                        <div className="p-4 bg-red-100 text-red-700 rounded-md mb-4">
                            {error}
                        </div>
                    )}
                    <div className="flex flex-col gap-4">
                        <div className={'grid grid-cols-4 items-center gap-4'}>
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="e.g., Blood Pressure"
                                className="col-span-3"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="icon" className="text-right">
                                Icon
                            </Label>
                            <IconSelectorDialog onSelect={(icon, color) => {
                                setFormData({
                                    ...formData,
                                    icon,
                                    color
                                });
                            }}
                                                buttonClassName={'flex items-center justify-center text-2xl p-2 rounded-lg bg-white hover:bg-gray-200 w-fit'}
                                                selectedColorP={formData.color}
                            >
                                <DynamicIcon icon={formData.icon}
                                             className={`${getTextColorClass(formData.color)}`}/>
                            </IconSelectorDialog>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="placeholder" className="text-right">
                                Placeholder
                            </Label>
                            <Input
                                id="placeholder"
                                name="placeholder"
                                value={formData.placeholder}
                                onChange={handleInputChange}
                                placeholder="e.g., 120/80 mmHg"
                                className="col-span-3"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label className="text-right pt-2">For Gender</Label>
                            <RadioGroup
                                value={formData.forGender || "null"}
                                onValueChange={handleGenderChange}
                                className="flex flex-col space-y-1 col-span-3"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="null" id="gender-all"/>
                                    <Label htmlFor="gender-all">All</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value={Gender.MALE} id="gender-male"/>
                                    <Label htmlFor="gender-male">Male</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value={Gender.FEMALE} id="gender-female"/>
                                    <Label htmlFor="gender-female">Female</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label className="text-right pt-2">Vital Type</Label>
                            <RadioGroup
                                value={formData.type}
                                onValueChange={handleVitalTypeChange}
                                className="flex flex-col space-y-1 col-span-1"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value={VitalType.TEXT} id="vital-text"/>
                                    <Label htmlFor="vital-text">Text</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value={VitalType.NUMBER} id="vital-number"/>
                                    <Label htmlFor="vital-number">Number</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value={VitalType.DATE} id="vital-date"/>
                                    <Label htmlFor="vital-date">Date</Label>
                                </div>
                            </RadioGroup>
                            <p className={'col-span-2 text-sm text-gray-500'}>
                                Vital type cannot be changed after creating a prescription with this vital.
                            </p>
                        </div>
                    </div>

                    <span className={'text-sm text-gray-500'}>
                        This will remove all unsaved prescription data.
                    </span>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => {
                            setOpen(false);
                            reset();
                        }}>
                            Cancel
                        </Button>
                        <Button type="button" onClick={handleInitialSubmit}>
                            Add Vital
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AddVitalDialog;