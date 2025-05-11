'use client';

import React, {useEffect, useState} from 'react';
import dynamic from "next/dynamic";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {FileText, ChevronLeft, X, BriefcaseMedical} from "lucide-react";
import IssueFromInventory from "./IssueFromInventory";
import {Charge, ChargeType, IssuingStrategy, MEAL, Vitals} from "@prisma/client";
import type {DrugType} from "@prisma/client";
import AddOffRecordDrugs from "@/app/(dashboard)/patients/[id]/prescriptions/add/_components/AddOffRecordDrugs";
import {getTextColorClass, handleServerAction} from "@/app/lib/utils";
import {addPrescription} from "@/app/lib/actions/prescriptions";
import {
    OffRecordMedsListProps, OtherChargesListProps, PrescriptionIssuesListProps, ProcedureChargesListProps,
} from "@/app/(dashboard)/patients/[id]/prescriptions/add/_components/PrescriptionIssuesList";
import {FaHeadSideCough} from "react-icons/fa";
import {useRouter} from "next/navigation";
import {Textarea} from "@/components/ui/textarea";
import DynamicIcon from "@/app/(dashboard)/_components/DynamicIcon";
import {IconName} from "@/app/lib/iconMapping";
import {BasicColorType, CustomBadge} from "@/app/(dashboard)/_components/CustomBadge";
import {Separator} from "@/components/ui/separator";
import {toast} from "react-toastify";
import {
    DiscountSubmitButtonProps
} from "@/app/(dashboard)/patients/[id]/prescriptions/add/_components/DiscountSubmitButton";
import {getChargesOnType} from "@/app/lib/actions/charges";
import AddProcedureCharge from "@/app/(dashboard)/patients/[id]/prescriptions/add/_components/AddProcedure";
import AddOtherCharge from "@/app/(dashboard)/patients/[id]/prescriptions/add/_components/AddOtherCharges";
import Link from "next/link";

const DiscountSubmitButton = dynamic<DiscountSubmitButtonProps>(
    () => import('@/app/(dashboard)/patients/[id]/prescriptions/add/_components/DiscountSubmitButton').then(mod => mod.DiscountSubmitButton),
    {ssr: false}
);

const PrescriptionIssuesList = dynamic<PrescriptionIssuesListProps>(
    () => import('@/app/(dashboard)/patients/[id]/prescriptions/add/_components/PrescriptionIssuesList').then(mod => mod.PrescriptionIssuesList),
    {ssr: false}
);

const OffRecordMedsList = dynamic<OffRecordMedsListProps>(
    () => import('@/app/(dashboard)/patients/[id]/prescriptions/add/_components/PrescriptionIssuesList').then(mod => mod.OffRecordMedsList),
    {ssr: false}
);

const ProcedureChargesList = dynamic<ProcedureChargesListProps>(
    () => import('@/app/(dashboard)/patients/[id]/prescriptions/add/_components/PrescriptionIssuesList').then(mod => mod.ProcedureChargesList),
    {ssr: false}
);

const OtherChargesList = dynamic<OtherChargesListProps>(
    () => import('@/app/(dashboard)/patients/[id]/prescriptions/add/_components/PrescriptionIssuesList').then(mod => mod.OtherChargesList),
    {ssr: false}
);

export interface IssueInForm {
    drugId: number;
    drugName: string;
    details: string | null;
    brandId: number;
    brandName: string;
    meal: MEAL | null;
    dose: number | null;
    forDays: number | null;
    forTimes: number | null;
    strategy: IssuingStrategy;
    quantity: number;
    drugType: DrugType;
    concentration: number | string;
    concentrationID: number;
}

export interface FeeInPrescriptionForm {
    id: number;
    value: number;
    description: string;
    name: string;
    type: ChargeType;
}

export interface OffRecordMeds {
    name: string;
    description?: string;
}

export interface VitalInForm extends Vitals {
    value: string;
}

export interface PrescriptionFormData {
    presentingSymptoms: string;
    description: string;
    issues: IssueInForm[];
    offRecordMeds: OffRecordMeds[];
    vitals: VitalInForm[];
    charges: FeeInPrescriptionForm[];
}

