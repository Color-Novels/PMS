import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, AlertCircle, Check, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InventoryFormData } from "@/app/lib/definitions";
import { format } from "date-fns";
import { DrugType } from "@prisma/client";

interface DrugConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: InventoryFormData;
  onConfirm: () => void;
  onBack: () => void;
}

export function DrugConfirmationDialog({
  open,
  onOpenChange,
  formData,
  onConfirm,
  onBack,
}: DrugConfirmationDialogProps) {
  const [confirmEnabled, setConfirmEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setConfirmEnabled(true);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setConfirmEnabled(false);
      setLoading(false);
    }
  }, [open]);

  const handleConfirm = () => {
    setLoading(true);
    onConfirm();
  };

  // Format the expiry date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not specified";
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (e) {
      console.error(e);
      return dateString;
    }
  };

  const getReadableDrugType = (type: DrugType) => {
    return type
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary-600 text-center flex items-center justify-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Confirm Drug Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert className="bg-amber-50 border-amber-200">
            <AlertDescription className="text-amber-700">
              Please verify all details below before adding this drug to
              inventory
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            <div className="col-span-2 bg-blue-50 p-3 rounded-md">
              <h3 className="font-medium text-blue-800 mb-2">
                Drug Information
              </h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <p className="text-xs text-gray-500">Brand Name</p>
                  <p className="font-medium">
                    {formData.brandName || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Drug Name</p>
                  <p className="font-medium">
                    {formData.drugName || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Type</p>
                  <p className="font-medium">
                    {getReadableDrugType(formData.drugType)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Concentration</p>
                  <p className="font-medium">
                    {formData.concentration || "Not specified"}
                  </p>
                </div>
              </div>
            </div>

            <div className="col-span-2 bg-green-50 p-3 rounded-md">
              <h3 className="font-medium text-green-800 mb-2">Stock Details</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <p className="text-xs text-gray-500">Batch Number</p>
                  <p className="font-medium">
                    {formData.batchNumber || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Quantity</p>
                  <p className="font-medium">
                    {formData.quantity || "0"} units
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Buffer Amount</p>
                  <p className="font-medium">{formData.Buffer || "0"} units</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Expiry Date</p>
                  <p className="font-medium">{formatDate(formData.expiry)}</p>
                </div>
              </div>
            </div>

            <div className="col-span-2 bg-purple-50 p-3 rounded-md">
              <h3 className="font-medium text-purple-800 mb-2">
                Price Information
              </h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <p className="text-xs text-gray-500">Wholesale Price</p>
                  <p className="font-medium">
                    Rs {formData.wholesalePrice || "0"}/unit
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Retail Price</p>
                  <p className="font-medium">
                    Rs {formData.retailPrice || "0"}/unit
                  </p>
                </div>
              </div>
            </div>

            <div className="col-span-2 bg-amber-50 p-3 rounded-md">
              <h3 className="font-medium text-amber-800 mb-2">
                Supplier Details
              </h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <p className="text-xs text-gray-500">Supplier Name</p>
                  <p className="font-medium">
                    {formData.supplierName || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Contact</p>
                  <p className="font-medium">
                    {formData.supplierContact || "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between space-x-2">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1"
            disabled={loading}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={handleConfirm}
            className={`flex-1 relative ${
              confirmEnabled
                ? "bg-primary-500 hover:bg-primary-600"
                : "bg-gray-400"
            }`}
            disabled={!confirmEnabled || loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Confirm
              </>
            )}
            {!confirmEnabled && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10 rounded">
                <span className="text-xs text-gray-800">Reading time...</span>
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
