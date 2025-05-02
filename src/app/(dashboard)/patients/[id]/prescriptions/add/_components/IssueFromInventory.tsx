'use client';

import React, {useEffect, useState} from 'react';
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {useDebouncedCallback} from "use-debounce";
import {
    getCachedStrategy,
    searchAvailableDrugs,
    getConcentrationByDrug,
    getBrandByDrugConcentrationType, getDrugTypesByDrug
} from "@/app/lib/actions/prescriptions";
import DrugCombobox from "./DrugCombobox";
import BrandCombobox from "./BrandCombobox";
import MedicationStrategyTabs from "./MedicationStratergyTabs";
import {Button} from "@/components/ui/button";
import {IssuingStrategy, MEAL} from "@prisma/client";
import type {DrugType} from "@prisma/client";
import type {IssueInForm} from "@/app/(dashboard)/patients/[id]/prescriptions/add/_components/PrescriptionForm";
import {calculateForDays, calculateQuantity, calculateTimes} from "@/app/lib/utils";
import {CircleAlert, ClipboardCheck, Pencil, Plus, TriangleAlert, Utensils} from "lucide-react";
import {Textarea} from "@/components/ui/textarea";
import {differenceInDays} from "date-fns";
import ConcentrationComboBox from "@/app/(dashboard)/patients/[id]/prescriptions/add/_components/ConcentrationComboBox";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Switch} from "@/components/ui/switch";
import DrugTypeComboBox from "@/app/(dashboard)/patients/[id]/prescriptions/add/_components/DrugTypeCombobox";
import {Id, toast} from "react-toastify";

interface IssuesListProps {
    onAddIssue: (issue: IssueInForm) => void;
    onUpdateIssue?: (issue: IssueInForm, originalIssue: IssueInForm) => void;
    issueToEdit?: IssueInForm | null;
    isEditMode?: boolean;
}

export type DrugOption = {
    id: number;
    name: string;
}

export type CustomDrugType = {
    name: string,
    type: DrugType
}

export interface ConcentrationOption {
    id: number;
    concentration: string;
    brandCount: number;
    totalRemainingQuantity: number;
    farthestExpiry: Date;
}

export interface BrandOption {
    id: number;
    name: string;
    batchCount: number;
    totalRemainingQuantity: number;
    farthestExpiry: Date;
}

type CachedStrategy = Awaited<ReturnType<typeof getCachedStrategy>>

