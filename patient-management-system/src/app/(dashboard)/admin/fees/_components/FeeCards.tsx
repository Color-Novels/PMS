import React from 'react';
import {Card, CardHeader, CardContent} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {CreditCard, Percent, Tag, LucideIcon, HelpCircle, Trash2, ClipboardList, BriefcaseMedical} from 'lucide-react';
import {format} from "date-fns";
import {FeeInForm} from "@/app/(dashboard)/admin/fees/_components/FeeForm";
import {ChargeType} from "@prisma/client";
import {Tooltip, TooltipTrigger, TooltipContent} from "@/components/ui/tooltip";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTrigger,
    AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogDescription, AlertDialogAction
} from "@/components/ui/alert-dialog";
import {Button} from "@/components/ui/button";
import {BasicColorType, CustomBadge} from "@/app/(dashboard)/_components/CustomBadge";

// Icons and styles mapping
export const feeTypes: Record<ChargeType, {
    icon: LucideIcon,
    color: keyof BasicColorType,
    suffix?: string,
    description: string,
    type: 'auto-added' | 'selective',
    precedence: number,
    removable?: boolean,
}> = {
    MEDICINE: {
        icon: BriefcaseMedical,
        color: "gray",
        description: "Medicine fees will be added to each patient's bill based on the medicine prescribed. Non-removable",
        type: 'auto-added',
        precedence: 0,
        removable: false,
    },
    FIXED: {
        icon: CreditCard,
        color: "blue",
        description: "Fixed fees will add to each patient's bill regardless of the total bill amount. Applied after the procedure fees. Can be removed at prescription",
        suffix: 'LKR',
        type: 'auto-added',
        precedence: 2,
        removable: true,
    },
    PERCENTAGE: {
        icon: Percent,
        color: "green",
        suffix: "%",
        description: "Percentage fees will be calculated based on the total bill amount on each patient's bill. Applied after the fixed fees. Can be removed at prescription",
        type: 'auto-added',
        precedence: 3,
        removable: true,
    },
    DISCOUNT: {
        icon: Tag,
        color: "amber",
        suffix: '%',
        description: "Discount percentage will subtract from each patient's bill, you can selectively apply this to each patient. They will add to the bill Last and do stack with other discounts",
        type: 'selective',
        precedence: 4,
        removable: true,
    },
    PROCEDURE: {
        icon: ClipboardList,
        color: "purple",
        description: "Procedure fees will be added to each patient's bill based on the procedure performed, you can selectively apply this to each patient",
        suffix: 'LKR',
        type: 'selective',
        precedence: 1,
        removable: true,
    },
};

// Format date function
const formatDate = (date: Date | null) => date ? format(date, "MMM d, yyyy h:mm a") : "Not available";

