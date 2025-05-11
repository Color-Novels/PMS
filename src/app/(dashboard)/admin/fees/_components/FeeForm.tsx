'use client';

import React, {useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Charge, ChargeType} from "@prisma/client";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {
    DiscountFeesCard,
    FixedFeesCard, MedicineFeesInfoCard,
    PercentageFeesCard,
    ProcedureFeesCard,
} from "@/app/(dashboard)/admin/fees/_components/FeeCards";
import {Loader2, SaveOff, Save} from "lucide-react";
import {handleServerAction} from "@/app/lib/utils";
import {deleteCharge, getCharges, updateCharges} from "@/app/lib/actions/charges";
import {FeeSystemHelpDialog} from "@/app/(dashboard)/admin/fees/_components/FeeSystemHelpDialog";
import {toast} from "react-toastify";

export interface FeeInForm extends Charge {
    updated: boolean;
}

export interface AddFeeDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    feeType: ChargeType;
    onAddFee: (fee: { name: string; value: number; type: ChargeType }) => void;
}

export const AddFeeDialog = ({isOpen, onOpenChange, feeType, onAddFee}: AddFeeDialogProps) => {
    const [newFee, setNewFee] = useState<{ name: string; value: number; type: ChargeType }>({
        name: "",
        value: 0,
        type: feeType
    });

    // Reset form when dialog opens with the correct fee type
    useEffect(() => {
        setNewFee({
            name: "",
            value: 0,
            type: feeType
        });
    }, [isOpen, feeType]);

    const handleAddNewFee = () => {
        // Validate fee value is above 0
        if (newFee.value <= 0) {
            toast.error("Fee value must be greater than 0");
            return;
        }

        // Validate fee name is not empty
        if (!newFee.name.trim()) {
            toast.error("Fee name is required");
            return;
        }

        onAddFee(newFee);
        onOpenChange(false);
    };

    const isPercentage = feeType === ChargeType.PERCENTAGE || feeType === ChargeType.DISCOUNT;
    const isDiscount = feeType === ChargeType.DISCOUNT;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add
                        New {feeType.charAt(0) + feeType.slice(1).toLowerCase()} {isDiscount ? '' : "Fee"}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 pt-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input
                            id="name"
                            value={newFee.name}
                            onChange={(e) => setNewFee({...newFee, name: e.target.value})}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="value" className="text-right">Value</Label>
                        <div className="flex items-center gap-2 col-span-3">
                            <Input
                                id="value"
                                type="number"
                                value={newFee.value}
                                onChange={(e) => setNewFee({
                                    ...newFee,
                                    value: parseFloat(e.target.value) || 0
                                })}
                                className="w-full"
                            />
                            <Label htmlFor="value" className="text-right">{isPercentage ? "%" : "LKR"}</Label>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleAddNewFee}>Add Fee</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const FeeForm = () => {
    // Initialize state for each fee
    const [feeValues, setFeeValues] = useState<FeeInForm[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [unSavedChanges, setUnSavedChanges] = useState(false);
    const [dialogState, setDialogState] = useState<{
        isOpen: boolean;
        feeType: ChargeType;
    }>({
        isOpen: false,
        feeType: ChargeType.FIXED
    });

    const openAddFeeDialog = (feeType: ChargeType) => {
        setDialogState({
            isOpen: true,
            feeType
        });
    };

    const fetchCharges = async () => {
        setIsLoading(true);
        try {
            const charges = await getCharges();
            setFeeValues((charges).map(fee => ({...fee, updated: false})));
            setUnSavedChanges(false);
        } catch (error) {
            console.error("Error fetching charges:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchCharges().then();
    }, []);

    // Add this useEffect to handle the beforeunload event
    useEffect(() => {
        // Function to handle the beforeunload event
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (unSavedChanges) {
                // Standard way to show a confirmation dialog
                const message = "You have unsaved changes. Are you sure you want to leave?";
                e.preventDefault();
                e.returnValue = message; // This is needed for Chrome
                return message; // For other browsers
            }
        };

        // Add the event listener when the component mounts
        window.addEventListener('beforeunload', handleBeforeUnload);

        // Remove the event listener when the component unmounts
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [unSavedChanges]); // Only re-run the effect when unSavedChanges changes


    // Handle input change
    const handleInputChange = (feeId: number, value: string) => {
        setUnSavedChanges(true);
        setFeeValues(prev =>
            prev.map(fee => fee.id === feeId ? {...fee, value: parseFloat(value) || 0, updated: true} : fee)
        );
    };

    // Handle update all fees
    const handleUpdateAll = async () => {
        const result = await handleServerAction(() => updateCharges({charges: feeValues}), {loadingMessage: 'Updating fees...'});
        if (result.success) {
            setUnSavedChanges(false);
            fetchCharges().then();
        }
    };

    // Handle adding a new fee
    const handleAddNewFee = (newFee: { name: string; value: number; type: ChargeType }) => {
        // Check if value is negative
        if (newFee.value < 0) {
            toast.error("Fee value cannot be negative");
            return;
        }

        setUnSavedChanges(true);
        setFeeValues(prev => [...prev, {...newFee, id: -1, updated: true, updatedAt: new Date()}]);
    };

    const handleDeleteFee = async (feeId: number, name: string) => {
        if (feeId === -1) {
            setFeeValues(prev => prev.filter(fee => fee.name !== name));
        } else {
            await handleServerAction(() => deleteCharge({id: feeId}), {loadingMessage: 'Deleting fee...'});
            fetchCharges().then();
        }
    }

    return (<>
            <div className="flex flex-col gap-6">
                <div className={'flex justify-between'}>
                    <div>
                        <h1 className="text-2xl font-bold text-primary-700">Fees and Discounts</h1>
                        <h3 className={'text-gray-500'}>Manage all additional fees and discounts</h3>
                    </div>
                    <div className={'flex gap-4'}>
                        <FeeSystemHelpDialog/>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-700 mb-4"/>
                    <p className="text-gray-600">Loading fees and discounts...</p>
                </div>
            ) : (
                <>
                    <AddFeeDialog
                        isOpen={dialogState.isOpen}
                        onOpenChange={(open) => setDialogState(prev => ({...prev, isOpen: open}))}
                        feeType={dialogState.feeType}
                        onAddFee={handleAddNewFee}
                    />
                    <MedicineFeesInfoCard/>
                    <ProcedureFeesCard
                        feeValues={feeValues}
                        handleInputChange={handleInputChange}
                        handleDeleteFee={handleDeleteFee}
                        onAddFee={() => openAddFeeDialog(ChargeType.PROCEDURE)}
                    />
                    <FixedFeesCard
                        feeValues={feeValues}
                        handleInputChange={handleInputChange}
                        handleDeleteFee={handleDeleteFee}
                        onAddFee={() => openAddFeeDialog(ChargeType.FIXED)}
                    />
                    <PercentageFeesCard
                        feeValues={feeValues}
                        handleInputChange={handleInputChange}
                        handleDeleteFee={handleDeleteFee}
                        onAddFee={() => openAddFeeDialog(ChargeType.PERCENTAGE)}
                    />
                    <DiscountFeesCard
                        feeValues={feeValues}
                        handleInputChange={handleInputChange}
                        handleDeleteFee={handleDeleteFee}
                        onAddFee={() => openAddFeeDialog(ChargeType.DISCOUNT)}
                    />
                </>
            )}

            <div
                className={`flex gap-2 ${unSavedChanges ? 'sticky bottom-0 bg-white py-4 shadow-lg z-10 rounded-lg p-2' : ''}`}>
                <Button onClick={() => fetchCharges()}
                        className={`w-full`}
                        variant={'secondary'}
                        disabled={!unSavedChanges || isLoading}>
                    <SaveOff/> Discard changes {unSavedChanges && `(${feeValues.filter(fee => fee.updated).length})`}
                </Button>
                <Button onClick={handleUpdateAll}
                        className={`w-full`}
                        disabled={!unSavedChanges || isLoading}>
                    <Save/> Save Changes {unSavedChanges && `(${feeValues.filter(fee => fee.updated).length})`}
                </Button>
            </div>
        </>
    );
};

export default FeeForm;
