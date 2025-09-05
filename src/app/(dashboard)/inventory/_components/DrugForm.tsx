"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  addNewItem,
  getDrugConcentrations,
  searchDrugBrands,
  searchDrugModels,
  searchSuppliers,
} from "@/app/lib/actions";
import { Plus } from "lucide-react";
import { handleServerAction } from "@/app/lib/utils";
import {
  DrugBrandSuggestion,
  DrugConcentrationDataSuggestion,
  DrugModelSuggestion,
  InventoryFormData,
  SupplierSuggestion,
} from "@/app/lib/definitions";
import { DrugSuggestionBox } from "@/app/(dashboard)/inventory/_components/DrugSuggestionBox";
import { DrugConcentrationField } from "@/app/(dashboard)/inventory/_components/AddWeightField";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CustomDrugTypeSelect from "@/app/(dashboard)/inventory/available-stocks/_components/CustomDrugTypeSelect";
import { SupplierSuggestionBox } from "@/app/(dashboard)/inventory/_components/SupplierSuggestionBox";
import { DrugConfirmationDialog } from "@/app/(dashboard)/inventory/_components/DrugFormConfirmation";
import { DrugType } from "@prisma/client";

export function DrugForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState<InventoryFormData>({
    brandName: "",
    drugName: "",
    batchNumber: "",
    drugType: DrugType.TABLET,
    packSize: "",
    quantity: "1",
    expiry: "",
    retailPrice: "",
    wholesalePrice: "",
    concentration: 0,
    Buffer: 0,
    supplierName: "",
    supplierContact: "",
  });

  // Add state to store complete buffer levels data
  const [drugBufferLevels, setDrugBufferLevels] = useState<
    Array<{
      id: number;
      drugId: number;
      drugType: DrugType;
      concentrationId: number;
      bufferAmount: number;
    }>
  >([]);

  const [brandSuggestions, setBrandSuggestions] = useState<
    DrugBrandSuggestion[]
  >([]);
  const [drugSuggestions, setDrugSuggestions] = useState<DrugModelSuggestion[]>(
    []
  );
  const [supplierSuggestions, setSupplierSuggestions] = useState<
    SupplierSuggestion[]
  >([]);
  const [drugConcentrations, setDrugConcentrations] = useState<
    DrugConcentrationDataSuggestion[]
  >([]);
  const [showBrandSuggestions, setShowBrandSuggestions] = useState(false);
  const [showDrugSuggestions, setShowDrugSuggestions] = useState(false);
  const [showSupplierSuggestions, setShowSupplierSuggestions] = useState(false);

  // Function to update buffer based on selected criteria
  const updateBufferBasedOnSelection = useCallback(() => {
    const drugId = formData.drugId;
    const drugType = formData.drugType;
    const concentrationId = formData.concentrationId;

    // Only proceed if all three criteria are selected
    if (!drugId || !drugType || !concentrationId) return;

    // Find the matching buffer level
    const matchingBufferLevel = drugBufferLevels.find(
      (buffer) =>
        buffer.drugId === drugId &&
        buffer.drugType === drugType &&
        buffer.concentrationId === concentrationId
    );

    // Update the buffer amount if a match is found
    if (matchingBufferLevel) {
      setFormData((prev) => ({
        ...prev,
        Buffer: matchingBufferLevel.bufferAmount,
      }));
    }
  }, [
    formData.drugId,
    formData.drugType,
    formData.concentrationId,
    drugBufferLevels,
  ]);

  // Call updateBuffer whenever any of the criteria changes
  useEffect(() => {
    updateBufferBasedOnSelection();
  }, [
    formData.drugId,
    formData.drugType,
    formData.concentrationId,
    updateBufferBasedOnSelection,
  ]);

  const handleConcentrationAdded = (
    newWeight: DrugConcentrationDataSuggestion
  ) => {
    setDrugConcentrations((prev) => {
      const exists = prev.some((w) => w.id === newWeight.id);
      if (exists) {
        // If the ID exists, update the concentration value
        return prev.map((w) =>
          w.id === newWeight.id
            ? { ...w, concentration: newWeight.concentration }
            : w
        );
      }
      // Otherwise, add the new weight
      return [...prev, newWeight];
    });

    // Update the form data with the new weight
    setFormData((prev) => ({
      ...prev,
      concentrationId: newWeight.id,
      concentration: newWeight.concentration,
    }));
  };

  const handleConcentrationDeleted = (
    deleteWeight: DrugConcentrationDataSuggestion
  ) => {
    // Delete the weight from the list
    setDrugConcentrations((prev) => {
      return prev.filter((w) => w.id !== deleteWeight.id);
    });

    // Update the form data if the deleted weight was selected
    if (formData.concentrationId === deleteWeight.id) {
      setFormData((prev) => ({
        ...prev,
        concentrationId: undefined,
        concentration: 0,
      }));
    }
  };

  const handleConcentrationChange = (newID: number) => {
    console.log(newID);
    setFormData((prev) => {
      const selectedWeight = drugConcentrations.find(
        (weight) => weight.id === newID
      );
      console.log(selectedWeight);
      return {
        ...prev,
        concentrationId: newID,
        concentration: selectedWeight ? selectedWeight.concentration : 0,
      };
    });
    // Buffer will be updated by the useEffect when all criteria are met
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updatedValue = e.target.type === "number" ? Number(value) : value;
    setFormData((prev) => {
      if (name === "weightId") {
        // Find the selected weight object from the drugWeights array
        const selectedWeight = drugConcentrations.find(
          (weight) => weight.id === Number(value)
        );

        return {
          ...prev,
          weightId: Number(value),
          weight: selectedWeight ? selectedWeight.concentration : 0, // Update the weight value
        };
      }

      return { ...prev, [name]: updatedValue };
    });

    if (name === "brandName") {
      if (value.length >= 2) {
        handleBrandSearch(value).then();
        setShowBrandSuggestions(true);
      } else {
        setBrandSuggestions([]);
        setShowBrandSuggestions(false);
      }
    } else if (name === "drugName") {
      if (value.length >= 2) {
        handleDrugSearch(value).then();
        setShowDrugSuggestions(true);
      } else {
        setDrugSuggestions([]);
        setShowDrugSuggestions(false);
      }
    } else if (name === "supplierName") {
      if (value.length >= 2) {
        handleSupplierSearch(value).then();
        setShowSupplierSuggestions(true);
      } else {
        setSupplierSuggestions([]);
        setShowSupplierSuggestions(false);
      }
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    // If only year and month are selected (YYYY-MM format)
    if (value && value.match(/^\d{4}-\d{2}$/)) {
      // Auto-append the first day of the month
      const fullDate = `${value}-01`;

      setFormData((prev) => ({
        ...prev,
        expiry: fullDate,
      }));
    } else {
      // Regular date input handling
      setFormData((prev) => ({
        ...prev,
        expiry: value,
        name: "expiry",
      }));
    }
  };

  const handleSupplierSearch = async (query: string) => {
    try {
      const results = await searchSuppliers(query);
      setSupplierSuggestions(results);
    } catch (error) {
      console.error("Error searching suppliers:", error);
      setSupplierSuggestions([]);
    }
  };

  const handleSupplierSelect = (suggestion: SupplierSuggestion) => {
    setFormData((prev) => ({
      ...prev,
      supplierId: suggestion.id,
      supplierName: suggestion.name,
      supplierContact: suggestion.contact || "",
    }));
    setShowSupplierSuggestions(false);
  };

  const fetchDrugWeights = useCallback(async () => {
    if (!formData.drugId || !formData.drugType) return;

    try {
      const weights = await getDrugConcentrations(
        formData.drugId,
        formData.drugType
      );
      const uniqueWeights = Array.from(
        new Map(weights.map((weight) => [weight.id, weight])).values()
      );
      setDrugConcentrations(uniqueWeights);
    } catch (error) {
      console.error("Error fetching drug weights:", error);
      setDrugConcentrations([]);
    }
  }, [formData.drugId, formData.drugType]); // Dependencies ensure this function updates when drugId changes

  // Fetch when drugId changes
  useEffect(() => {
    fetchDrugWeights().then();
  }, [fetchDrugWeights]); // Calls fetch when the function reference changes

  const handleBrandSearch = async (query: string) => {
    try {
      const results = await searchDrugBrands(query);
      setBrandSuggestions(results);
    } catch (error) {
      console.error("Error searching brands:", error);
      setBrandSuggestions([]);
    }
  };

  const handleDrugSearch = async (query: string) => {
    try {
      const results = await searchDrugModels(query);
      // Transform results to match DrugModelSuggestion type
      const transformedResults = results.map((result) => ({
        id: result.id,
        name: result.name,
        bufferLevels: result.bufferLevels, // Include bufferLevels if needed
      }));

      setDrugSuggestions(transformedResults);
    } catch (error) {
      console.error("Error searching drugs:", error);
      setDrugSuggestions([]);
    }
  };

  const handleBrandSelect = (suggestion: DrugBrandSuggestion) => {
    setFormData((prev) => ({
      ...prev,
      brandId: suggestion.id,
      brandName: suggestion.name,
    }));
    setShowBrandSuggestions(false);
  };

  const handleDrugSelect = (suggestion: DrugModelSuggestion) => {
    setFormData((prev) => ({
      ...prev,
      drugId: suggestion.id,
      drugName: suggestion.name,
      // Don't set Buffer immediately here
    }));

    // Store the complete bufferLevels data for later use
    setDrugBufferLevels(
      (suggestion.bufferLevels || []).map((buffer) => ({
        id: buffer.id,
        drugId: suggestion.id,
        drugType: buffer.type,
        concentrationId: buffer.unitConcentration.id,
        bufferAmount: buffer.bufferAmount,
      }))
    );

    setShowDrugSuggestions(false);
  };

  const handleFormPreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Show confirmation dialog instead of submitting directly
    setShowConfirmation(true);
  };

  const handleSubmit = async () => {
    try {
      const result = await handleServerAction(() => addNewItem({ formData }), {
        loadingMessage: "Adding new item...",
      });

      if (result.success) {
        // Close both dialogs
        setShowConfirmation(false);
        setIsOpen(false);

        // Reset form data
        setFormData({
          brandName: "",
          drugName: "",
          batchNumber: "",
          drugType: DrugType.TABLET,
          packSize: "",
          quantity: "1",
          expiry: "",
          wholesalePrice: "",
          retailPrice: "",
          concentration: 0,
          Buffer: 0,
          supplierName: "",
          supplierContact: "",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // Keep confirmation dialog open in case of error
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            className="bg-primary-500 hover:bg-primary-600 text-white"
            onClick={() => setIsOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" /> Add New Item
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-primary-600 text-center">
              Add New Drug
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormPreSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="brandName"
                className="block text-sm font-medium mb-1"
              >
                Brand Name
              </label>
              <Input
                id="brandName"
                value={formData.brandName}
                onChange={handleChange}
                required
                name="brandName"
                className={"h-8"}
                autoComplete="off"
              />
              <DrugSuggestionBox
                suggestions={brandSuggestions}
                visible={showBrandSuggestions}
                onSelect={handleBrandSelect}
              />
            </div>
            <div>
              <label
                htmlFor="drugName"
                className="block text-sm font-medium mb-1"
              >
                Drug Name
              </label>
              <Input
                id="drugName"
                value={formData.drugName}
                onChange={handleChange}
                required
                name="drugName"
                className={"h-8"}
                autoComplete="off"
              />
              <DrugSuggestionBox
                suggestions={drugSuggestions}
                visible={showDrugSuggestions}
                onSelect={handleDrugSelect}
              />
            </div>
            <div>
              <label
                htmlFor="Supplier Name"
                className="block text-sm font-medium mb-1"
              >
                Supplier
              </label>
              <Input
                id="supplierName"
                value={formData.supplierName}
                onChange={handleChange}
                required
                name="supplierName"
                className={"h-8"}
                autoComplete="off"
              />
              <SupplierSuggestionBox
                suggestions={supplierSuggestions}
                visible={showSupplierSuggestions}
                onSelect={handleSupplierSelect}
              />
            </div>
            <div>
              <label
                htmlFor="SupplierContact"
                className="block text-sm font-medium mb-1"
              >
                Supplier Contact
              </label>
              <Input
                id="supplierContact"
                value={formData.supplierContact}
                onChange={handleChange}
                required
                name="supplierContact"
                className={"h-8"}
                autoComplete={"off"}
              />
            </div>
            <div>
              <label
                htmlFor="drugType"
                className="block text-sm font-medium mb-1"
              >
                Drug Type
              </label>
              <CustomDrugTypeSelect
                value={formData.drugType}
                onValueChange={(value) =>
                  setFormData({ ...formData, drugType: value as DrugType })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="batchNumber"
                  className="block text-sm font-medium mb-1"
                >
                  Batch Number
                </label>
                <Input
                  id="batchNumber"
                  value={formData.batchNumber}
                  onChange={handleChange}
                  required
                  name="batchNumber"
                  className={"h-8"}
                  autoComplete={"off"}
                />
              </div>
              <DrugConcentrationField
                concentrations={drugConcentrations}
                drugId={formData.drugId}
                onChange={handleConcentrationChange}
                onConcentrationDeleted={handleConcentrationDeleted}
                onConcentrationAdded={handleConcentrationAdded}
                selectedConcentrationId={formData.concentrationId}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="packSize"
                  className="block text-sm font-medium mb-1"
                >
                  PackSize
                </label>
                <Input
                  id="packSize"
                  type="number"
                  value={formData.packSize}
                  onChange={handleChange}
                  required
                  name="packSize"
                  min="0"
                  className={"h-8 no-spinner"}
                />
              </div>
              <div>
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium mb-1"
                >
                  Quantity
                </label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  name="quantity"
                  min="1"
                  className={"h-8 no-spinner"}
                />
              </div>
              <div>
                <label
                  htmlFor="wholesalePrice"
                  className="block text-sm font-medium mb-1"
                >
                  Wholesale Price (Rate) / Pack
                </label>
                <Input
                  id="wholesalePrice"
                  type="number"
                  step="0.01"
                  value={formData.wholesalePrice}
                  onChange={handleChange}
                  required
                  name="wholesalePrice"
                  min="0"
                  className={"h-8 no-spinner"}
                  autoComplete={"off"}
                />
              </div>
              <div>
                <label
                  htmlFor="retailPrice"
                  className="block text-sm font-medium mb-1"
                >
                  Retail Price / Pack
                </label>
                <Input
                  id="retailPrice"
                  type="number"
                  step="0.01"
                  value={formData.retailPrice}
                  onChange={handleChange}
                  required
                  name="retailPrice"
                  min="0"
                  className={"h-8 no-spinner"}
                  autoComplete={"off"}
                />
              </div>
              <div>
                <label
                  htmlFor="Buffer"
                  className="block text-sm font-medium mb-1"
                >
                  Buffer(in units)
                </label>
                <Input
                  id="Buffer"
                  type="number"
                  step="0.01"
                  value={formData.Buffer}
                  onChange={handleChange}
                  required
                  name="Buffer"
                  min="0"
                  className={"h-8 no-spinner"}
                />
              </div>
              <div>
                <label
                  htmlFor="expiry"
                  className="block text-sm font-medium mb-1"
                >
                  Expiry Date
                </label>
                <Input
                  id="expiry"
                  // Use month type instead of date type
                  type="month"
                  value={formData.expiry ? formData.expiry.substring(0, 7) : ""}
                  onChange={handleExpiryChange}
                  required
                  name="expiry"
                  className={"h-8"}
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-primary-500 hover:bg-primary-600"
            >
              Review Details
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      {/* Confirmation Dialog */}
      <DrugConfirmationDialog
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        formData={formData}
        onConfirm={handleSubmit}
        onBack={() => setShowConfirmation(false)}
      />
    </>
  );
}