const IssueFromInventory: React.FC<IssuesListProps> = ({
                                                           onAddIssue,
                                                           onUpdateIssue,
                                                           issueToEdit = null,
                                                           isEditMode = false
                                                       }) => {
    const [open, setOpen] = useState(false);
    const [isDrugSearching, setIsDrugSearching] = useState(false);
    const [isBrandSearching, setIsBrandSearching] = useState(false);
    const [isConcentrationSearching, setIsConcentrationSearching] = useState(false);
    const [isTypeSearching, setIsTypeSearching] = useState(false);
    const [cacheFetching, setCacheFetching] = useState(false);

    const [drugs, setDrugs] = useState<DrugOption[]>([]);
    const [selectedDrug, setSelectedDrug] = useState<DrugOption | null>(null);

    const [types, setTypes] = useState<CustomDrugType[]>([]);
    const [selectedType, setSelectedType] = useState<CustomDrugType | null>(null);

    const [concentrations, setConcentrations] = useState<ConcentrationOption[]>([]);
    const [selectedConcentration, setSelectedConcentration] = useState<ConcentrationOption | null>(null);

    const [brands, setBrands] = useState<BrandOption[]>([]);
    const [selectedBrand, setSelectedBrand] = useState<BrandOption | null>(null);

    const [details, setDetails] = useState<string>("");

    const [strategy, setStrategy] = useState<IssuingStrategy | null>(null);

    const [error, setError] = useState<string | null>(null);
    const [warning, setWarning] = useState<string | null>(null);

    const [dose, setDose] = useState<number | null>(null);
    const [times, setTimes] = useState<number | null>(null);
    const [forDays, setForDays] = useState<number | null>(null);
    const [mealTiming, setMealTiming] = useState<MEAL | null>(null);

    const [isTopical, setIsTopical] = useState<boolean>(false);
    const [directQuantity, setDirectQuantity] = useState<number | null>(null);


    // Function to load existing issue data
    const loadIssueForEditing = async (issue: IssueInForm) => {
        try {
            // Create toast to track progress
            const toastId = toast.loading("Loading issue data...", {
                position: "bottom-right",
                pauseOnFocusLoss: false,
                closeButton: true,
            });

            setSelectedDrug({id: issue.drugId, name: issue.drugName});
            setIsTopical(issue.dose === null);
            setStrategy(issue.strategy);
            setMealTiming(issue.meal);
            setDetails(issue.details || "");

            // Set appropriate values based on medication type
            if (issue.dose === null) {
                // Topical medication
                setDirectQuantity(issue.quantity);
            } else {
                // Standard medication
                setDose(issue.dose);

                if (issue.strategy === IssuingStrategy.OTHER ||
                    issue.strategy === IssuingStrategy.SOS ||
                    issue.strategy === IssuingStrategy.WEEKLY) {
                    setTimes(issue.forTimes);
                } else {
                    setForDays(issue.forDays);
                }
            }

            // Load drug type
            const types = await getDrugTypesByDrug(issue.drugId);
            setTypes(types);
            const matchingType = types.find(t => t.type === issue.drugType) || null;
            setSelectedType(matchingType);

            // Load concentrations
            const concentrations = await getConcentrationByDrug({
                drugID: issue.drugId,
                type: issue.drugType,
            });
            setConcentrations(concentrations);
            const matchingConcentration = concentrations.find(c => c.id === issue.concentrationID) || null;
            setSelectedConcentration(matchingConcentration);

            // Load brands
            if (matchingConcentration) {
                const brands = await getBrandByDrugConcentrationType({
                    drugID: issue.drugId,
                    concentrationID: issue.concentrationID,
                    type: issue.drugType,
                });
                setBrands(brands);
                const matchingBrand = brands.find(b => b.id === issue.brandId) || null;
                setSelectedBrand(matchingBrand);

                if (matchingBrand) {
                    showWarnings(matchingBrand);
                }
            }

            toast.update(toastId, {
                render: "Issue loaded for editing",
                type: "success",
                isLoading: false,
                autoClose: 1500,
            });
        } catch (error) {
            console.error("Error loading issue data:", error);
            setError("Failed to load issue data for editing");
            toast.error("Failed to load issue data");
        } finally {
            setCacheFetching(false);
            setIsDrugSearching(false);
            setIsConcentrationSearching(false);
            setIsBrandSearching(false);
            setIsTypeSearching(false);
        }
    };

    // Effect to load data when editing an existing issue
    useEffect(() => {
        if (issueToEdit && isEditMode && open) {
            loadIssueForEditing(issueToEdit).then();
        }
    }, [issueToEdit, isEditMode, open]);

    const handleDoseChange = (value: string) => {
        // Check for empty input first
        if (value === "") {
            setDose(null);
            return;
        }

        // Then handle numeric input
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && numValue >= 0) {
            setDose(numValue);
        }
    };

    const handleForDaysChange = (value: string) => {
        // Check for empty input first
        if (value === "") {
            setForDays(null);
            return;
        }

        // Then handle numeric input
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && numValue >= 0) {
            setForDays(numValue);
        }
    };

    const handleTimesChange = (value: string) => {
        // Check for empty input first
        if (value === "") {
            setTimes(null);
            return;
        }

        // Then handle numeric input
        const numValue = parseInt(value);
        if (!isNaN(numValue) && numValue >= 0) {
            setTimes(numValue);
        }
    };

    const resetStrategy = () => {
        setStrategy(null);
        setDose(null);
        setForDays(null);
        setMealTiming(null);
        setDetails("");
        setTimes(null);
    }

    const resetForm = () => {
        setSelectedDrug(null);
        setSelectedConcentration(null);
        setSelectedBrand(null);
        setSelectedType(null);
        setTypes([]);
        setConcentrations([]);
        setBrands([]);
        resetStrategy();
        setError(null);
        setWarning(null);
        setIsTopical(false);
        setDirectQuantity(null);
    };

    const showWarnings = (item: ConcentrationOption | BrandOption) => {
        const expiry = item.farthestExpiry;
        const remainingQuantity = item.totalRemainingQuantity;
        const daysUntilExpiry = differenceInDays(new Date(expiry), new Date());

        if (daysUntilExpiry < 120 && remainingQuantity < 150) {
            setWarning(`Warning: Expiry in ${daysUntilExpiry} days (${expiry}) and stock is ${remainingQuantity} units`);
        } else if (daysUntilExpiry < 120) {
            setWarning(`Warning: Expiry in ${daysUntilExpiry} days (${expiry})`);
        } else if (remainingQuantity < 150) {
            setWarning(`Warning: Current stock is ${remainingQuantity} units`);
        } else {
            setWarning(null);
        }
    };

    const handleDrugSearch = useDebouncedCallback(async (term: string) => {
        setIsDrugSearching(true);
        try {
            const drugs = await searchAvailableDrugs(term);
            setDrugs(drugs);
        } catch (error) {
            setError("Error searching drugs");
            console.error(error);
        } finally {
            setIsDrugSearching(false);
        }
    }, 700);

    const handleDrugSelect = async (selected: DrugOption) => {
        if (!selected || selectedDrug?.id === selected.id) return;

        setError(null);
        setWarning(null);

        // Reset selections related to drug change
        setSelectedConcentration(null);
        setSelectedType(null);
        setSelectedBrand(null);
        resetStrategy();

        // Create a reference for the toast ID
        const toastId = toast.loading("Fetching drug data...", {
            position: "bottom-right",
            pauseOnFocusLoss: false,
            closeButton: true,
        });

        try {
            // Set initial states
            setSelectedDrug(selected);
            setIsBrandSearching(true);
            setIsConcentrationSearching(true);
            setIsTypeSearching(true);
            setCacheFetching(true);

            // Update toast with progress 15%
            toast.update(toastId, {
                render: "Fetching cached strategy and types...",
                type: "info",
                isLoading: true,
                progress: 0.15
            });

            // Fetch cached strategy & types
            const [cachedStrategy, types] = await Promise.all([
                getCachedStrategy(selected.id),
                getDrugTypesByDrug(selected.id),
            ]);

            if (!types.length) {
                setError("No types found for this drug");
                toast.update(toastId, {
                    render: "No types found for this drug",
                    type: "error",
                    isLoading: false,
                    progress: 1,
                });
                return;
            }

            setTypes(types);

            // Update toast with progress 30%
            toast.update(toastId, {
                render: "Validating cached strategy & type...",
                isLoading: true,
                type: "info",
                progress: 0.3
            });

            // Validate cached strategy & type
            const selectedDrugType = types.find(type => cachedStrategy?.issue.type === type.name) || null;
            setSelectedType(selectedDrugType);

            if (!selectedDrugType) {
                toast.update(toastId, {
                    render: "Cached type invalid. Please select manually.",
                    type: "warning",
                    progress: 1,
                    isLoading: false,
                });
                return;
            }

            // Update toast with progress 45%
            toast.update(toastId, {
                render: "Fetching concentrations...",
                type: "info",
                isLoading: true,
                progress: 0.45
            });

            // Fetch concentrations
            const concentrations = await getConcentrationByDrug({
                drugID: selected.id,
                type: selectedDrugType.type,
            });

            setConcentrations(concentrations);

            const cachedConcentration = concentrations.find(c => c.id === cachedStrategy?.issue.unitConcentrationId) || null;

            if (!cachedConcentration) {
                console.warn("Cached concentration is invalid");
                toast.update(toastId, {
                    render: "Cached concentration invalid. Please select manually.",
                    type: "warning",
                    isLoading: false,
                    progress: 1,
                });
                return;
            }

            setSelectedConcentration(cachedConcentration);
            showWarnings(cachedConcentration);

            // Update toast with progress 60%
            toast.update(toastId, {
                render: "Fetching brands...",
                isLoading: true,
                type: "info",
                progress: 0.6
            });

            // Fetch brands
            const drugBrands = await getBrandByDrugConcentrationType({
                drugID: selected.id,
                concentrationID: cachedConcentration.id,
                type: selectedDrugType.type,
            });

            setBrands(drugBrands);
            await handleCachedBrandStrategy(drugBrands, cachedStrategy, toastId);

            // Complete the progress bar and show success
            toast.update(toastId, {
                render: "Drug selection complete!",
                type: "success",
                isLoading: false,
                progress: 1,
            });
        } catch (error) {
            console.error("Error in handleDrugSelect:", error);
            setError("Error fetching drug data");
            toast.update(toastId, {
                render: "Error fetching drug data",
                type: "error",
                isLoading: false,
                progress: 1,
            });
        } finally {
            setIsBrandSearching(false);
            setIsConcentrationSearching(false);
            setIsTypeSearching(false);
            setCacheFetching(false);
        }
    };


    // Helper function to handle cached brand strategy
    // Helper function to handle cached brand strategy
    const handleCachedBrandStrategy = async (
        drugBrands: BrandOption[],
        cachedStrategy: CachedStrategy,
        toastID: Id
    ) => {
        if (!cachedStrategy) return;

        const availableBrandIDs = drugBrands.map(brand => brand.id);
        if (!availableBrandIDs.includes(cachedStrategy.issue.brandId)) {
            // Reset strategy-related states if cached brand is not available
            toast.update(toastID, {
                render: "Cached brand not available. Please select manually.",
                type: "warning",
                isLoading: false,
                progress: 0.85,
            });

            setStrategy(null);
            setDose(null);
            setForDays(null);
            setMealTiming(null);
            setDetails("");
            setTimes(null);
            setSelectedBrand(null);
            return;
        }

        const {issue} = cachedStrategy;
        const selectedBrand_local = drugBrands.find(b => b.id === issue.brandId) || null;

        toast.update(toastID, {
            render: "Applying cached brand",
            isLoading: true,
            type: "info",
            progress: 0.75
        });
        // Set brand information
        setSelectedBrand(selectedBrand_local);

        // Set issue details
        toast.update(toastID, {
            render: "Applying cached strategy",
            isLoading: true,
            type: "info",
            progress: 0.75
        });

        setStrategy(issue.strategy);
        setMealTiming(issue.meal);
        setDetails(issue.details || "");

        // Determine if this is a topical medication based on dose
        const isTopicalMedication = issue.dose === null;
        setIsTopical(isTopicalMedication);

        if (isTopicalMedication) {
            // For topical medications, set direct quantity
            setDirectQuantity(issue.quantity);
            setDose(null);
            setForDays(null);
            setTimes(null);
        } else {
            // For standard medications with dosage
            setDose(issue.dose);
            setDirectQuantity(null);

            // Handle OTHER strategy specific logic
            if (issue.strategy === IssuingStrategy.OTHER || issue.strategy === IssuingStrategy.SOS || issue.strategy === IssuingStrategy.WEEKLY) {
                const {quantity, dose} = issue;
                if (dose !== null) {
                    setTimes(calculateTimes({
                        strategy: issue.strategy,
                        dose: dose,
                        quantity: quantity
                    }));
                }
            } else {
                if (issue.dose !== null) {
                    setForDays(calculateForDays({
                        strategy: issue.strategy,
                        dose: issue.dose,
                        quantity: issue.quantity
                    }));
                }
            }
        }

        // Show warnings if applicable
        if (selectedBrand_local) {
            showWarnings(selectedBrand_local);
        }

        toast.update(toastID, {
            render: "Cached strategy applied",
            isLoading: false,
            type: "info",
            progress: 0.95,
        });
    };

    const handleTypeSelect = async (type: CustomDrugType) => {
        if (selectedType === type || !selectedDrug || !type) return;
        setError(null);
        setWarning(null);

        setSelectedConcentration(null);
        setSelectedBrand(null);
        resetStrategy();
        try {
            setSelectedType(type);
            setIsBrandSearching(true);
            setIsConcentrationSearching(true);

            // Reset previous selections
            setSelectedConcentration(null);
            setSelectedBrand(null);
            setBrands([]);
            setConcentrations([]);

            // For tablets, first fetch concentrations
            const concentrations = await getConcentrationByDrug({
                drugID: selectedDrug.id,
                type: type.type,
            });

            setConcentrations(concentrations);
            setIsConcentrationSearching(false);
        } catch (error) {
            console.error('Error in handleTypeSelect:', error);
            setError(error instanceof Error ? error.message : "Error fetching drug data");

            // Reset states on error
            setBrands([]);
            setConcentrations([]);
            setSelectedConcentration(null);
            setSelectedBrand(null);
        } finally {
            setIsBrandSearching(false);
            setIsConcentrationSearching(false);
        }
    };

    const handleConcentrationSelect = async (selected: ConcentrationOption) => {
        if (selectedConcentration === selected) return;
        setError(null);
        setWarning(null);
        setSelectedBrand(null);
        resetStrategy();
        setSelectedConcentration(selected);
        if (!selectedDrug || !selectedType || !selected) return;
        showWarnings(selected);
        try {
            setIsBrandSearching(true);
            const drugBrands = await getBrandByDrugConcentrationType({
                drugID: selectedDrug.id,
                concentrationID: selected.id,
                type: selectedType.type,
            });
            setBrands(drugBrands);
        } catch (error) {
            console.error(error);
            setError("Error fetching brands");
        } finally {
            setIsBrandSearching(false);
        }

    };

    const handleBrandSelect = (selected: BrandOption) => {
        if (selectedBrand === selected) return;
        setError(null);
        setWarning(null);
        resetStrategy();
        setSelectedBrand(selected);
        if (!selected || !selectedConcentration || !selectedDrug || !selectedType) return;
        showWarnings(selected);
    };

    const handleAddIssue = () => {
        try {
            if (!selectedDrug || !selectedConcentration || !selectedBrand || !strategy || !selectedType) {
                const missingFields = [
                    !selectedDrug && "Drug",
                    !selectedConcentration && "Concentration",
                    !selectedBrand && "Brand",
                    !strategy && "Strategy",
                ].filter(Boolean);

                setError(`Missing fields: ${missingFields.join(", ")}`);
                return;
            }

            if (isTopical) {
                if (!directQuantity) {
                    setError("Missing fields: Quantity");
                    return;
                }
            } else {
                if (!dose) {
                    setError("Missing fields: Dose");
                    return;
                }

                if (strategy === IssuingStrategy.OTHER || strategy === IssuingStrategy.SOS || strategy === IssuingStrategy.WEEKLY) {
                    if (!times) {
                        setError("Missing fields: Times");
                        return;
                    }
                } else {
                    if (!forDays) {
                        setError("Missing fields: For Days");
                        return;
                    }
                }
            }

            const calculatedQuantity = isTopical
                ? directQuantity || 0
                : calculateQuantity({
                    dose: dose || 0,
                    strategy,
                    forDays: forDays || 0,
                    times: times || 0
                });

            if (calculatedQuantity <= 0) {
                setError("Invalid quantity");
                return;
            } else if (calculatedQuantity > selectedBrand.totalRemainingQuantity) {
                setError(`Required quantity(${calculatedQuantity}) exceeds available stock(${selectedBrand.totalRemainingQuantity})`);
                return;
            }

            const newIssue: IssueInForm = {
                strategy,
                dose: isTopical ? null : dose,
                meal: mealTiming,
                forDays: isTopical ? null : forDays,
                forTimes: isTopical ? null : times,
                details,
                brandId: selectedBrand.id,
                brandName: selectedBrand.name,
                quantity: Number(calculatedQuantity.toFixed(2)),
                drugName: selectedDrug.name,
                drugId: selectedDrug.id,
                concentration: selectedConcentration.concentration,
                drugType: selectedType.type,
                concentrationID: selectedConcentration.id,
            };

            if (isEditMode && issueToEdit && onUpdateIssue) {
                onUpdateIssue(newIssue, issueToEdit);
            } else {
                onAddIssue(newIssue);
            }

            setOpen(false);
            resetForm();
        } catch (error) {
            console.error("Error in handleAddIssue:", error);
            setError("Error adding issue");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {isEditMode ? (
                    <Button
                        variant="outline"
                        className="px-3 text-amber-600 border-amber-300 hover:bg-amber-50"
                    >
                        <Pencil className="h-4 w-4 mr-1"/>
                        Edit
                    </Button>
                ) : (
                    <Card
                        className="border-dashed border-2 p-4 flex justify-center items-center cursor-pointer hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 group">
                        <div className="flex items-center space-x-2 text-slate-500 group-hover:text-slate-800">
                            <Plus className="h-5 w-5 transition-transform duration-200 group-hover:scale-110"/>
                            <span className="font-medium">Issue from Inventory</span>
                        </div>
                    </Card>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-5xl overflow-y-auto max-h-screen overflow-x-visible">
                <DialogHeader>
                    <DialogTitle>Add Issue</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-4">
                        <DrugCombobox
                            options={drugs}
                            onChange={(drug) => handleDrugSelect(drug)}
                            onSearch={handleDrugSearch}
                            isSearching={isDrugSearching}
                            value={selectedDrug}
                            placeholder="Select drug"
                            searchPlaceholder="Search drug"
                            noOptionsMessage="No drugs found"
                            disabled={cacheFetching}
                        />
                        <div className={'flex gap-4'}>
                            <DrugTypeComboBox
                                options={types}
                                onChange={(type) => handleTypeSelect(type)}
                                value={selectedType}
                                placeholder={'Select a type'}
                                noOptionsMessage={'No types'}
                                disabled={!selectedDrug || cacheFetching}
                                isSearching={isTypeSearching}
                            />
                            <ConcentrationComboBox
                                options={concentrations}
                                onChange={(concentration) => handleConcentrationSelect(concentration)}
                                isSearching={isConcentrationSearching}
                                value={selectedConcentration}
                                placeholder="Select concentration"
                                noOptionsMessage="No concentrations found"
                                searchPlaceholder="Search concentrations"
                                disabled={!selectedType || cacheFetching}
                            />
                        </div>
                        <BrandCombobox
                            options={brands}
                            onChange={(id) => handleBrandSelect(id)}
                            isSearching={isBrandSearching}
                            value={selectedBrand}
                            placeholder="Select brand"
                            searchPlaceholder="Search brand"
                            noOptionsMessage="No brands found"
                            disabled={!selectedType || cacheFetching}
                        />
                    </div>

                    <div className={'flex flex-col gap-2 animate-fade-in'}>
                        {warning && (
                            <span
                                className="text-yellow-500 text-sm flex items-center"
                                aria-live="polite"
                                role="status"
                            >
                                <TriangleAlert className="mr-1" aria-hidden="true" size={18}/>
                                {warning}
                            </span>
                        )}
                        {error && (
                            <span
                                className="text-red-500 text-sm flex items-center mt-2"
                                role="alert"
                            >
                                <CircleAlert className="mr-1" aria-hidden="true" size={18}/>
                                {error}
                            </span>
                        )}
                    </div>


                    <MedicationStrategyTabs
                        selectedStrategy={{
                            selectedStrategy: strategy,
                            setSelectedStrategy: setStrategy
                        }}
                        disabled={!selectedDrug || !selectedConcentration || !selectedBrand || !selectedType || cacheFetching}
                    />

                    <div className="flex justify-end">
                        <button
                            onClick={resetStrategy}
                            className="text-red-400 cursor-pointer text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-2 py-1"
                            aria-label="Clear strategy"
                        >
                            Clear Strategy
                        </button>
                    </div>

                    {/* Dosage & Duration Card */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Dosage & Duration Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <ClipboardCheck className="h-6 w-6 text-blue-500"/>
                                        <span>Dosage & Duration</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Label htmlFor="medicationType" className="text-sm">
                                            {isTopical ? "Topical" : "Standard"}
                                        </Label>
                                        <Switch
                                            id="medicationType"
                                            checked={isTopical}
                                            onCheckedChange={setIsTopical}
                                            disabled={!strategy || cacheFetching}
                                        />
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-4 animate-fade-in" key={`${strategy}-${isTopical}`}>
                                    {isTopical ? (
                                        <div className="space-y-2">
                                            <Label htmlFor="directQuantity">Quantity</Label>
                                            <Input
                                                id="directQuantity"
                                                type="number"
                                                min="0"
                                                step="1"
                                                value={directQuantity || ""}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (value === "") {
                                                        setDirectQuantity(null);
                                                    } else {
                                                        const numValue = parseFloat(value);
                                                        if (!isNaN(numValue) && numValue >= 0) {
                                                            setDirectQuantity(numValue);
                                                        }
                                                    }
                                                }}
                                                placeholder="Enter quantity"
                                                disabled={!strategy || cacheFetching}
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <div className="space-y-2">
                                                <Label htmlFor="dose">Dosage</Label>
                                                <Input
                                                    id="dose"
                                                    type="number"
                                                    min="0"
                                                    step="0.5"
                                                    value={dose || ""}
                                                    onChange={(e) => handleDoseChange(e.target.value)}
                                                    placeholder="Enter dosage"
                                                    disabled={!strategy || cacheFetching}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                {strategy && strategy !== IssuingStrategy.SOS && strategy !== IssuingStrategy.OTHER && strategy !== IssuingStrategy.WEEKLY ? (
                                                    <>
                                                        <Label htmlFor="forDays">For Days</Label>
                                                        <Input
                                                            id="forDays"
                                                            type="number"
                                                            min="0"
                                                            value={forDays || ""}
                                                            onChange={(e) => handleForDaysChange(e.target.value)}
                                                            placeholder="Enter number of days"
                                                            disabled={!strategy || cacheFetching}
                                                        />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Label htmlFor="times">For Times</Label>
                                                        <Input
                                                            id="times"
                                                            type="number"
                                                            min="0"
                                                            value={times || ""}
                                                            onChange={(e) => handleTimesChange(e.target.value)}
                                                            placeholder="Enter number of times"
                                                            disabled={!strategy || cacheFetching}
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Meal Timing Card */}
                        <Card className={'flex flex-col'}>
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center">
                                    <div className="flex items-center space-x-2">
                                        <Utensils className="h-6 w-6 text-green-500"/>
                                        <span>Meal Timing</span>
                                    </div>
                                    <Switch
                                        checked={mealTiming !== null}
                                        onCheckedChange={(checked) => setMealTiming(checked ? MEAL.BEFORE : null)}
                                        disabled={!strategy || cacheFetching}
                                    />
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex items-center justify-center h-full">
                                {mealTiming !== null ? (
                                    <RadioGroup
                                        value={mealTiming || ""}
                                        onValueChange={(value) => setMealTiming(value as MEAL)}
                                        className="space-y-3 w-full animate-fade-in"
                                        disabled={!strategy || cacheFetching}
                                    >
                                        {[
                                            {value: MEAL.BEFORE, label: "Before Meal"},
                                            {value: MEAL.WITH, label: "With Meal"},
                                            {value: MEAL.AFTER, label: "After Meal"},
                                        ].map(({value, label}) => (
                                            <div
                                                key={value}
                                                className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-100 transition cursor-pointer"
                                                onClick={() => setMealTiming(value)} // Make the card clickable
                                            >
                                                <RadioGroupItem value={value} id={value}/>
                                                <Label htmlFor={value} className="cursor-pointer">{label}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                ) : (
                                    <p className="text-gray-500 text-sm animate-fade-in">Enable meal timing to
                                        choose an
                                        option</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>


                    <Textarea
                        placeholder="Additional Details"
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        disabled={cacheFetching || !strategy}
                    />
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setOpen(false);
                            resetForm();
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddIssue}
                        disabled={
                            !selectedDrug ||
                            !selectedConcentration ||
                            !selectedBrand ||
                            !strategy ||
                            (isTopical ? !directQuantity : !dose)
                        }
                    >
                        {isEditMode ? "Update" : "Add"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default IssueFromInventory;