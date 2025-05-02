import React from 'react';
import {Card} from "@/components/ui/card";
import {
    Clock,
    Calendar,
    AlertCircle,
    Info,
    X, FileText, Moon, Sun, Sunset, Tally3, Tally4, Tally2, Tally1, ClipboardList, CreditCard, Percent, Tag,
} from "lucide-react";
import {FaPills, FaCapsules, FaWineBottle, FaEyeDropper, FaAssistiveListeningSystems} from 'react-icons/fa';
import {MdOutlineHealing} from 'react-icons/md';
import {GiPowder, GiNoseFront, GiLiquidSoap, GiMedicinePills, GiSyringe} from 'react-icons/gi';
import {BsPatchCheck, BsCupStraw} from 'react-icons/bs';
import {TbBottle} from 'react-icons/tb';
import {CgPill, CgSmileMouthOpen} from 'react-icons/cg';
import {BiSolidFlask} from 'react-icons/bi';
import {Button} from "@/components/ui/button";
import {ChargeType, IssuingStrategy, MEAL} from "@prisma/client";
import type {DrugType} from "@prisma/client";
import type {
    FeeInPrescriptionForm,
    IssueInForm,
    OffRecordMeds
} from "@/app/(dashboard)/patients/[id]/prescriptions/add/_components/PrescriptionForm";
import {BasicColorType, CustomBadge} from "@/app/(dashboard)/_components/CustomBadge";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {AlertDialogTitle} from "@radix-ui/react-alert-dialog";
import {FaSprayCan} from "react-icons/fa6";
import {compareChargeTypes} from "@/app/lib/utils";


export interface StrategyIconProps {
    strategy: IssuingStrategy;
    className?: string;
}

export interface StrategyDetailsProps {
    strategy: IssuingStrategy;
    details: {
        strategy: string;
        dose: number | null;
        forDays: number | null;
        forTimes: number | null;
        meal: MEAL | null;
    };
}

// Tablet or Syrup
export const DrugIcon: React.FC<{ drugType: DrugType }> = ({drugType}) => {
    switch (drugType) {
        case 'TABLET':
            return <FaPills className="text-green-600" size={20}/>;
        case 'CAPSULE':
            return <FaCapsules className="text-yellow-600" size={20}/>;
        case 'SYRUP':
            return <FaWineBottle className="text-blue-600" size={20}/>;
        case 'EYE_DROP':
            return <FaEyeDropper className="text-cyan-600" size={20}/>;
        case 'EAR_DROP':
            return <FaAssistiveListeningSystems className="text-purple-600" size={20}/>;
        case 'NASAL_DROP':
            return <GiNoseFront className="text-pink-600" size={20}/>;
        case 'CREAM':
            return <GiLiquidSoap className="text-orange-600" size={20}/>;
        case 'OINTMENT':
            return <GiLiquidSoap className="text-amber-600" size={20}/>;
        case 'GEL':
            return <GiLiquidSoap className="text-blue-400" size={20}/>;
        case 'LOTION':
            return <GiLiquidSoap className="text-teal-600" size={20}/>;
        case 'INJECTION':
            return <GiSyringe className="text-red-600" size={20}/>;
        case 'INHALER':
            return <GiNoseFront className="text-blue-500" size={20}/>;
        case 'SPRAY':
            return <FaSprayCan className="text-indigo-600" size={20}/>;
        case 'LOZENGE':
            return <GiMedicinePills className="text-pink-500" size={20}/>;
        case 'SUPPOSITORY':
            return <CgPill className="text-gray-600" size={20}/>;
        case 'PATCH':
            return <BsPatchCheck className="text-emerald-600" size={20}/>;
        case 'POWDER':
            return <GiPowder className="text-gray-500" size={20}/>;
        case 'SOLUTION':
            return <BiSolidFlask className="text-blue-300" size={20}/>;
        case 'SUSPENSION':
            return <TbBottle className="text-violet-500" size={20}/>;
        case 'GARGLE':
            return <BsCupStraw className="text-cyan-500" size={20}/>;
        case 'MOUTHWASH':
            return <CgSmileMouthOpen className="text-teal-500" size={20}/>;
        default:
            return <MdOutlineHealing className="text-gray-600" size={20}/>;
    }
};