const PrescriptionForm = ({patientID, vitals}: { patientID: number, vitals: VitalInForm[] }) => {
    const [formData, setFormData] = useState<PrescriptionFormData>(() => {
        if (typeof window !== 'undefined') {
            const savedForm = localStorage.getItem(`prescription-form-${patientID}`);
            if (savedForm) {
                return JSON.parse(savedForm) as PrescriptionFormData;
            }
        }

        return defaultFormData();
    });
    const [feesFetching, setFeesFetching] = useState(false);
    const [issueToEdit, setIssueToEdit] = useState<IssueInForm | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const router = useRouter();

    // Function to fetch charges and update state
    const loadFixedCharges = async () => {
        setFeesFetching(true);
        const charges = await getChargesOnType({types: [ChargeType.FIXED, ChargeType.PERCENTAGE]});
        setFeesFetching(false);
        return charges.map(charge => ({...charge, description: ''}));
    };

    // Add this to ensure issueToEdit gets reset after successful update
    const handleUpdateIssue = (updatedIssue: IssueInForm, originalIssue: IssueInForm) => {
        setFormData((prevData) => ({
            ...prevData,
            issues: prevData.issues.map((issue) => (issue === originalIssue ? updatedIssue : issue))
        }));

        // Reset edit state after successful update
        setIssueToEdit(null);
        setIsDialogOpen(false);
    };

    // Add this effect to prevent memory leaks
    useEffect(() => {
        return () => {
            // Clear edit state when component unmounts
            setIssueToEdit(null);
            setIsDialogOpen(false);
        };
    }, []);

    // Load charges on mount
    useEffect(() => {
        loadFixedCharges().then(fixedCharges => {
            setFormData(prev => {
                // Filter out existing FIXED charges (if any) from the previous state
                const nonFixedCharges = prev.charges.filter(
                    charge => charge.type !== ChargeType.FIXED && charge.type !== ChargeType.PERCENTAGE
                );

                // Combine the new fixed charges with any non-fixed charges
                return {
                    ...prev,
                    charges: [...nonFixedCharges, ...fixedCharges]
                };
            });
        });
    }, []);

    // Save to localStorage whenever formData changes
    useEffect(() => {
        localStorage.setItem(`prescription-form-${patientID}`, JSON.stringify(formData));
    }, [formData, patientID]);

    // Reset form with new charges
    async function formReset() {
        const charges = await loadFixedCharges();
        setFormData(defaultFormData(charges));
        localStorage.removeItem(`prescription-form-${patientID}`);
    }

    // Default form data generator
    function defaultFormData(charges: Charge[] = []): PrescriptionFormData {
        return {
            presentingSymptoms: '',
            description: '',
            issues: [],
            offRecordMeds: [],
            vitals: vitals,
            charges: charges.map(charge => ({...charge, description: ''})),
        };
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleVitalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        const index = Number(name.split('-')[1]);
        setFormData((prevData) => ({
            ...prevData,
            vitals: prevData.vitals.map((vital, i) => {
                if (i === index) {
                    return {
                        ...vital,
                        value: value
                    };
                }
                return vital;
            })
        }));
    }

    const handleAddIssue = (issue: IssueInForm) => {
        setFormData((prevData) => ({
            ...prevData,
            issues: [...prevData.issues, issue]
        }));
    };

    const handleAddOffRecordMed = (offRecordMed: OffRecordMeds) => {
        setFormData((prevData) => ({
            ...prevData,
            offRecordMeds: [...prevData.offRecordMeds, offRecordMed]
        }));
    };

    const handleAddCharge = (charge: FeeInPrescriptionForm) => {
        // Check if already exists
        const exists = formData.charges.find((c) => c.id === charge.id);
        if (exists) {
            toast.error('This charge already exists remove it and add again with preferred values', {position: "bottom-right"});
            return;
        }

        setFormData((prevData) => ({
            ...prevData,
            charges: [...prevData.charges, charge]
        }));
    }


    const handleEditIssue = (issue: IssueInForm | null, e?: React.MouseEvent<HTMLButtonElement>) => {
        // Prevent the default button behavior and stop propagation
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        setIssueToEdit(issue);
        if (issue) {
            setIsDialogOpen(true);
        }
    };

    const handleSubmit = async () => {
        //Check for valid discount
        const discountCharges = formData.charges.filter((charge) => charge.type === 'DISCOUNT');
        const totalDiscount = discountCharges.reduce((total, charge) => total + charge.value, 0);
        if (totalDiscount > 100) {
            toast.error('Total discount cannot exceed 100%', {position: "bottom-right"});
            return;
        } else if (totalDiscount < 0) {
            toast.error('Total discount cannot be negative', {position: "bottom-right"});
            return;
        }

        if (formData.issues.length === 0) {
            toast.error('Please add at least one issue', {position: "bottom-right"});
            return;
        }

        try {
            const result = await handleServerAction(() => addPrescription({
                prescriptionForm: formData,
                patientID: patientID
            }), {
                loadingMessage: 'Submitting prescription...',
            });

            console.log(result);
            if (result.success) {
                await formReset(); // This will also clear localStorage
            }
        } catch (error) {
            console.error('Error submitting prescription:', error);
        }
    };

    const handleBack = () => {
        // Don't reset the form when going back, to preserve the state
        router.push(`/patients/${patientID}/prescriptions`);
    };

    return (
        <form className={'w-full'}>
            <Card className={'flex flex-col p-4 space-y-4'}>
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        {/* Back Button */}
                        <div className="flex items-center hover:bg-gray-100 p-1 rounded-md cursor-pointer"
                             onClick={handleBack}>
                            <ChevronLeft/>
                        </div>
                        <h1 className="text-2xl font-semibold">Prescribe Medication</h1>
                    </div>
                    <span onClick={formReset} className="text-red-500 cursor-pointer text-sm hover:underline">
                        X Clear (Refetch recent vitals)
                    </span>
                </div>
                <Card className="bg-slate-100 p-4 transition-shadow duration-300">
                    <div className="space-y-2.5">
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <FaHeadSideCough className="h-4 w-4 text-cyan-500"/>
                                <Label>Presenting Complaint<span className="text-red-500">*</span></Label>
                            </div>
                            <Input
                                type="text"
                                name="presentingSymptoms"
                                value={formData.presentingSymptoms}
                                onChange={handleChange}
                                required
                                className="w-full"
                                placeholder="Enter symptoms e.g., headache, fever"
                            />
                        </div>

                        <Separator/>

                        <h2 className="text-md font-semibold">Patient Vitals</h2>

                        {/* Grid for Vitals */}
                        {(vitals.length === 0) && (
                            <div className={'text-sm'}>No vitals found. Please click {' '}
                                <span onClick={formReset} className="text-blue-500 hover:underline cursor-pointer">
                                    here
                                </span>
                                {' '} to refetch vitals if you have added any.
                                If you are an admin, you can create vitals {' '}
                                <a href={'/admin/prescription'}
                                   className="text-blue-500 hover:underline">here</a> before
                                prescribing medication.</div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {formData.vitals.map((vital, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <DynamicIcon icon={vital.icon as IconName}
                                                     className={`text-lg ${getTextColorClass(vital.color as keyof BasicColorType)}`}/>
                                        <Label>{vital.name}</Label>
                                    </div>
                                    <Input
                                        name={`vital-${index}`}
                                        value={vital.value}
                                        type={vital.type === 'NUMBER' ? 'number' : vital.type === 'DATE' ? 'date' : 'text'}
                                        onChange={handleVitalChange}
                                        placeholder={vital.placeholder}
                                    />
                                </div>
                            ))}
                        </div>

                        <Separator/>
                        <h2 className="text-md font-semibold">Additional Details</h2>

                        {/* Description Section - Moved Outside */}
                        <div className={'grid grid-cols-1 md:grid-cols-2 gap-4'}>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <FileText className="h-4 w-4 text-gray-500"/>
                                    <Label>Description</Label>
                                </div>
                                <Textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full p-2 rounded-md"
                                    placeholder="Additional details..."
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className='bg-slate-100 p-4 transition-shadow duration-300'>
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold">Medications</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">Issue from Inventory</h3>
                            </div>
                            <PrescriptionIssuesList
                                issues={formData.issues}
                                onRemove={(index) => {
                                    setFormData((prevData) => ({
                                        ...prevData,
                                        issues: prevData.issues.filter((_, i) => i !== index)
                                    }));
                                }}
                                onEdit={handleEditIssue}
                            />
                            <IssueFromInventory
                                isOpen={isDialogOpen}
                                setIsOpen={setIsDialogOpen}
                                onAddIssue={handleAddIssue}
                                onUpdateIssue={handleUpdateIssue}
                                onEdit={handleEditIssue}
                                issueToEdit={issueToEdit}
                                isEditMode={!!issueToEdit}
                            />
                        </div>

                        <div className="space-y-4 pt-6 border-t">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">Off-Record Medications</h3>
                            </div>
                            <OffRecordMedsList
                                meds={formData.offRecordMeds}
                                onRemove={(index) => {
                                    setFormData((prevData) => ({
                                        ...prevData,
                                        offRecordMeds: prevData.offRecordMeds.filter((_, i) => i !== index)
                                    }));
                                }}
                            />
                            <AddOffRecordDrugs addRecord={handleAddOffRecordMed}/>
                        </div>
                    </div>
                </Card>

                <Card className={'bg-slate-100 p-4 transition-shadow duration-300'}>
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold">Procedures</h2>
                        <ProcedureChargesList
                            charges={formData.charges.filter(charge => charge.type === 'PROCEDURE')}
                            onRemove={(index) => {
                                const procedureCharges = formData.charges.filter(charge => charge.type === 'PROCEDURE');
                                const chargeToRemove = procedureCharges[index];
                                setFormData((prevData) => ({
                                    ...prevData,
                                    charges: prevData.charges.filter(charge => charge !== chargeToRemove)
                                }));
                            }}
                        />
                        <AddProcedureCharge addCharge={handleAddCharge}/>
                        <div className={'flex justify-end'}>
                            <Link href={'/admin/fees'}
                                  className={'flex items-center space-x-2 text-blue-600 hover:underline text-sm'}>
                                Customize
                            </Link>
                        </div>
                    </div>
                </Card>

                <Card className="bg-slate-100 p-4 transition-shadow duration-300">
                    <div className="space-y-6">
                        <h2 className="flex items-center text-lg font-semibold gap-2">Charges & Discounts</h2>
                        <Card
                            className={`p-4 cursor-pointer hover:shadow-md transition h-full overflow-hidden border-l-4 border-l-gray-800`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4">
                                    <div className="mt-1">
                                        <BriefcaseMedical className={'h-5 w-5 text-blue-500'}/>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-2">
                                            <h3 className="font-medium">Medicine charges</h3>
                                            <CustomBadge text={'SYSTEM'} color={'gray'}/>
                                        </div>

                                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                                            <FileText size={'20'}/>
                                            <span>
                                                This charge is automatically calculated based on the medicines issued at
                                                the bill. This charge is not removable.
                                            </span>
                                        </div>
                                    </div>
                                    {/*Grayed out X*/}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-slate-500 hover:text-red-600"
                                        disabled
                                    >
                                        <X className="h-4 w-4"/>
                                    </Button>
                                </div>
                            </div>
                        </Card>
                        <OtherChargesList
                            charges={formData.charges.filter(charge => charge.type !== 'PROCEDURE')}
                            onRemove={(index) => {
                                const otherCharges = formData.charges.filter(charge => charge.type !== 'PROCEDURE');
                                const chargeToRemove = otherCharges[index];
                                setFormData((prevData) => ({
                                    ...prevData,
                                    charges: prevData.charges.filter(charge => charge !== chargeToRemove)
                                }));
                            }}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <AddOtherCharge chargeType="FIXED" addCharge={handleAddCharge}/>
                            <AddOtherCharge chargeType="PERCENTAGE" addCharge={handleAddCharge}/>
                            <AddOtherCharge chargeType="DISCOUNT" addCharge={handleAddCharge}/>
                        </div>
                        <div className={'flex justify-end'}>
                            <Link href={'/admin/fees'}
                                  className={'flex items-center space-x-2 text-blue-600 hover:underline text-sm'}>
                                Customize
                            </Link>
                        </div>
                    </div>
                </Card>

                <div className="flex items-end h-full">
                    <DiscountSubmitButton charges={formData.charges} onSubmit={handleSubmit} disabled={feesFetching}/>
                </div>
            </Card>
        </form>
    );
};

export default PrescriptionForm;