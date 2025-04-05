'use client';

import React from 'react';
import { AiOutlineUser } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import type { Queue } from "@prisma/client";
import {handleServerAction} from "@/app/lib/utils";

import {addPatientToQueue} from "@/app/lib/actions/queue";

const AddToActiveQueueButton = ({ patientID, queue }: { patientID: number, queue: Queue }) => {
    const handleAddToQueue = async () => {
        await handleServerAction(() => addPatientToQueue(queue.id, patientID));
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    className="bg-green-600 text-white px-5 py-2.5 shadow-md hover:bg-green-700 transition-all duration-200 flex items-center gap-2">
                    <AiOutlineUser className="w-5 h-5 text-white" />
                    <span className="font-medium">Add to Active Queue</span>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Action</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to add this patient to the active queue?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleAddToQueue}
                                       className={'bg-green-600 text-white hover:bg-green-700 transition-all duration-200'}>
                    Confirm</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default AddToActiveQueueButton;
