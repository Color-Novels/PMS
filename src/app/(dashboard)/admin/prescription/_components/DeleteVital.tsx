'use client';

import React, {useState} from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {Button} from "@/components/ui/button";
import {Trash2} from "lucide-react";
import {deleteVital, safeDeleteVital} from "@/app/lib/actions/prescriptions";
import {handleServerActionWithConfirmation} from "@/app/lib/toast";

interface DeleteVitalDialogProps {
    vitalId: number;
}

const DeleteVitalDialog: React.FC<DeleteVitalDialogProps> = ({vitalId}) => {
    const [open, setOpen] = useState(false);

    const handleDelete = async () => {
        Object.keys(localStorage).forEach((key) => {
            if (key.startsWith("prescription-form-")) {
                localStorage.removeItem(key);
            }
        });

        await handleServerActionWithConfirmation(() => safeDeleteVital(vitalId), () => deleteVital(vitalId), {
            loadingMessage: 'Deleting vital...',
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Trash2 className="w-5 h-5" color={'red'}/>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Vital</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to <span className="text-red-500">delete</span> this vital? This
                        action <span className="text-red-500">cannot be undone</span>.
                        This will remove all <span className="text-amber-600 font-semibold">unsaved</span> prescription
                        data.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-green-600 text-white hover:bg-green-700 hover:text-white">
                        Keep
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteVitalDialog;