const strategyIconMap: Record<IssuingStrategy, React.ComponentType<{ className?: string, size: number }>> = {
    [IssuingStrategy.TDS]: Tally3,
    [IssuingStrategy.BD]: Tally2,
    [IssuingStrategy.OD]: Tally1,
    [IssuingStrategy.QDS]: Tally4,
    [IssuingStrategy.SOS]: AlertCircle,
    [IssuingStrategy.NOCTE]: Moon,
    [IssuingStrategy.MANE]: Sun,
    [IssuingStrategy.VESPE]: Sunset,
    [IssuingStrategy.NOON]: Clock,
    [IssuingStrategy.WEEKLY]: Calendar,
    [IssuingStrategy.OTHER]: Info,
};

export const getStrategyStyles = (strategy: IssuingStrategy): {
    icon: React.ComponentType<{ className: string, size: number }>;
    iconColor: string;
    color: string;
    borderColor: string;
    badgeColor: keyof BasicColorType;
} => {
    switch (strategy) {
        case IssuingStrategy.TDS:
            return {
                icon: Tally3,
                iconColor: 'text-blue-600',
                color: 'bg-blue-500',
                borderColor: 'border-l-blue-500',
                badgeColor: 'blue',
            };
        case IssuingStrategy.BD:
            return {
                icon: Tally2,
                iconColor: 'text-cyan-600',
                color: 'bg-cyan-500',
                borderColor: 'border-l-cyan-500',
                badgeColor: 'cyan',
            };
        case IssuingStrategy.OD:
            return {
                icon: Tally1,
                iconColor: 'text-green-600',
                color: 'bg-green-500',
                borderColor: 'border-l-green-500',
                badgeColor: 'green',
            };
        case IssuingStrategy.QDS:
            return {
                icon: Tally4,
                iconColor: 'text-purple-600',
                color: 'bg-purple-500',
                borderColor: 'border-l-purple-500',
                badgeColor: 'purple',
            };
        case IssuingStrategy.SOS:
            return {
                icon: AlertCircle,
                iconColor: 'text-red-600',
                color: 'bg-red-500',
                borderColor: 'border-l-red-500',
                badgeColor: 'red',
            };
        case IssuingStrategy.NOCTE:
            return {
                icon: Moon,
                iconColor: 'text-indigo-600',
                color: 'bg-indigo-500',
                borderColor: 'border-l-indigo-500',
                badgeColor: 'indigo',
            };
        case IssuingStrategy.MANE:
            return {
                icon: Sun,
                iconColor: 'text-yellow-600',
                color: 'bg-yellow-500',
                borderColor: 'border-l-yellow-500',
                badgeColor: 'yellow',
            };
        case IssuingStrategy.VESPE:
            return {
                icon: Sunset,
                iconColor: 'text-orange-600',
                color: 'bg-orange-500',
                borderColor: 'border-l-orange-500',
                badgeColor: 'orange',
            };
        case IssuingStrategy.NOON:
            return {
                icon: Clock,
                iconColor: 'text-teal-600',
                color: 'bg-teal-500',
                borderColor: 'border-l-teal-500',
                badgeColor: 'teal',
            };
        case IssuingStrategy.WEEKLY:
            return {
                icon: Calendar,
                iconColor: 'text-stone-600',
                color: 'bg-stone-500',
                borderColor: 'border-l-stone-500',
                badgeColor: 'stone',
            };
        case IssuingStrategy.OTHER:
            return {
                icon: Info,
                iconColor: 'text-gray-600',
                color: 'bg-gray-500',
                borderColor: 'border-l-gray-500',
                badgeColor: 'gray',
            };
        default:
            return {
                icon: Info,
                iconColor: 'text-gray-600',
                color: 'bg-gray-500',
                borderColor: 'border-l-gray-500',
                badgeColor: 'gray',
            };
    }
};


export const StrategyIcon: React.FC<StrategyIconProps> = ({strategy, className}) => {
    const IconComponent = strategyIconMap[strategy];
    if (!IconComponent) return null;

    return <IconComponent size={18} className={className}/>;
};

function formatMeal(meal: MEAL | null) {
    switch (meal) {
        case MEAL.BEFORE:
            return <span className="font-semibold text-red-600">before meal</span>;
        case MEAL.AFTER:
            return <span className="font-semibold text-green-600">after meal</span>;
        case MEAL.WITH:
            return <span className="font-semibold text-blue-600">with meal</span>;
        default:
            return null;
    }
}

