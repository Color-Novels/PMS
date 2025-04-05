'use client';

import React, {useState, useEffect} from 'react';
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
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Pencil} from "lucide-react"; // Edit icon
import IconSelectorDialog from "@/app/(dashboard)/admin/prescription/_components/IconSelectorDialog_re-icons";
import {Gender, VitalType} from "@prisma/client";
import {BasicColorType} from "@/app/(dashboard)/_components/CustomBadge";
import type {IconName} from "@/app/lib/iconMapping";
import {getTextColorClass, handleServerAction} from "@/app/lib/utils";
import {updateVital} from "@/app/lib/actions/prescriptions";
import DynamicIcon from "@/app/(dashboard)/_components/DynamicIcon";

export interface VitalFormData {
    id: number;
    icon: IconName;
    color: keyof BasicColorType;
    name: string;
    placeholder: string;
    forGender: Gender | null;
    type: VitalType;
}

interface EditVitalDialogProps {
    initialData: VitalFormData;
}

const EditVitalDialog: React.FC<EditVitalDialogProps> = ({initialData}) => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<VitalFormData>(initialData);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setFormData(initialData); // Update formData when initialData changes
    }, [initialData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const reset = () => {
        setFormData(initialData);
        setError(null);
    }

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

    const handleSubmit = async () => {
        if (!formData.name || !formData.placeholder || !formData.icon || !formData.color) {
            setError('All fields are required');
            return;
        }

        Object.keys(localStorage).forEach((key) => {
            if (key.startsWith("prescription-form-")) {
                localStorage.removeItem(key);
            }
        });

        const result = await handleServerAction(() => updateVital(formData), {
            loadingMessage: 'Updating vital...',
        });

        if (result.success) {
            setOpen(false);
        } else {
            setError(result.message);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="p-2">
                    <Pencil size={24} className="text-gray-500"/>
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Vital</DialogTitle>
                    <DialogDescription>
                        Edit the details of an existing vital sign.
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
                                            selectedIconP={formData.icon}
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
                            className="flex flex-col space-y-1 col-span-3"
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
                    <Button type="button" onClick={handleSubmit}>
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditVitalDialog;
