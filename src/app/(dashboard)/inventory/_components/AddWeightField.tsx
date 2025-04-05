import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Plus, Trash2} from "lucide-react";
import {DrugConcentrationDataSuggestion} from "@/app/lib/definitions";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import CustomConcentrationSelect
    from "@/app/(dashboard)/inventory/available-stocks/_components/CustomConcentrationSelect";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";

interface DrugConcentrationFieldProps {
    concentrations: DrugConcentrationDataSuggestion[];
    selectedConcentrationId?: number;
    drugId?: number;
    onChange: (e: number) => void;
    onConcentrationAdded: (concentration: DrugConcentrationDataSuggestion) => void;
    onConcentrationDeleted: (concentrationId: DrugConcentrationDataSuggestion) => void;
}

export function DrugConcentrationField({
                                           concentrations,
                                           selectedConcentrationId,
                                           onChange,
                                           onConcentrationAdded,
                                           onConcentrationDeleted,
                                       }: DrugConcentrationFieldProps) {
    const [showModal, setShowModal] = useState(false);
    const [newConcentration, setNewConcentration] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedConcentrationToDelete, setSelectedConcentrationToDelete] = useState<
        DrugConcentrationDataSuggestion | null
    >(null);

    const uniqueConcentrations = Array.from(
        new Map(concentrations.map((concentration) => [concentration.id, concentration])).values()
    );

    const handleAddConcentration = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!newConcentration) {
            setError("Concentration is required");
            return;
        }

        const concentrationValue = parseFloat(newConcentration);
        if (isNaN(concentrationValue) || concentrationValue <= 0) {
            setError("Please enter a valid concentration");
            return;
        }
        const concentrationExists = uniqueConcentrations.some((w) => w.concentration === concentrationValue);
        if (concentrationExists) {
            setError("This concentration already exists");
            return;
        }

        onConcentrationAdded({
            id: -1,
            concentration: concentrationValue,
        });
        setShowModal(false);
    };

    const handleDeleteConcentration = async () => {
        if (selectedConcentrationToDelete !== null) {
            onConcentrationDeleted(selectedConcentrationToDelete);
        }
        setDeleteDialogOpen(false);
    };

    return (
        <div className="relative">
            <div className="flex gap-2 items-end">
                <div className="flex-1">
                    <label htmlFor="concentration" className="block text-sm font-medium mb-1">
                        Drug Concentration
                    </label>
                    <div className={`flex gap-2 items-center`}>
                        <CustomConcentrationSelect
                            value={selectedConcentrationId || 0}
                            onValueChange={onChange}
                            concentrations={uniqueConcentrations}
                        />
                        <Dialog open={showModal} onOpenChange={setShowModal}>
                            <DialogTrigger asChild>
                                <Button className="bg-primary-500 hover:bg-primary-600 h-8 w-8"
                                        onClick={() => setShowModal(true)}>
                                    <Plus/>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="w-96">
                                <DialogHeader>
                                    <DialogTitle>Add New Concentration</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-2">
                                    <label htmlFor="newConcentration" className="block text-sm font-medium">
                                        Concentration (mg/unit)
                                    </label>
                                    <div className={`flex gap-2 items-center`}>
                                        <Input
                                            id="newConcentration"
                                            type="number"
                                            value={newConcentration}
                                            onChange={(e) => setNewConcentration(e.target.value)}
                                            min="0"
                                            step="0.1"
                                            className="w-ful h-8"
                                        />
                                        <Button onClick={handleAddConcentration}
                                                className="bg-primary-500 hover:bg-primary-600">
                                            Add
                                        </Button>
                                    </div>
                                </div>
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                                <div className="mt-1">
                                    <h4 className="text-sm font-medium mb-2">Existing Concentrations</h4>
                                    <div className="max-h-52 overflow-y-auto border rounded-md p-2">
                                        {uniqueConcentrations.map((concentration) => (
                                            <div key={concentration.id}
                                                 className="flex justify-between items-center py-2 border-b">
                                                <span>{concentration.concentration} mg</span>
                                                {concentration.id < 0 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        className="text-red-500 hover:text-red-700 p-1"
                                                        onClick={() => {
                                                            setSelectedConcentrationToDelete(concentration);
                                                            setDeleteDialogOpen(true);
                                                        }}
                                                    >
                                                        <Trash2 className="w-4 h-4"/>
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this concentration? This action cannot be
                            undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteConcentration}>
                            Delete
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default DrugConcentrationField;
