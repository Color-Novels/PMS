'use client';

import React from 'react';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {Trash2} from "lucide-react";
import {handleServerAction} from "@/app/lib/utils";
import {deleteHistory} from "@/app/lib/actions/history";

const DeleteHistory = ({id}: { id: number }) => {
    // Function to handle delete (placeholder)
    const handleDelete = async (id: number) => {
        await handleServerAction(() => deleteHistory({id: id}), {loadingMessage: 'Deleting history...'});
    };
    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <Trash2 className="text-red-500 h-5 w-5 hover:text-red-700"/>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this
                        history record.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(id)}>
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteHistory;