'use client';

import {Button} from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import {useState} from "react";
import {FeeInPrescriptionForm} from './PrescriptionForm';

export interface DiscountSubmitButtonProps {
    charges: FeeInPrescriptionForm[];
    onSubmit: () => void;
    disabled?: boolean;
}

export function DiscountSubmitButton({charges, onSubmit, disabled}: DiscountSubmitButtonProps) {
    const [open, setOpen] = useState(false);

    // Get discount charges
    const discountCharges = charges.filter((charge) => charge.type === 'DISCOUNT');

    // Calculate total discount percentage
    const totalDiscount = discountCharges.reduce((total, charge) => total + charge.value, 0);

    // Check if there are any discount charges
    const hasDiscounts = discountCharges.length > 0;

    return (
        <>
            {!hasDiscounts ? (
                <Button
                    type="submit"
                    size="lg"
                    className="px-8 w-full"
                    onClick={(e) => {
                        e.preventDefault();
                        onSubmit();
                    }}
                    disabled={disabled}
                >
                    Submit Prescription
                </Button>
            ) : (
                <AlertDialog open={open} onOpenChange={setOpen}>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="destructive"
                            size="lg"
                            className="px-8 w-full"
                            disabled={disabled}
                        >
                            Submit Prescription with {totalDiscount}% discount
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Apply <span className="font-semibold text-red-500">{totalDiscount}%</span> Discount?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to submit the prescription with a discount
                                of <strong>{totalDiscount}%</strong>?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>
                                Cancel
                            </AlertDialogCancel>
                            <Button variant="destructive" onClick={() => {
                                setOpen(false);
                                onSubmit();
                            }}>
                                Submit with discount
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </>
    );
}

export default DiscountSubmitButton;