export const StrategyDetails: React.FC<StrategyDetailsProps> = ({strategy, details}) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-slate-600">
                <StrategyIcon strategy={strategy} className={getStrategyStyles(strategy).iconColor}/>
                {(() => {
                    // For topical medications, dose is null
                    const isTopical = details.dose === null;
                    const highlightedDose = isTopical
                        ? <span className="font-bold text-primary">Topical use </span>
                        : <span className="font-bold text-primary">{details.dose} units </span>;

                    switch (strategy) {
                        case IssuingStrategy.TDS:
                        case IssuingStrategy.BD:
                        case IssuingStrategy.OD:
                        case IssuingStrategy.QDS:
                        case IssuingStrategy.NOCTE:
                        case IssuingStrategy.MANE:
                        case IssuingStrategy.VESPE:
                        case IssuingStrategy.NOON:
                            return (
                                <span>
                                    {details.strategy} - {highlightedDose} - {!isTopical && `for ${details.forDays} days`} {formatMeal(details.meal)}
                                </span>
                            );
                        case IssuingStrategy.SOS:
                            return (
                                <span>
                                    {details.strategy} - {highlightedDose} as needed
                                    for {details.forTimes} times {formatMeal(details.meal)}
                                </span>
                            );
                        case IssuingStrategy.WEEKLY:
                            return (
                                <span>
                                    Weekly: {highlightedDose} × {details.forTimes} times {formatMeal(details.meal)}
                                </span>
                            );
                        case IssuingStrategy.OTHER:
                            return (
                                <span>
                                    {details.strategy} - {highlightedDose} × {details.forTimes} days {formatMeal(details.meal)}
                                </span>
                            );
                        default:
                            return null;
                    }
                })()}
            </div>
        </div>
    );
};

export interface PrescriptionIssuesListProps {
    issues: IssueInForm[];
    onRemove: (index: number) => void;
}

