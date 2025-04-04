'use client';

import React, {useState} from 'react';
import {
    IssueWithDetails,
} from "@/app/(dashboard)/patients/[id]/prescriptions/[prescriptionID]/_components/MedicineCards";
import AssignBatchCard
    from "@/app/(dashboard)/patients/[id]/prescriptions/[prescriptionID]/_components/AssignBatchCard";
import {Button} from "@/components/ui/button";
import {toast} from "react-toastify";
import {calculateBill} from "@/app/lib/actions/bills";
import {completePrescription} from "@/app/lib/actions/prescriptions";
import {Bill} from "@/app/lib/definitions";
import {BillComponent} from "@/app/(dashboard)/_components/Bill";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {AlertDialogTitle} from "@radix-ui/react-alert-dialog";
import {handleServerAction} from "@/app/lib/utils";
import {BillExport} from '@/app/(dashboard)/_components/BillExport';
import {IoMdDownload} from "react-icons/io";


export type BatchAssignment = {
    issueID: number;
    batchID: number | null;
}

export type BatchAssignPayload = {
    prescriptionID: number;
    patientID: number;
    batchAssigns: BatchAssignment[];
}

const BatchAssign = ({issues, prescriptionID, patientID, role}: {
        issues: IssueWithDetails[],
        prescriptionID: number,
        patientID: number,
        role: string
    }) => {
        const [batchAssignments, setBatchAssignments] = useState<BatchAssignment[]>(
            issues.map(issue => ({
                issueID: issue.id,
                batchID: null
            }))
        );
        const [error, setError] = useState<string | null>(null);
        const [bill, setBill] = useState<Bill | null>(null);

        const handleBatchAssign = (issueID: number, batchID: number | null) => {
            setBatchAssignments(prev => prev.map(assignment =>
                assignment.issueID === issueID
                    ? {...assignment, batchID}
                    : assignment
            ));
        };

        const generateBill = async () => {
            // Verify that all issues have been assigned a batch
            if (batchAssignments.some(assignment => assignment.batchID === null)) {
                setError('Please assign all batches before submitting');
                return;
            }

            const payload: BatchAssignPayload = {
                prescriptionID,
                patientID,
                batchAssigns: batchAssignments
            };

            const id = toast.loading('Getting Bill Ready...', {position: 'bottom-right', pauseOnFocusLoss: false});

            const result = await calculateBill({prescriptionData: payload});
            if (result.success && result.bill) {
                setError(null);
                setBill(result.bill);
                toast.update(id, {
                    render: 'Bill generated successfully!',
                    type: 'success',
                    isLoading: false,
                    autoClose: 2000,
                    closeOnClick: true
                });
            } else {
                toast.update(id, {
                    render: result.message,
                    type: 'error',
                    isLoading: false,
                    autoClose: 2000,
                    closeOnClick: true
                });
                setError(result.message);
            }
        };

        const handleCompletePrescription = async () => {
            const result = await handleServerAction(() => completePrescription(prescriptionID), {
                loadingMessage: 'Completing Prescription...',
            })

            if (result.success) {
                await new Promise((resolve) => setTimeout(resolve, 2000));
            }
            setError(result.message);
        }

        return (
            <div className="space-y-4">
                <div className="flex justify-start items-center">
                    <span className="text font-semibold">Assign relevant Batches</span>
                </div>
                {issues.map((issue) => (
                    <AssignBatchCard
                        key={issue.id}
                        issue={issue}
                        onBatchAssign={(batchID) => handleBatchAssign(issue.id, batchID)}
                    />
                ))}

                <div className="flex justify-between items-center">
                    <div className="text-red-500">{error}</div>
                    <Button
                        className={'bg-primary-500'}
                        onClick={generateBill}
                    >
                        Generate Bill
                    </Button>
                </div>
                {bill && (
                    <>
                        <BillComponent bill={bill}/>
                        <div className="flex justify-end">
                            <BillExport
                                bill={bill}
                                trigger={
                                    <Button>
                                        <IoMdDownload className="w-5 h-5 text-white"/>
                                    </Button>
                                }
                            />
                        </div>
                    </>
                )}


                <div>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                className="bg-green-600 hover:bg-green-700 w-full shadow-md"
                                disabled={!bill}
                            >
                                Confirm Prescription
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle className={'font-semibold text-lg'}>Confirm
                                    Prescription</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to confirm this prescription?
                                    <br/>
                                    <span className="mt-2 font-medium text-amber-600">
                                    {role === 'NURSE' ? (
                                        <>
                                            Important: After confirmation, you (as a nurse) will no longer have access
                                            to view or modify this
                                            prescription. Only doctor will be able to access it.
                                        </>
                                    ) : (
                                        <>
                                            Important: As a doctor, you will retain full access to this prescription
                                            even after confirmation.
                                        </>
                                    )}
                              </span>
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={handleCompletePrescription}
                                >
                                    Yes, Confirm Prescription
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        );
    }
;

export default BatchAssign;