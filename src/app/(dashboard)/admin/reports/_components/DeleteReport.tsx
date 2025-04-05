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
import {safeDeleteReportType, deleteReportType} from "@/app/lib/actions/reports";
import {Button} from "@/components/ui/button";
import React from "react";
import {handleServerActionWithConfirmation} from "@/app/lib/toast";

export function DeleteReport({reportID}: { reportID: number }) {
    const handleDelete = async () => {
        await handleServerActionWithConfirmation(() => safeDeleteReportType(reportID), () => deleteReportType(reportID), {loadingMessage: 'Deleting report template...'});

    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 p-0"
                >
                    <Trash2 className="h-4 w-4 text-red-600"/>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete report template?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the report template.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-green-600 text-white hover:bg-green-700 hover:text-white">
                        Keep
                    </AlertDialogCancel>
                    <AlertDialogAction className="bg-red-600 text-white hover:bg-red-700" onClick={handleDelete}>
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}