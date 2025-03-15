import React from 'react';
import {Card} from "@/components/ui/card";
import {
    Clock,
    Calendar,
    AlertCircle,
    Info,
    X, FileText, Moon, Sun, Sunset, Tally3, Tally4, Tally2, Tally1,
} from "lucide-react";
import {FaPills, FaCapsules, FaWineBottle, FaEyeDropper, FaAssistiveListeningSystems} from 'react-icons/fa';
import {MdOutlineHealing} from 'react-icons/md';
import {GiPowder, GiNoseFront, GiLiquidSoap, GiMedicinePills, GiSyringe} from 'react-icons/gi';
import {BsPatchCheck, BsCupStraw} from 'react-icons/bs';
import {TbBottle} from 'react-icons/tb';
import {CgPill, CgSmileMouthOpen} from 'react-icons/cg';
import {BiSolidFlask} from 'react-icons/bi';
import {Button} from "@/components/ui/button";
import {IssuingStrategy, MEAL} from "@prisma/client";
import type {DrugType} from "@prisma/client";
import type {
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


export interface StrategyIconProps {
    strategy: IssuingStrategy;
    className?: string;
}

export interface StrategyDetailsProps {
    strategy: IssuingStrategy;
    details: {
        strategy: string;
        dose: number;
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
                    const highlightedDose = <span className="font-bold text-green-700">{details.dose} units</span>;

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
                                    {details.strategy} - {highlightedDose} for {details.forDays} days {formatMeal(details.meal)}
                                </span>
                            );
                        case IssuingStrategy.SOS:
                            return (
                                <span>
                                    {details.strategy} - {highlightedDose} as needed for {details.forTimes} times {formatMeal(details.meal)}
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

const PrescriptionIssuesList: React.FC<PrescriptionIssuesListProps> = ({issues, onRemove}) => {
    return (
        <div className="space-y-4">
            {issues.map((issue, index) => {
                const {borderColor, badgeColor} = getStrategyStyles(issue.strategy);
                return (
                    <Card key={index}
                          className={`p-4 cursor-pointer hover:shadow-md transition h-full overflow-hidden border-l-4 ${borderColor}`}>
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
                                        Drug: {issue.drugName} • Type: {issue.drugType.charAt(0).toUpperCase() + issue.drugType.slice(1).toLowerCase()}
                                        • Concentration: {issue.concentration} mg/unit •
                                        Brand: {issue.brandName} • Quantity: {issue.quantity}
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
};


interface OffRecordMedsListProps {
    meds: OffRecordMeds[];
    onRemove: (index: number) => void;
}

const OffRecordMedsList: React.FC<OffRecordMedsListProps> = ({meds, onRemove}) => {
    return (
        <div className="space-y-3">
            {meds.map((med, index) => (
                <Card key={index}
                      className="p-4 cursor-pointer hover:shadow-md transition h-full overflow-hidden border-l-4 border-l-slate-500">
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
                                        <FileText className="h-4 w-4"/>
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
};

export {PrescriptionIssuesList, OffRecordMedsList};