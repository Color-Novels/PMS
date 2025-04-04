"use client";

import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {Plus} from "lucide-react";
import {
    FaUser, FaIdCard, FaPhone, FaCalendarAlt, FaMapMarkerAlt,
    FaRuler, FaWeight
} from "react-icons/fa";
import {PatientFormData} from "@/app/lib/definitions";
import {handleServerAction} from "@/app/lib/utils";
import {addPatient} from "@/app/lib/actions";
import IconedInput from "@/app/(dashboard)/_components/IconedInput";
import CustomGenderSelect from "@/app/(dashboard)/patients/_components/CustomGenderSelect";

type Gender = "" | "MALE" | "FEMALE";

export default function AddPatientForm({text}: { text?: string }) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<PatientFormData>({
        name: "",
        NIC: "",
        telephone: "",
        birthDate: "",
        address: "",
        height: "",
        weight: "",
        gender: "",
    });

    const parseNIC = (nic: string) => {
        // Return early if NIC is not valid
        if (!nic || nic.length < 10) return null;
        
        let year: string;
        let monthDateCode: number;
        let gender: Gender = "";
        
        // New NIC format (12 digits): YYYYMMMDDDXXC
        if (nic.length === 12 && /^\d+$/.test(nic)) {
            year = nic.substring(0, 4);
            monthDateCode = parseInt(nic.substring(4, 7));
            
            // If monthDateCode >= 500, it's female and we need to subtract 500
            if (monthDateCode >= 500) {
                monthDateCode -= 500;
                gender = "FEMALE";
            } else {
                gender = "MALE";
            }
        } 
        // Old NIC format (9 digits + V/X): YYMMMDDDXV/X
        else if (nic.length === 10 && /^\d{9}[VvXx]$/.test(nic)) {
            // Get the year (19XX for old NICs)
            year = "19" + nic.substring(0, 2);
            monthDateCode = parseInt(nic.substring(2, 5));
            
            // If monthDateCode >= 500, it's female and we need to subtract 500
            if (monthDateCode >= 500) {
                monthDateCode -= 500;
                gender = "FEMALE";
            } else {
                gender = "MALE";
            }
        } else {
            return null;
        }
        
        // Convert the monthDateCode to actual month and day
        // Sri Lankan NIC format: first 30 days are Jan, next 31 days are Feb, etc.
        const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        let month = 0;
        let day = monthDateCode;
        
        // Find the correct month and day
        while (day > daysInMonth[month]) {
            day -= daysInMonth[month];
            month++;
            if (month >= 12) break; // Safety check
        }
        
        // JavaScript months are 0-indexed, so month is already correct
        try {
            // Format date as YYYY-MM-DD for input type="date"
            const formattedMonth = (month + 1).toString().padStart(2, '0');
            const formattedDay = day.toString().padStart(2, '0');
            const formattedDate = `${year}-${formattedMonth}-${formattedDay}`;
            
            return {
                birthDate: formattedDate,
                gender: gender
            };
        } catch (e) {
            console.error("Error parsing NIC:", e);
            return null;
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value});
        
        // If NIC field is changed, try to extract birth date and gender
        if (name === "NIC") {
            const nicInfo = parseNIC(value);
            if (nicInfo) {
                setFormData(prev => ({
                    ...prev,
                    [name]: value,
                    birthDate: nicInfo.birthDate,
                    gender: nicInfo.gender
                }));
            }
        }
    };

    const handleGenderChange = (value: Gender) => {
        setFormData({...formData, gender: value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await handleServerAction(() => addPatient({formData}), {
            loadingMessage: "Adding Patient...",
        });

        if (result.success) {
            setOpen(false);
            setFormData({
                name: "",
                NIC: "",
                telephone: "",
                birthDate: "",
                address: "",
                height: "",
                weight: "",
                gender: "",
            });
            return;
        }
    };

    const handleCancel = () => {
        setFormData({
            name: "",
            NIC: "",
            telephone: "",
            birthDate: "",
            address: "",
            height: "",
            weight: "",
            gender: "",
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="flex items-center space-x-2">
                    <Plus className="w-5 h-5"/>
                    <span>{text ? text : "Add New Patient"}</span>
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                        <Plus className="w-6 h-6 mr-2 text-green-600"/> Add Patient
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <IconedInput icon={<FaUser/>} name="name" value={formData.name} onChange={handleChange}
                                     placeholder="Full Name *" required={true}/>
                        <IconedInput icon={<FaIdCard/>} name="NIC" value={formData.NIC} onChange={handleChange}
                                     placeholder="NIC"/>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <IconedInput icon={<FaPhone/>} name="telephone" value={formData.telephone}
                                     onChange={handleChange} placeholder="Telephone *" required={true}/>
                        <IconedInput icon={<FaCalendarAlt/>} name="birthDate" type="date" value={formData.birthDate}
                                     onChange={handleChange} required={true}/>
                    </div>

                    <IconedInput icon={<FaMapMarkerAlt/>} name="address" value={formData.address}
                                 onChange={handleChange} placeholder="Address"/>

                    <div className="grid grid-cols-3 gap-6">
                        <IconedInput icon={<FaRuler/>} name="height" type="number" value={formData.height}
                                     onChange={handleChange} placeholder="Height (cm)"/>
                        <IconedInput icon={<FaWeight/>} name="weight" type="number" value={formData.weight}
                                     onChange={handleChange} placeholder="Weight (kg)"/>
                        <CustomGenderSelect value={formData.gender} onValueChange={handleGenderChange}/>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            Add Patient
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}