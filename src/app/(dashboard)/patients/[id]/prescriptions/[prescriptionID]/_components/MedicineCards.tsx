import React from 'react';
import {Card} from "@/components/ui/card";
import {
    AlertCircle, ClipboardList, CreditCard,
    FileText, Percent, Tag
} from "lucide-react";
import {
    Batch,
    ChargeType,
    Drug,
    DrugBrand,
    Issue,
    OffRecordMeds,
    PrescriptionCharges,
    UnitConcentration
} from "@prisma/client";
import {BasicColorType, CustomBadge} from "@/app/(dashboard)/_components/CustomBadge";
import {
    getStrategyStyles, DrugIcon, StrategyDetails,
} from "@/app/(dashboard)/patients/[id]/prescriptions/add/_components/PrescriptionIssuesList";
import {calculateForDays, calculateTimes, compareChargeTypes} from "@/app/lib/utils";

export interface IssueWithDetails extends Issue {
    drug: Drug;
    brand: DrugBrand,
    batch: Batch | null;
    unitConcentration: UnitConcentration;
}

const PrescriptionIssueCard = ({issue}: { issue: IssueWithDetails }) => {
    if (!issue) {
        return <div className="text-center text-red-500 font-semibold">Issue not found</div>;
    }

    const cardStyles = getStrategyStyles(issue.strategy);

    return (
        <Card
            className={`p-4 flex-grow overflow-hidden border-l-4 cursor-default ${cardStyles.borderColor}`}>
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                    <div className="mt-1">
                        <DrugIcon drugType={issue.type}/>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{issue.drug.name} ({issue.type.charAt(0).toUpperCase() + issue.type.slice(1).toLowerCase()})
                                - {issue.unitConcentration.concentration} mg/unit</h3>
                            <CustomBadge
                                text={issue.strategy}
                                color={cardStyles.badgeColor}
                            />
                        </div>
                        <div className="text-sm text-slate-600 flex flex-wrap items-center gap-1">
                            <div>
                                <span className="font-medium text-slate-500">Drug: </span>
                                <span className="text-gray-900 font-semibold">{issue.drug.name}</span>
                            </div>
                            <span className="text-gray-400">|</span>
                            <div>
                                <span className="font-medium text-slate-500">Brand: </span>
                                <span className="text-gray-900 font-semibold">{issue.brand.name}</span>
                            </div>
                            {issue.batch?.id && (
                                <>
                                    <span className="text-gray-400">|</span>
                                    <div>
                                        <span className="font-medium text-slate-500">Batch #: </span>
                                        <span className="text-gray-900 font-semibold">{issue.batch.number}</span>
                                    </div>
                                </>
                            )}
                            <span className="text-gray-400">|</span>
                            <div>
                                <span className="font-medium text-slate-500">Quantity: </span>
                                <span className="text-gray-900 font-semibold">{issue.quantity}</span>
                            </div>
                        </div>
                        <StrategyDetails strategy={issue.strategy} details={{
                            strategy: issue.strategy,
                            dose: issue.dose,
                            meal: issue.meal,
                            forDays: calculateForDays({
                                strategy: issue.strategy,
                                dose: issue.dose,
                                quantity: issue.quantity
                            }),
                            forTimes: calculateTimes({
                                strategy: issue.strategy,
                                dose: issue.dose,
                                quantity: issue.quantity
                            }),
                        }}/>
                        <div>
                            <span className="text-sm text-slate-500">{issue.details}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

const OffRecordMedCard = ({med}: { med: OffRecordMeds }) => {
    if (!med) {
        return <div className="text-center text-red-500 font-semibold">Medicine not found</div>;
    }

    return (
        <Card className="p-4 flex-grow overflow-hidden border-l-4 border-l-slate-500 cursor-default">
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
            </div>
        </Card>
    );
};

export interface OtherChargesListProps {
    charges: PrescriptionCharges[];
}

const getChargeIcon = (type: ChargeType) => {
    switch (type) {
        case 'PROCEDURE':
            return <ClipboardList className="h-5 w-5 text-purple-500"/>;
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
        case 'PROCEDURE':
            return 'border-l-purple-500';
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
        case 'PROCEDURE':
            return 'purple';
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

function ChargesList({charges}: OtherChargesListProps) {
    // Sort using the custom order
    charges.sort((a, b) => {
        // Get the order values for each charge type
        return compareChargeTypes(a.type, b.type);
    });

    return (
        <div className="space-y-3">

            {charges.map((charge, index) => {
                    const borderColor = getCardBorderColor(charge.type);
                    const badgeColor = getBadgeColor(charge.type);
                    const valueSuffix = getValueSuffix(charge.type);

                    return (
                        <Card
                            key={index}
                            className={`p-4 cursor-default h-full overflow-hidden border-l-4 ${borderColor}`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4">
                                    <div className="mt-1">
                                        {getChargeIcon(charge.type)}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-2">
                                            <h3 className="font-medium">{charge.name}</h3>
                                            <CustomBadge text={charge.name} color={badgeColor}/>
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
                            </div>
                        </Card>
                    );
                }
            )}
        </div>
    );
}

export {PrescriptionIssueCard, OffRecordMedCard, ChargesList};