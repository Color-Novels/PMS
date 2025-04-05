'use client';

import React, {useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Charge, ChargeType} from "@prisma/client";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {
    DiscountFeesCard,
    FixedFeesCard, MedicineFeesInfoCard,
    PercentageFeesCard,
    ProcedureFeesCard
} from "@/app/(dashboard)/admin/fees/_components/FeeCards";
import FeeTypeSelect from "@/app/(dashboard)/admin/fees/_components/FeeTypeSelect";
import {Loader2, Plus, Save, SaveOff} from "lucide-react";
import {handleServerAction} from "@/app/lib/utils";
import {deleteCharge, getCharges, updateCharges} from "@/app/lib/actions/charges";
import {FeeSystemHelpDialog} from "@/app/(dashboard)/admin/fees/_components/FeeSystemHelpDialog";

export interface FeeInForm extends Charge {
    updated: boolean;
}

const FeeForm = () => {
    // Initialize state for each fee
    const [feeValues, setFeeValues] = useState<FeeInForm[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [newFee, setNewFee] = useState<{ name: string; value: number; type: ChargeType }>({
        name: "",
        value: 0,
        type: ChargeType.FIXED
    });
    const [unSavedChanges, setUnSavedChanges] = useState(false);


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
    const handleAddNewFee = () => {
        setUnSavedChanges(true);
        setFeeValues(prev => [...prev, {...newFee, id: -1, updated: true, updatedAt: new Date()}]);
        setIsDialogOpen(false);
        setNewFee({name: "", value: 0, type: ChargeType.FIXED});
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
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button disabled={isLoading}><Plus/>Add New Fee</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Fee</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
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
                                        <Input
                                            id="value"
                                            type="number"
                                            value={newFee.value}
                                            onChange={(e) => setNewFee({
                                                ...newFee,
                                                value: parseFloat(e.target.value) || 0
                                            })}
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="type" className="text-right">Type</Label>
                                        <FeeTypeSelect value={newFee.type}
                                                       onChange={(value) => setNewFee({...newFee, type: value})}/>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleAddNewFee}>Add Fee</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
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
                    <MedicineFeesInfoCard/>
                    <ProcedureFeesCard feeValues={feeValues} handleInputChange={handleInputChange}
                                       handleDeleteFee={handleDeleteFee}/>
                    <FixedFeesCard feeValues={feeValues} handleInputChange={handleInputChange}
                                   handleDeleteFee={handleDeleteFee}/>
                    <PercentageFeesCard feeValues={feeValues} handleInputChange={handleInputChange}
                                        handleDeleteFee={handleDeleteFee}/>
                    <DiscountFeesCard feeValues={feeValues} handleInputChange={handleInputChange}
                                      handleDeleteFee={handleDeleteFee}/>
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