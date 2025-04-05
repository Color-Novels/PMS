'use client';

import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction
} from "@/components/ui/alert-dialog";
import {Trash2} from "lucide-react";
import {handleServerAction} from "@/app/lib/utils";
import {deletePatientReport} from "@/app/lib/actions/reports";
import {Button} from "@/components/ui/button";
import React from "react";

export function DeleteReport({id, patientId}: { id: number, patientId: number }) {
    const handleDelete = async () => {
        await handleServerAction(() => deletePatientReport(id, patientId), {
            loadingMessage: 'Deleting report...',
        });
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                >
                    <Trash2 className="h-4 w-4 text-red-500"/>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete report template?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action
                        <span className="font-semibold text-red-600">cannot be undone. </span>
                        Are you sure you want to delete this report?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction className="bg-red-600 text-white hover:bg-red-700" onClick={handleDelete}>
                        Delete
                    </AlertDialogAction>
                    <AlertDialogCancel className="bg-green-600 text-white hover:bg-green-700 hover:text-white">
                        Keep
                    </AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}