// Reusable FeesCard component
const FeesCard = ({feeValues, handleInputChange, type, handleDeleteFee}: {
    feeValues: FeeInForm[],
    handleInputChange: (feeId: number, value: string) => void,
    type: keyof typeof feeTypes,
    handleDeleteFee: (feeId: number, name: string) => void,
}) => {
    const fees = feeValues.filter(fee => fee.type === type);
    const {icon: Icon, color, suffix, description, precedence, type: typeCS} = feeTypes[type];

    return (
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className={`bg-${color}-50 border-b flex flex-row justify-between items-center`}>
                <div className={`flex gap-2`}>
                    <div className={`flex items-center text-${color}-800`}>
                        <Icon className="mr-2" size={20}/>
                        {type.charAt(0) + type.slice(1).toLowerCase()} Fees {suffix ? `(${suffix})` : ''}
                    </div>
                    <CustomBadge text={`#${precedence}`} color={"red"} inverse/>
                    <CustomBadge text={`#${typeCS}`} color={typeCS === 'auto-added' ? 'red' : 'green'}/>
                    <CustomBadge text={'removable'} color={'green'}/>
                    <Tooltip>
                        <TooltipTrigger>
                            <HelpCircle className={`text-${color}-800`} size={18}/>
                        </TooltipTrigger>
                        <TooltipContent>
                            {description}
                        </TooltipContent>
                    </Tooltip>
                </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
                {fees.length > 0 ? (
                    fees.map(fee => (
                        <Card key={fee.name}
                              className={`p-4 cursor-pointer hover:shadow-md transition h-full overflow-hidden border-l-4 border-l-${color}-500`}>
                            <div className="mb-4">
                                <div className={'flex items-center justify-between mb-4'}>
                                    <label
                                        className={`block text-sm font-medium text-${color}-700 mb-2`}>{fee.name}</label>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button size={'icon'} variant={'ghost'}>
                                                <Trash2 className={`text-red-500`} size={18}/>
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle className={'font-semibold text-lg'}>
                                                    Are you sure you want to delete this fee?
                                                </AlertDialogTitle>
                                            </AlertDialogHeader>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete the fee.
                                            </AlertDialogDescription>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>
                                                    Cancel
                                                </AlertDialogCancel>
                                                <AlertDialogAction asChild>
                                                    <Button onClick={() => handleDeleteFee(fee.id, fee.name)}
                                                            className={'bg-red-600 text-white hover:bg-red-700'}>
                                                        Delete
                                                    </Button>
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                                <div className="flex space-x-2">
                                    <Input
                                        type="number"
                                        value={fee.value}
                                        onChange={(e) => handleInputChange(fee.id, e.target.value)}
                                        className="flex-grow"
                                    />
                                    {suffix && <span
                                        className={`flex items-center text-${color}-600 font-medium`}>{suffix}</span>}
                                </div>
                            </div>
                            {!fee.updated ? (
                                <div className={`text-xs text-${color}-500 italic`}>Last
                                    Updated: {formatDate(fee.updatedAt)}</div>
                            ) : (
                                <div className="text-xs text-red-500 italic">Unsaved</div>
                            )}
                        </Card>
                    ))
                ) : (
                    <p className="text-sm text-gray-500">No {type.toLowerCase()} fees available</p>
                )}
            </CardContent>
        </Card>
    );
};

export const MedicineFeesInfoCard = () => {
    return (
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-gray-50 border-b flex flex-row justify-between items-center">
                <div className="flex gap-2">
                    <div className="flex items-center text-gray-800">
                        <BriefcaseMedical className="mr-2" size={20}/>
                        Medicine Fees
                    </div>
                    <CustomBadge text="#0" color="red" inverse/>
                    <CustomBadge text="#auto-added" color="red"/>
                    <CustomBadge text="non-removable" color="red"/>
                    <Tooltip>
                        <TooltipTrigger>
                            <HelpCircle className="text-gray-800" size={18}/>
                        </TooltipTrigger>
                        <TooltipContent>
                            Medicine fees will be added to each patient&#39;s bill based on the medicine prescribed.
                            Non-removable.
                        </TooltipContent>
                    </Tooltip>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div
                    className="flex items-center justify-center p-4 min-h-24 border border-gray-200 rounded-md bg-gray-50">
                    <p className="text-gray-700 text-center">
                        Medicine fees are automatically added to each prescription based on the prescribed medications.
                        These fees are non-removable and will always be applied to patient bills.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};


export const FixedFeesCard = (props: {
    feeValues: FeeInForm[],
    handleInputChange: (feeId: number, value: string) => void,
    handleDeleteFee: (feeId: number, name: string) => void
}) => <FeesCard {...props} type="FIXED"/>;
export const PercentageFeesCard = (props: {
    feeValues: FeeInForm[],
    handleInputChange: (feeId: number, value: string) => void,
    handleDeleteFee: (feeId: number, name: string) => void
}) => <FeesCard {...props} type="PERCENTAGE"/>;
export const DiscountFeesCard = (props: {
    feeValues: FeeInForm[],
    handleInputChange: (feeId: number, value: string) => void,
    handleDeleteFee: (feeId: number, name: string) => void
}) => <FeesCard {...props} type="DISCOUNT"/>;
export const ProcedureFeesCard = (props: {
    feeValues: FeeInForm[],
    handleInputChange: (feeId: number, value: string) => void,
    handleDeleteFee: (feeId: number, name: string) => void
}) => <FeesCard {...props} type="PROCEDURE"/>;