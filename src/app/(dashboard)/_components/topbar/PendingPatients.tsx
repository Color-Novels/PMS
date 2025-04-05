'use client';

import React, {useEffect, useState, useCallback} from 'react';
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {SheetTrigger, Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription} from "@/components/ui/sheet";
import {getActiveQueuePatients, getPendingPatientsCount, queuePatients} from "@/app/lib/actions/queue";
import {ScrollArea} from "@/components/ui/scroll-area";
import PatientsList from "@/app/(dashboard)/_components/topbar/CompactPatientsList";
import {redirect} from "next/navigation";
import {RefreshCw} from "lucide-react";
import Pusher from "pusher-js";
import {SessionPayload} from "@/app/lib/definitions";

type Patients = Awaited<ReturnType<typeof queuePatients>>;


const PendingPatients = ({session}: { session: SessionPayload }) => {
    const [pending, setPending] = useState({prescribed: 0, pending: 0});
    const [open, setOpen] = useState(false);
    const [patients, setPatients] = useState<null | Patients>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [wasUpdated, setWasUpdated] = useState(false);

    const fetchPendingPatients = useCallback(async () => {
        try {
            const count = await getPendingPatientsCount();
            setPending(count);
        } catch (error) {
            console.error("Failed to fetch pending patients count:", error);
        }
    }, []);

    const fetchPatients = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getActiveQueuePatients();
            setPatients(data);
        } catch (error) {
            console.error("Failed to fetch pending patients:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPendingPatients().then();

        const pusher = new Pusher('39988a243380a30d6ff9', {
            cluster: 'ap2',
        });

        const channel = pusher.subscribe('thoduwawa-medical-center');

        channel.bind('queue-updated', function (data: { prescribed: number, pending: number }) {
            setPending({prescribed: data.prescribed, pending: data.pending});
            setWasUpdated(true);

            // Reset the update animation after 30 seconds
            setTimeout(() => setWasUpdated(false), 30000);

            // If the sheet is open, also update the patient list
            if (open) {
                setWasUpdated(false);
                fetchPatients().then();
            }
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
            pusher.disconnect();
        };
    }, [fetchPendingPatients, fetchPatients, open]);

    useEffect(() => {
        const fetchData = async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            await fetchPatients();
        };

        if (open) {
            fetchData().then(() => setWasUpdated(false));
        }
    }, [open, fetchPatients]);


    const totalPending = pending.prescribed + pending.pending;
    const userAssigned = session.role === 'DOCTOR' ? pending.pending : pending.prescribed;
    const hasPendingPatients = totalPending > 0;

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    onClick={() => setOpen(true)}
                    variant="ghost"
                    className={cn(
                        "relative h-8 px-3 text-sm font-medium transition-colors",
                        hasPendingPatients
                            ? "text-blue-600 bg-blue-100 hover:bg-blue-200"
                            : "text-gray-500"
                    )}
                >
                    {hasPendingPatients && (
                        <span className={cn(
                            "absolute top-1 right-1 h-1.5 w-1.5 rounded-full",
                            wasUpdated
                                ? "bg-red-500 animate-ping [animation-duration:2s]"
                                : "bg-blue-500 animate-pulse"
                        )}/>
                    )}
                    {hasPendingPatients ? `${userAssigned} / ${totalPending} Assigned` : "No Assigned"}
                </Button>
            </SheetTrigger>
            <SheetContent className="h-screen flex flex-col w-[30rem]">
                <SheetHeader className="flex-shrink-0">
                    <div className="flex gap-2 items-center">
                        <SheetTitle>Assigned Patients</SheetTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                fetchPatients().then();
                                fetchPendingPatients().then();
                            }}
                            disabled={isLoading}
                            className="h-8 w-8 p-0"
                        >
                            <RefreshCw
                                className={cn(
                                    "h-4 w-4",
                                    isLoading && "animate-spin"
                                )}
                            />
                            <span className="sr-only">Refresh</span>
                        </Button>
                    </div>
                    <SheetDescription>All assigned patients in the queue</SheetDescription>
                </SheetHeader>
                <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-1">
                        <span className="text-gray-500">Total:</span>
                        <span className="font-medium text-gray-900">{totalPending}</span>
                        <span className="text-gray-500">in outside</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="text-gray-500">Assigned:</span>
                        <span className="font-medium text-blue-600">{userAssigned}</span>
                        <span className="text-gray-500">to you</span>
                    </div>
                </div>
                <ScrollArea className="flex-1 mt-2">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-32 space-y-2">
                            <div
                                className="h-8 w-8 border-2 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"/>
                            <p className="text-sm text-gray-500">Loading patients...</p>
                        </div>
                    ) : patients && patients.length > 0 ? (
                        <PatientsList patients={patients} closeSheet={() => setOpen(false)}/>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                            <p>No patients assigned</p>
                        </div>
                    )}
                </ScrollArea>
                <div className="flex-shrink-0 pt-4 pb-2">
                    <Button
                        className="w-full"
                        onClick={() => {
                            setOpen(false);
                            redirect('/queue/active');
                        }}
                    >
                        View full queue
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default PendingPatients;