export function PrescriptionIssuesList({issues, onRemove}: PrescriptionIssuesListProps) {
    return (
        <div className="space-y-4">
            {issues.map((issue, index) => {
                const {borderColor, badgeColor} = getStrategyStyles(issue.strategy);
                return (
                    <Card key={index}
                          className={`p-4 cursor-default hover:shadow-md transition h-full overflow-hidden border-l-4 ${borderColor}`}>
                        <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                                <div className="mt-1">
                                    <DrugIcon drugType={issue.drugType}/>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center space-x-2">
                                        <h3 className="font-medium">{issue.drugName} - {issue.concentration} mg/unit
                                            - </h3>
                                        <CustomBadge text={issue.strategy} color={badgeColor}/>
                                    </div>
                                    <div>
                                        <span className="text-sm text-slate-500">{issue.details}</span>
                                    </div>
                                    <div className="text-sm text-slate-500">
                                        Drug: {issue.drugName} •
                                        Type: {issue.drugType.charAt(0).toUpperCase() + issue.drugType.slice(1).toLowerCase()}
                                        • Concentration: {issue.concentration} mg/unit •
                                        Brand: {issue.brandName} • Quantity: {issue.quantity}
                                        {issue.dose === null && " • Topical application"}
                                    </div>
                                    <StrategyDetails strategy={issue.strategy} details={issue}/>
                                </div>
                            </div>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="text-slate-500 hover:text-red-600">
                                        <X className="h-4 w-4"/>
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Remove Medicine {index + 1}?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to remove {issue.drugName} ({issue.brandName}) from
                                            the list? This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => onRemove(index)}
                                                           className={'bg-red-600 text-white hover:bg-red-700'}>
                                            Remove
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}


export interface OffRecordMedsListProps {
    meds: OffRecordMeds[];
    onRemove: (index: number) => void;
}

export function OffRecordMedsList({meds, onRemove}: OffRecordMedsListProps) {
    return (
        <div className="space-y-3">
            {meds.map((med, index) => (
                <Card key={index}
                      className="p-4 cursor-default hover:shadow-md transition h-full overflow-hidden border-l-4 border-l-slate-500">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                            <div className="mt-1">
                                <AlertCircle className="h-5 w-5 text-slate-500"/>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                    <h3 className="font-medium">{med.name}</h3>
                                </div>
                                {med.description && (
                                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                                        <FileText size={20}/>
                                        <span>{med.description}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-slate-500 hover:text-red-600"
                                >
                                    <X className="h-4 w-4"/>
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Remove Medication?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to remove {med.name} from the list?
                                        This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => onRemove(index)}
                                                       className={'bg-red-600 text-white hover:bg-red-700'}>
                                        Remove
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </Card>
            ))}
        </div>
    );
}

export interface ProcedureChargesListProps {
    charges: FeeInPrescriptionForm[];
    onRemove: (index: number) => void;
}

export function ProcedureChargesList({charges, onRemove}: ProcedureChargesListProps) {
    return (
        <div className="space-y-3">
            {charges.length !== 0 && (
                charges.map((charge, index) => (
                    <Card
                        key={index}
                        className="p-4 cursor-default hover:shadow-md transition h-full overflow-hidden border-l-4 border-l-purple-500"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                                <div className="mt-1">
                                    <ClipboardList className="h-5 w-5 text-purple-500"/>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center space-x-2">
                                        <h3 className="font-medium">{charge.name}</h3>
                                        <CustomBadge text={charge.type} color={'purple'}/>
                                    </div>

                                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                                        <span className="font-semibold">{charge.value.toFixed(2)} LKR</span>
                                    </div>

                                    {charge.description && (
                                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                                            <FileText size={18}/>
                                            <span>{charge.description}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-slate-500 hover:text-red-600"
                                    >
                                        <X className="h-4 w-4"/>
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Remove Procedure Charge?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to remove {charge.name} from the list?
                                            This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => onRemove(index)}
                                            className="bg-red-600 text-white hover:bg-red-700"
                                        >
                                            Remove
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </Card>
                ))
            )}
        </div>
    );
}


export interface OtherChargesListProps {
    charges: FeeInPrescriptionForm[];
    onRemove: (index: number) => void;
}

const getChargeIcon = (type: ChargeType) => {
    switch (type) {
        case 'FIXED':
            return <CreditCard className="h-5 w-5 text-blue-500"/>;
        case 'PERCENTAGE':
            return <Percent className="h-5 w-5 text-green-500"/>;
        case 'DISCOUNT':
            return <Tag className="h-5 w-5 text-amber-500"/>;
        default:
            return <CreditCard className="h-5 w-5 text-blue-500"/>;
    }
};

const getCardBorderColor = (type: ChargeType) => {
    switch (type) {
        case 'FIXED':
            return 'border-l-blue-500';
        case 'PERCENTAGE':
            return 'border-l-green-500';
        case 'DISCOUNT':
            return 'border-l-amber-500';
        default:
            return 'border-l-blue-500';
    }
};

const getBadgeColor = (type: ChargeType): keyof BasicColorType => {
    switch (type) {
        case 'FIXED':
            return 'blue';
        case 'PERCENTAGE':
            return 'green';
        case 'DISCOUNT':
            return 'amber';
        default:
            return 'blue';
    }
};

const getValueSuffix = (type: ChargeType) => {
    switch (type) {
        case 'FIXED':
            return 'LKR';
        case 'PERCENTAGE':
            return '%';
        case 'DISCOUNT':
            return '%';
        default:
            return '';
    }
};

export function OtherChargesList({charges, onRemove}: OtherChargesListProps) {
    // Filter out PROCEDURE charges
    const filteredCharges = charges.filter(charge => charge.type !== 'PROCEDURE');

    // Sort using the custom order
    filteredCharges.sort((a, b) => {
        // Get the order values for each charge type
        return compareChargeTypes(a.type, b.type);
    });

    return (
        <div className="space-y-3">
            {filteredCharges.length === 0 ? (
                <div className="text-center p-4 text-slate-500">
                    No charges or discounts added
                </div>
            ) : (
                filteredCharges.map((charge, index) => {
                    const borderColor = getCardBorderColor(charge.type);
                    const badgeColor = getBadgeColor(charge.type);
                    const valueSuffix = getValueSuffix(charge.type);

                    return (
                        <Card
                            key={index}
                            className={`p-4 cursor-default hover:shadow-md transition h-full overflow-hidden border-l-4 ${borderColor}`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4">
                                    <div className="mt-1">
                                        {getChargeIcon(charge.type)}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-2">
                                            <h3 className="font-medium">{charge.name}</h3>
                                            <CustomBadge text={charge.type} color={badgeColor}/>
                                        </div>

                                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                                            {charge.type === 'FIXED' ? (
                                                <span
                                                    className="font-semibold">{valueSuffix} {charge.value.toFixed(2)}</span>
                                            ) : (
                                                <span
                                                    className="font-semibold">{charge.value.toFixed(2)}{valueSuffix}</span>
                                            )}
                                        </div>

                                        {charge.description && (
                                            <div className="flex items-center space-x-2 text-sm text-slate-600">
                                                <FileText size={18} className="flex-shrink-0"/>
                                                <span>{charge.description}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-slate-500 hover:text-red-600"
                                        >
                                            <X className="h-4 w-4"/>
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Remove {charge.type === 'DISCOUNT' ? 'Discount' : 'Charge'}?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to remove {charge.name} from the list?
                                                This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => onRemove(index)}
                                                className="bg-red-600 text-white hover:bg-red-700"
                                            >
                                                Remove
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </Card>
                    );
                })
            )}
        </div>
    );
}