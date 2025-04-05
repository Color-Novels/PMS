import React, {useState, useEffect} from 'react';
import {Card} from '@/components/ui/card';
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Loader2, CreditCard, Percent, Tag} from 'lucide-react';
import {FeeInPrescriptionForm} from './PrescriptionForm';
import {ChargeType} from "@prisma/client";
import {getChargesOnType} from "@/app/lib/actions/charges";

interface AddOtherChargeProps {
    addCharge: (charge: FeeInPrescriptionForm) => void;
    chargeType: Exclude<ChargeType, 'PROCEDURE'>;
}

interface ChargeOption {
    id: number;
    name: string;
    value: number;
    description: string;
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

const getChargeColor = (type: ChargeType) => {
    switch (type) {
        case 'FIXED':
            return 'border-blue-500 text-blue-500 group-hover:text-blue-600';
        case 'PERCENTAGE':
            return 'border-green-500 text-green-500 group-hover:text-green-600';
        case 'DISCOUNT':
            return 'border-amber-500 text-amber-500 group-hover:text-amber-600';
        default:
            return 'border-blue-500 text-blue-500 group-hover:text-blue-600';
    }
};

const getChargeLabel = (type: ChargeType) => {
    switch (type) {
        case 'FIXED':
            return 'Fixed Fee';
        case 'PERCENTAGE':
            return 'Percentage Fee';
        case 'DISCOUNT':
            return 'Discount';
        default:
            return 'Charge';
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

const AddOtherCharge = ({addCharge, chargeType}: AddOtherChargeProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCharge, setSelectedCharge] = useState<FeeInPrescriptionForm | null>(null);
    const [chargeOptions, setChargeOptions] = useState<ChargeOption[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCharges = async () => {
            if (isDialogOpen) {
                setIsLoading(true);
                try {
                    const response = await getChargesOnType({types: [chargeType]});
                    setChargeOptions(response.map(charge => ({...charge, description: ''})));
                } catch (err) {
                    setError(`Failed to load ${chargeType.toLowerCase()} charges`);
                    console.error(`Error fetching ${chargeType.toLowerCase()} charges:`, err);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchCharges().then();
    }, [isDialogOpen, chargeType]);

    const handleSelect = (id: number) => {
        const selected = chargeOptions.find(option => option.id === Number(id));
        if (selected) {
            setSelectedCharge({
                id: selected.id,
                name: selected.name,
                value: selected.value,
                description: selected.description,
                type: chargeType
            });
            setError(null);
        }
    };

    const handleValueChange = (value: string) => {
        if (selectedCharge) {
            setSelectedCharge({
                ...selectedCharge,
                value: Number(value) || 0
            });
        }
    };

    const handleDescriptionChange = (description: string) => {
        if (selectedCharge) {
            setSelectedCharge({
                ...selectedCharge,
                description
            });
        }
    };

    const handleAdd = () => {
        if (!selectedCharge) {
            setError(`Please select a ${chargeType.toLowerCase()} charge`);
            return;
        }

        addCharge(selectedCharge);
        setIsDialogOpen(false);
        setSelectedCharge(null);
    };

    const handleDialogClose = (open: boolean) => {
        setIsDialogOpen(open);
        if (!open) {
            setSelectedCharge(null);
            setError(null);
        }
    };

    const colorClass = getChargeColor(chargeType);
    const chargeLabel = getChargeLabel(chargeType);
    const valueSuffix = getValueSuffix(chargeType);

    return (
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
                <Card
                    className={`border-dashed border-2 p-4 flex justify-center items-center cursor-pointer hover:bg-slate-50 hover:border-${chargeType.toLowerCase()}-400 transition-all duration-200 group`}
                >
                    <div className={`flex items-center space-x-2 ${colorClass}`}>
                        {getChargeIcon(chargeType)}
                        <span className="font-medium">{`Add ${chargeLabel}`}</span>
                    </div>
                </Card>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{`Add ${chargeLabel}`}</DialogTitle>
                </DialogHeader>
                {error && <div className="text-red-500">{error}</div>}

                <div className="space-y-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center p-4">
                            <Loader2 className="h-8 w-8 animate-spin text-slate-500"/>
                            <span className="ml-2">{`Loading ${chargeType.toLowerCase()} charges...`}</span>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <label htmlFor="charge" className="text-sm font-medium">
                                    {`Select ${chargeLabel}`}
                                </label>
                                <select
                                    id="charge"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400"
                                    onChange={(e) => handleSelect(Number(e.target.value))}
                                    value={selectedCharge?.id || ''}
                                >
                                    <option value="">{`Select a ${chargeType.toLowerCase()} charge`}</option>
                                    {chargeOptions.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.name} - {chargeType === 'FIXED' ? `${valueSuffix} ${option.value}` : `${option.value}${valueSuffix}`}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedCharge && (
                                <>
                                    <div className="space-y-2">
                                        <label htmlFor="value" className="text-sm font-medium">
                                            {`Value ${valueSuffix ? `(${valueSuffix})` : ''}`}
                                        </label>
                                        <Input
                                            id="value"
                                            type="number"
                                            value={selectedCharge.value}
                                            onChange={(e) => handleValueChange(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="description" className="text-sm font-medium">
                                            Description
                                        </label>
                                        <Textarea
                                            id="description"
                                            value={selectedCharge.description}
                                            onChange={(e) => handleDescriptionChange(e.target.value)}
                                        />
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
                <DialogFooter>
                    <Button onClick={handleAdd} disabled={isLoading || !selectedCharge}>
                        {`Add ${chargeLabel}`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddOtherCharge;