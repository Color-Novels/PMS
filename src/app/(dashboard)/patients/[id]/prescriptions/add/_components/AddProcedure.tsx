import React, {useState, useEffect} from 'react';
import {Card} from '@/components/ui/card';
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Plus, Loader2} from 'lucide-react';
import {FeeInPrescriptionForm} from './PrescriptionForm'
import {ChargeType} from "@prisma/client";
import {getChargesOnType} from "@/app/lib/actions/charges";

interface AddProcedureChargeProps {
    addCharge: (charge: FeeInPrescriptionForm) => void;
}

interface ChargeOption {
    id: number;
    name: string;
    value: number;
    description: string;
}

const AddProcedureCharge = ({addCharge}: AddProcedureChargeProps) => {
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
                    const response = await getChargesOnType({types: ['PROCEDURE']});
                    setChargeOptions(response.map(charge => ({...charge, description: ''})));
                } catch (err) {
                    setError('Failed to load procedures');
                    console.error('Error fetching procedures:', err);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchCharges();
    }, [isDialogOpen]);

    const handleSelect = (id: number) => {
        const selected = chargeOptions.find(option => option.id === Number(id));
        if (selected) {
            setSelectedCharge({
                id: selected.id,
                name: selected.name,
                value: selected.value,
                description: selected.description,
                type: 'PROCEDURE' as ChargeType
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
            setError('Please select a procedure');
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

    return (
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
                <Card
                    className="border-dashed border-2 p-4 flex justify-center items-center cursor-pointer hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 group"
                >
                    <div className="flex items-center space-x-2 text-slate-500 group-hover:text-slate-800">
                        <Plus className="h-5 w-5 transition-transform duration-200 group-hover:scale-110"/>
                        <span className="font-medium">Add Procedure</span>
                    </div>
                </Card>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Procedure</DialogTitle>
                </DialogHeader>
                {error && <div className="text-red-500">{error}</div>}

                <div className="space-y-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center p-4">
                            <Loader2 className="h-8 w-8 animate-spin text-slate-500"/>
                            <span className="ml-2">Loading procedures...</span>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <label htmlFor="procedure" className="text-sm font-medium">
                                    Select Procedure
                                </label>
                                <select
                                    id="procedure"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400"
                                    onChange={(e) => handleSelect(Number(e.target.value))}
                                    value={selectedCharge?.id || ''}
                                >
                                    <option value="">Select a procedure</option>
                                    {chargeOptions.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.name} - {option.value} LKR
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedCharge && (
                                <>
                                    <div className="space-y-2">
                                        <label htmlFor="value" className="text-sm font-medium">
                                            Value (LKR)
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
                                            Description (optional)
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
                        Add Charge
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddProcedureCharge;