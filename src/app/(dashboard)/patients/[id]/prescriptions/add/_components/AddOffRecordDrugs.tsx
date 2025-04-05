'use client';

import {Card} from '@/components/ui/card';
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog';
import React, {useState} from 'react';
import {Input} from '@/components/ui/input';
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import type {OffRecordMeds} from "@/app/(dashboard)/patients/[id]/prescriptions/add/_components/PrescriptionForm";
import {Plus} from "lucide-react";

interface AddRecordProps {
    addRecord: (offRecordDrug: OffRecordMeds) => void
}


const AddOffRecordDrugs = ({addRecord}: AddRecordProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [offRecordMed, setOffRecordMed] = useState<OffRecordMeds>({
        name: "",
        description: ""
    })
    const [error, setError] = useState<string | null>(null)

    const handleAdd = () => {
        if (!offRecordMed.name) {
            setError("Medication name is required")
            return
        }

        setIsDialogOpen(false);
        setOffRecordMed({name: "", description: ""})
        addRecord(offRecordMed)
    }


    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Card
                    className="border-dashed border-2 p-4 flex justify-center items-center cursor-pointer hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 group"
                >
                    <div className="flex items-center space-x-2 text-slate-500 group-hover:text-slate-800">
                        <Plus className="h-5 w-5 transition-transform duration-200 group-hover:scale-110"/>
                        <span className="font-medium">Add Off-Record Medication</span>
                    </div>
                </Card>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Off-Record Medication</DialogTitle>
                </DialogHeader>
                {error && <div className="text-red-500">{error}</div>}
                <div className="space-y-4">
                    <Input placeholder="Medication Name" value={offRecordMed.name}
                           onChange={(e) => setOffRecordMed({...offRecordMed, name: e.target.value})}/>
                    <Textarea placeholder="Description" value={offRecordMed.description}
                              onChange={(e) => setOffRecordMed({...offRecordMed, description: e.target.value})}/>
                </div>
                <DialogFooter>
                    <Button onClick={handleAdd}>Add</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddOffRecordDrugs;