"use client";

import React from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaTrash, FaMedkit, FaTablets } from "react-icons/fa";
import { handleServerAction } from "@/app/lib/utils";
import { redirect } from "next/navigation";
import {removePatientFromQueue} from "@/app/lib/actions/queue";

// Remove from Queue Button
const RemoveFromQueue = ({
    token,
    queueId,
    refetch,
}: {
    token: number;
    queueId: number;
    refetch: () => void;
}) => {
    const handleRemove = async () => {
        const result = await handleServerAction(
            () => removePatientFromQueue(queueId, token),
            {
                loadingMessage: "Removing from Queue...",
            }
        );

        if (result.success) {
            refetch();
        }
    };

    return (
        <AlertDialog>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <AlertDialogTrigger asChild>
                            <button className="p-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition">
                                <FaTrash />
                            </button>
                        </AlertDialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Remove from Queue</TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Remove from the Queue</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to remove this patient from the
                        queue? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200">
                        Keep in Queue
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleRemove}
                        className="bg-red-600 text-white hover:bg-red-700"
                    >
                        Remove from Queue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

// Prescribe Button (For Doctors)
const PrescribeMedicine = ({ id }: { id: number }) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        onClick={() => {
                            redirect(`/patients/${id}/prescriptions/add`);
                        }}
                        className="p-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                    >
                        <FaMedkit />
                    </button>
                </TooltipTrigger>
                <TooltipContent>Prescribe Medicine</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

// Issue Medicine Button (For Pharmacists)
const IssueMedicine = ({ id }: { id: number }) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        onClick={() => {
                            redirect(`/patients/${id}/prescriptions`);
                        }}
                        className="p-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
                    >
                        <FaTablets />
                    </button>
                </TooltipTrigger>
                <TooltipContent>Issue Medicine</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export { RemoveFromQueue, PrescribeMedicine, IssueMedicine };
