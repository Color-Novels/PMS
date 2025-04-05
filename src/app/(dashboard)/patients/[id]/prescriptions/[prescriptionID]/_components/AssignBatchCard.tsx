"use client";

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    IssueWithDetails,
    PrescriptionIssueCard
} from "@/app/(dashboard)/patients/[id]/prescriptions/[prescriptionID]/_components/MedicineCards";
import {Card, CardContent} from "@/components/ui/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {getBatches, getCachedBatch} from "@/app/lib/actions/prescriptions";
import {CustomBadge} from "@/app/(dashboard)/_components/CustomBadge";
import {differenceInDays, formatDistanceToNow} from 'date-fns';
import {Button} from "@/components/ui/button";
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
import {AlertCircle} from "lucide-react";
import {handleConfirmationOfBatchStatusChange} from "@/app/lib/actions";
import {Skeleton} from "@/components/ui/skeleton"; // Added for warning icon

interface AssignBatchCardProps {
    issue: IssueWithDetails;
    onBatchAssign: (batchID: number | null) => void;
}

type Batches = Awaited<ReturnType<typeof getBatches>>;

const AssignBatchCard = ({issue, onBatchAssign}: AssignBatchCardProps) => {
    const [batches, setBatches] = useState<Batches | null>(null);
    const [selectedBatch, setSelectedBatch] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAndUpdateBatches = useCallback(async () => {
        try {
            setLoading(true);
            const batches = await getBatches({
                drugID: issue.drugId,
                brandID: issue.brandId,
                type: issue.type,
                concentrationID: issue.unitConcentration.id
            });
            setBatches(batches);
            const cachedBatch = await getCachedBatch({
                drugId: issue.drugId,
                brandId: issue.brandId,
                type: issue.type,
                unitConcentrationId: issue.unitConcentration.id
            });
            const batchIDs = batches.map(batch => batch.id);

            if (cachedBatch && batchIDs.includes(cachedBatch.batchId)) {
                setSelectedBatch(cachedBatch.batchId);
            }
            setError(null);
        } catch (e) {
            console.error(e);
            setError('Failed to fetch batches');
        } finally {
            setLoading(false);
        }
    }, [issue.drugId, issue.brandId, issue.type, issue.unitConcentration.id]);

    useEffect(() => {
        fetchAndUpdateBatches().then();
    }, [fetchAndUpdateBatches]);

    // In AssignBatchCard component
    const prevSelectedBatchRef = useRef(selectedBatch);

    useEffect(() => {
        if (selectedBatch !== prevSelectedBatchRef.current) {
            onBatchAssign(selectedBatch);
            prevSelectedBatchRef.current = selectedBatch;
        }
    }, [selectedBatch, onBatchAssign]);

    const handleComplete = async () => {
        if (selectedBatch !== null) {
            setSelectedBatch(null);
            const result = await handleConfirmationOfBatchStatusChange(selectedBatch, "completed");

            if (result.success) {
                fetchAndUpdateBatches().then();
            } else {
                setSelectedBatch(selectedBatch);
            }
        }
    };

    const handleSelect = (batchId: string) => {
        setSelectedBatch(Number(batchId));
    };

    return (
        <div className={'flex gap-4 h-fit'}>
            <PrescriptionIssueCard issue={issue}/>
            <Card className={'p-4'}>
                {loading ?
                    <CardContent className="flex flex-col items-end gap-4">
                        <Skeleton className="h-8 w-72"/>
                        <Skeleton className="h-8 w-48"/>
                    </CardContent> :
                    <CardContent className="flex flex-col gap-4">
                        <Select onValueChange={handleSelect} value={selectedBatch ? `${selectedBatch}` : ''}
                                disabled={batches?.length === 0}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a batch"/>
                            </SelectTrigger>
                            <SelectContent>
                                {batches?.map((batch) => (
                                    <SelectItem key={batch.id} value={`${batch.id}`} className={'p-4'}>
                                        <div className={'flex justify-between gap-4 items-center w-full'}>
                                            <span className={'font-semibold'}>#{batch.number}</span>
                                            <div className="flex gap-2">
                                                <CustomBadge
                                                    text={`${batch.remainingQuantity} left`}
                                                    color={batch.remainingQuantity < 50 ? "red" : batch.remainingQuantity < 150 ? "yellow" : "blue"}
                                                />
                                                <CustomBadge
                                                    text={`Expires in: ${formatDistanceToNow(batch.expiry)}`}
                                                    color={
                                                        differenceInDays(new Date(batch.expiry), new Date()) < 60
                                                            ? "red"
                                                            : differenceInDays(new Date(batch.expiry), new Date()) < 120
                                                                ? "yellow"
                                                                : "green"
                                                    }
                                                />

                                            </div>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {error && <div className="text-red-500">{error}</div>}

                        {/*Buttons*/}
                        <div className={'flex gap-4 justify-end'}>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        disabled={!selectedBatch}
                                        className={`${!selectedBatch && "opacity-50 cursor-not-allowed"} border-red-600 text-red-600 hover:bg-red-600 hover:text-white`}
                                    >
                                        <AlertCircle className="mr-2 h-4 w-4"/>
                                        {selectedBatch ? `Mark Batch #${selectedBatch} as Out of Stock` : "Select a batch to mark as out of stock"}
                                    </Button>
                                </AlertDialogTrigger>
                                {selectedBatch && (
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="text-red-600">Mark Batch #{selectedBatch} as
                                                Out of
                                                Stock?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will mark the batch as completely out of stock. This action <span
                                                className={'text-red-500 font-semibold'}> cannot be
                                            undone</span> and will affect inventory calculations.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={handleComplete}
                                                className="bg-red-600 hover:bg-red-700"
                                            >
                                                Mark as Out of Stock
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                )}
                            </AlertDialog>
                        </div>
                    </CardContent>
                }
            </Card>
        </div>
    );
};

export default AssignBatchCard;