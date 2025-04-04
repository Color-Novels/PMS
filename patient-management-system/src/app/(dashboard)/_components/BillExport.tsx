"use client";

import React from "react";
import {Bill, ChargeEntry} from "@/app/lib/definitions";
import jsPDF from "jspdf";
import {Dialog, DialogTrigger, DialogContent, DialogTitle} from "@/components/ui/dialog";
import {IoMdDownload} from "react-icons/io";
import {Button} from "@/components/ui/button";
import {ChargeType} from "@prisma/client";

export function BillExport({bill, trigger}: { bill: Bill | null; trigger: React.ReactNode }) {
    if (!bill) return null;

    const exportToPDF = () => {
        // Initialize PDF with A5 format
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a5"
        });

        // Define colors and styles
        const colors = {
            primary: [45, 55, 72],    // Slate gray
            secondary: [100, 116, 139], // Lighter gray
            accent: [34, 197, 94],    // Green
            blue: [59, 130, 246],     // Blue for fixed charges
            purple: [139, 92, 246],   // Purple for procedure charges
            green: [34, 197, 94],     // Green for percentage charges
            amber: [245, 158, 11],    // Amber for discounts
            divider: [229, 231, 235], // Light gray
            discount: [244, 63, 94]   // Pink for discount text
        };

        // Configure initial settings
        const pageWidth = pdf.internal.pageSize.width;
        const margin = 15;
        const contentWidth = pageWidth - (margin * 2);

        // Helper function for text alignment
        const centerText = (text: string) => {
            const textWidth = pdf.getTextWidth(text);
            return (pageWidth - textWidth) / 2;
        };

        let yPos = 10; // Starting position

        // Company Name
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(16);
        pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        pdf.text("Thoduwawa Medical Center", centerText("Thoduwawa Medical Center"), yPos);

        // Bill Information
        yPos += 10;
        pdf.setFontSize(12);
        pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);

        // Bill header with modern layout
        const billDate = new Date().toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });

        pdf.setFontSize(10);
        pdf.text(`Prescription No: ${bill.prescriptionID}`, margin, yPos);
        pdf.text(`Date: ${billDate}`, pageWidth - margin - pdf.getTextWidth(`Date: ${billDate}`), yPos);

        // Patient Information
        yPos += 5;
        pdf.setDrawColor(colors.divider[0], colors.divider[1], colors.divider[2]);
        pdf.setLineWidth(0.1);
        pdf.line(margin, yPos, pageWidth - margin, yPos);

        yPos += 7;
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.text("Patient Details", margin, yPos);

        yPos += 7;
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.text(bill.patientName, margin, yPos);
        pdf.text(`Patient ID: ${bill.patientID}`, margin, yPos + 5);

        // Group charges by type
        const chargesByType = bill.charges.reduce((acc, charge) => {
            if (!acc[charge.type]) {
                acc[charge.type] = [];
            }
            acc[charge.type].push(charge);
            return acc;
        }, {} as Record<ChargeType, ChargeEntry[]>);

        // Calculate medicine charge
        const medicineCharge = chargesByType["MEDICINE"]?.[0]?.value ||
            bill.entries.reduce((sum, entry) => sum + entry.unitPrice * entry.quantity, 0);

        // Calculate charges by type
        const calculateChargeTotal = (type: ChargeType) => {
            if (!chargesByType[type]) return 0;
            return chargesByType[type].reduce((sum, charge) => sum + charge.value, 0);
        };

        // Calculate various subtotals
        const fixedCharges = calculateChargeTotal("FIXED");
        const procedureCharges = calculateChargeTotal("PROCEDURE");
        const subtotal = medicineCharge + fixedCharges + procedureCharges;

        // Calculate percentage fees
        const percentageCharges = chargesByType["PERCENTAGE"]?.map(charge => {
            return {
                ...charge,
                calculatedValue: (subtotal * charge.value) / 100
            };
        }) || [];

        const percentageTotal = percentageCharges.reduce(
            (sum, charge) => sum + charge.calculatedValue,
            0
        );

        // Calculate discounts
        const discountCharges = chargesByType["DISCOUNT"]?.map(charge => {
            return {
                ...charge,
                calculatedValue: ((subtotal + percentageTotal) * charge.value) / 100
            };
        }) || [];

        const discountTotal = discountCharges.reduce(
            (sum, charge) => sum + charge.calculatedValue,
            0
        );

        // Calculate final total
        const finalTotal = subtotal + percentageTotal - discountTotal;

        // Items Table Header - Medications
        yPos += 12;
        pdf.setFillColor(248, 250, 252);
        pdf.rect(margin, yPos, contentWidth, 7, 'F');
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);
        pdf.text("Medications", margin + 2, yPos + 5);

        // Medications list
        yPos += 10;
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);

        if (bill.entries.length > 0) {
            bill.entries.forEach((entry) => {
                pdf.setFontSize(9);
                pdf.text(`${entry.drugName} (${entry.brandName})`, margin + 2, yPos);
                pdf.text(`${entry.quantity}`, pageWidth - margin - 30, yPos);
                pdf.text(`${(entry.unitPrice * entry.quantity).toFixed(2)}`, pageWidth - margin - 10, yPos, {align: "right"});
                yPos += 7;
            });
        } else {
            pdf.text("No medications", margin + 2, yPos);
            yPos += 7;
        }

        // Summary Section
        yPos += 5;
        pdf.setDrawColor(colors.divider[0], colors.divider[1], colors.divider[2]);
        pdf.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 7;

        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.text("Charges", margin + 2, yPos);
        yPos += 7;

        // Medicine charge
        if (chargesByType["MEDICINE"]?.length > 0) {
            const charge = chargesByType["MEDICINE"][0];
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(9);
            pdf.text(`${charge.name || "Medicine Cost"}`, margin + 2, yPos);
            pdf.text(`LKR ${charge.value.toFixed(2)}`, pageWidth - margin - 15, yPos, {align: "right"});
            yPos += 5;
        }

        // Procedure charges
        if (chargesByType["PROCEDURE"]?.length > 0) {
            pdf.setTextColor(colors.purple[0], colors.purple[1], colors.purple[2]);
            chargesByType["PROCEDURE"].forEach(charge => {
                pdf.text(`${charge.name}`, margin + 2, yPos);
                pdf.text(`LKR ${charge.value.toFixed(2)}`, pageWidth - margin - 15, yPos, {align: "right"});
                yPos += 5;
            });
        }

        // Fixed charges
        if (chargesByType["FIXED"]?.length > 0) {
            pdf.setTextColor(colors.blue[0], colors.blue[1], colors.blue[2]);
            chargesByType["FIXED"].forEach(charge => {
                pdf.text(`${charge.name}`, margin + 2, yPos);
                pdf.text(`LKR ${charge.value.toFixed(2)}`, pageWidth - margin - 15, yPos, {align: "right"});
                yPos += 5;
            });
        }

        // Subtotal
        pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        pdf.setDrawColor(colors.divider[0], colors.divider[1], colors.divider[2]);
        pdf.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 5;
        pdf.setFont("helvetica", "bold");
        pdf.text("Subtotal:", margin + 2, yPos);
        pdf.text(`LKR ${subtotal.toFixed(2)}`, pageWidth - margin - 15, yPos, {align: "right"});
        yPos += 7;

        // Percentage charges
        if (percentageCharges.length > 0) {
            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(colors.green[0], colors.green[1], colors.green[2]);
            percentageCharges.forEach(charge => {
                pdf.text(`${charge.name} (${charge.value}%)`, margin + 2, yPos);
                pdf.text(`+ LKR ${charge.calculatedValue.toFixed(2)}`, pageWidth - margin - 15, yPos, {align: "right"});
                yPos += 5;
            });
        }

        // Discounts
        if (discountCharges.length > 0) {
            pdf.setTextColor(colors.discount[0], colors.discount[1], colors.discount[2]);
            discountCharges.forEach(charge => {
                pdf.text(`${charge.name} (${charge.value}%)`, margin + 2, yPos);
                pdf.text(`- LKR ${charge.calculatedValue.toFixed(2)}`, pageWidth - margin - 15, yPos, {align: "right"});
                yPos += 5;
            });
        }

        // Final Total
        pdf.setDrawColor(colors.divider[0], colors.divider[1], colors.divider[2]);
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 7;

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12);
        pdf.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
        pdf.text("Total:", margin + 2, yPos);
        pdf.text(`LKR ${finalTotal.toFixed(2)}`, pageWidth - margin - 15, yPos, {align: "right"});

        // Footer
        yPos = pdf.internal.pageSize.height - 20;
        pdf.setFontSize(8);
        pdf.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
        pdf.text("Thank you for choosing Thoduwawa Medical Center", centerText("Thank you for choosing Thoduwawa Medical Center"), yPos);

        // Save PDF
        const formattedDate = new Date().toISOString().split('T')[0];
        pdf.save(`TMC-Bill-PRESCRIPTION-${bill.prescriptionID}-${formattedDate}.pdf`);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="max-w-sm">
                <div className="p-4 text-center">
                    <DialogTitle className="text-lg font-semibold mb-2">Export Bill</DialogTitle>
                    <p className="text-sm text-gray-500 mb-4">
                        Download a PDF copy of bill for prescription #{bill.prescriptionID}
                    </p>
                    <Button
                        onClick={exportToPDF}
                        className="w-full"
                    >
                        <IoMdDownload className="w-5 h-5"/>
                        Download PDF
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}