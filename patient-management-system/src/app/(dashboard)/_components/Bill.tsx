import React from "react";
import { Bill } from "@/app/lib/definitions";
import { Card } from "@/components/ui/card";
import {
    BriefcaseMedical,
    CreditCard,
    Percent,
    Tag,
    ClipboardList,
} from "lucide-react";
import { getFinalBillSummary } from "@/app/lib/utils";

export function BillComponent({ bill }: { bill: Bill | null }) {
    if (!bill) return null;
    const { subtotal, total: finalTotal, chargesByType, percentageCharges, discountCharges } = getFinalBillSummary(bill);
    
    return (
        <Card className="p-6">
            <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                    💰 Bill Summary
                </h2>
                <div className="text-right">
                    <div className="text-sm text-gray-500">
                        Prescription #{bill.prescriptionID}
                    </div>
                    <div className="font-medium">{bill.patientName}</div>
                    <div className="text-xs text-gray-500">
                        Patient ID: {bill.patientID}
                    </div>
                </div>
            </div>

            {/* Medicine entries */}
            {bill.entries.length > 0 && (
                <>
                    <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                        <BriefcaseMedical className="w-4 h-4 mr-2 text-gray-500" />
                        Medications
                    </h3>
                    <div className="space-y-3 mb-4">
                        {bill.entries.map((entry, index) => (
                            <div
                                key={index}
                                className="border-b pb-2 last:border-none"
                            >
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-700">
                                        {entry.drugName} ({entry.brandName})
                                    </span>
                                    <span className="text-gray-500">
                                        LKR {entry.unitPrice.toFixed(2)} ×{" "}
                                        {entry.quantity}
                                    </span>
                                </div>
                                <div className="text-right font-semibold text-gray-900">
                                    LKR{" "}
                                    {(entry.unitPrice * entry.quantity).toFixed(
                                        2
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Charges by type with proper icons */}
            <div className="mt-4 border-t pt-4 text-sm space-y-3">
                {/* Medicine charge from charges array */}
                {chargesByType["MEDICINE"]?.map((charge, index) => (
                    <div
                        key={`medicine-${index}`}
                        className="flex justify-between"
                    >
                        <span className="text-gray-600 flex items-center">
                            <BriefcaseMedical className="w-4 h-4 mr-2 text-gray-500" />
                            {charge.name || "Medicine Cost"}:
                            {charge.description && (
                                <span className="text-xs text-gray-400 ml-1">
                                    ({charge.description})
                                </span>
                            )}
                        </span>
                        <span className="font-medium text-gray-900">
                            LKR {charge.value.toFixed(2)}
                        </span>
                    </div>
                ))}

                {/* Procedure charges */}
                {chargesByType["PROCEDURE"]?.map((charge, index) => (
                    <div
                        key={`procedure-${index}`}
                        className="flex justify-between"
                    >
                        <span className="text-gray-600 flex items-center">
                            <ClipboardList className="w-4 h-4 mr-2 text-purple-500" />
                            {charge.name}:
                            {charge.description && (
                                <span className="text-xs text-gray-400 ml-1">
                                    ({charge.description})
                                </span>
                            )}
                        </span>
                        <span className="font-medium text-gray-900">
                            LKR {charge.value.toFixed(2)}
                        </span>
                    </div>
                ))}

                {/* Fixed charges */}
                {chargesByType["FIXED"]?.map((charge, index) => (
                    <div
                        key={`fixed-${index}`}
                        className="flex justify-between"
                    >
                        <span className="text-gray-600 flex items-center">
                            <CreditCard className="w-4 h-4 mr-2 text-blue-500" />
                            {charge.name}:
                            {charge.description && (
                                <span className="text-xs text-gray-400 ml-1">
                                    ({charge.description})
                                </span>
                            )}
                        </span>
                        <span className="font-medium text-gray-900">
                            LKR {charge.value.toFixed(2)}
                        </span>
                    </div>
                ))}

                {/* Subtotal */}
                <div className="flex justify-between font-semibold text-gray-900 border-t pt-2">
                    <span>Subtotal:</span>
                    <span>LKR {subtotal.toFixed(2)}</span>
                </div>

                {/* Percentage charges */}
                {percentageCharges.map((charge, index) => (
                    <div
                        key={`percentage-${index}`}
                        className="flex justify-between text-gray-600"
                    >
                        <span className="flex items-center">
                            <Percent className="w-4 h-4 mr-2 text-green-500" />
                            {charge.name} ({charge.value}%):
                            {charge.description && (
                                <span className="text-xs text-gray-400 ml-1">
                                    ({charge.description})
                                </span>
                            )}
                        </span>
                        <span className="font-medium text-gray-700">
                            + LKR {charge.calculatedValue.toFixed(2)}
                        </span>
                    </div>
                ))}

                {/* Discounts */}
                {discountCharges.map((charge, index) => (
                    <div
                        key={`discount-${index}`}
                        className="flex justify-between text-pink-600"
                    >
                        <span className="flex items-center">
                            <Tag className="w-4 h-4 mr-2 text-amber-500" />
                            {charge.name} ({charge.value}%):
                            {charge.description && (
                                <span className="text-xs text-gray-400 ml-1">
                                    ({charge.description})
                                </span>
                            )}
                        </span>
                        <span>- LKR {charge.calculatedValue.toFixed(2)}</span>
                    </div>
                ))}

                {/* Final total */}
                <div className="flex justify-between text-lg font-bold text-green-600 mt-2 border-t pt-2">
                    <span>💵 Total:</span>
                    <span>LKR {finalTotal.toFixed(2)}</span>
                </div>
            </div>
        </Card>
    );
}
