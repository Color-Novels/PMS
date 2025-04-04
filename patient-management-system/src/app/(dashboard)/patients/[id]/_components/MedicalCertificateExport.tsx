"use client";

import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";
import {getNextMedicalCertificateId, fetchPatientData, storeMedicalCertificate } from "../documents/lib/actions";

export function MedicalCertificateExport({ patientId }: { patientId?: number }) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        patientName: "",
        age: "",
        address: "",
        workPlace: "",
        disease: "",
        recommendation: "",
        fitForDuty: "No",
        sickDaysCount: "",
        sickDate: "",
        reportDate: new Date().toISOString().split('T')[0],
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Fetch patient data if patientId is provided
        if (patientId) {
            loadPatientData(patientId).then();
        }
    }, [patientId]);

    const loadPatientData = async (id: number) => {
        try {
            setIsLoading(true);
            const patientData = await fetchPatientData(id);

            if (patientData) {
                // Calculate age from birthDate if available
                let age = "";
                if (patientData.birthDate) {
                    const birthDate = new Date(patientData.birthDate);
                    const today = new Date();
                    age = Math.floor((today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)).toString();
                }

                // Update form with patient data
                setFormData(prev => ({
                    ...prev,
                    patientName: patientData.name || "",
                    address: patientData.address || "",
                    age: age
                }));
            }
        } catch (error) {
            console.error("Error loading patient data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === 'fitForDuty' && value === 'Yes' ? { sickDaysCount: '0' } : {})
        }));
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const exportToPDF = async () => {
        try {
            const nextMCId = await getNextMedicalCertificateId();
            await storeMedicalCertificate({
                patientId: patientId!, // This is now required
                nameOfThePatient: formData.patientName,
                addressOfThePatient: formData.address,
                fitForDuty: formData.fitForDuty,
                dateOfSickness: formData.sickDate,
                recommendedLeaveDays: formData.sickDaysCount,
                natureOfTheDisease: formData.disease,
                ageOfThePatient: formData.age,
                reccomendations: formData.recommendation,
            });

            // Then generate the PDF as before
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a5"
            });

            // A5 layout constants
            const pageWidth = 148;
            const centerX = pageWidth / 2;
            const marginLeft = 12;
            const marginRight = 12;
            const contentWidth = pageWidth - marginLeft - marginRight;

            // Set basic fonts and start position
            pdf.setFont("helvetica", "normal");
            let yPos = 10;


            // Add doctor information - INCREASED FONT SIZE
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(10);  // Increased from 9
            pdf.text("Dr. Dinej Chandrasiri", marginLeft, yPos);
            yPos += 6;

            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(10);  // Increased from 7
            pdf.text("Registered Medical Officer", marginLeft, yPos);
            yPos += 6;

            pdf.text("SLMC No. 3002", marginLeft, yPos);
            yPos += 6;

            pdf.text("Thoduwawa Medical Center, Church Rd, Thoduwawa", marginLeft, yPos);
            yPos += 13;

            pdf.setFontSize(14);  // Increased from 9
            pdf.setFont("helvetica", "bold");
            pdf.text("Private Medical Certificate", centerX, yPos, { align: "center" });
            yPos += 13;


            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(10);  // Increased from 8

            // Patient details
            pdf.text(`Name of the Patient : ${formData.patientName || "[Not Provided]"}`, marginLeft, yPos);
            yPos += 6;

            pdf.text(`Age : ${formData.age ? formData.age + " years" : "[Not Provided]"}`, marginLeft, yPos);
            yPos += 6;

            // Address with proper wrapping for A5
            const addressText = `Address : ${formData.address || "[Not Provided]"}`;
            const addressLines = pdf.splitTextToSize(addressText, contentWidth);
            pdf.text(addressLines, marginLeft, yPos);
            yPos += (addressLines.length * 5) + 1;  // Increased line spacing

            // Workplace
            const workplaceText = `Name and Adress of the Work Place : ${formData.workPlace || "[Not Provided]"}`;
            const workplaceLines = pdf.splitTextToSize(workplaceText, contentWidth);
            pdf.text(workplaceLines, marginLeft, yPos);
            yPos += (workplaceLines.length * 5) + 1;  // Increased line spacing


            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(10);  // Increased from 8

            // Medical condition with wrapping
            const conditionText = `Nature of the Disease : ${formData.disease || "[Not Provided]"}`;
            const conditionLines = pdf.splitTextToSize(conditionText, contentWidth);
            pdf.text(conditionLines, marginLeft, yPos);
            yPos += (conditionLines.length * 5) + 1;  // Increased line spacing


            // Recommendation section
            pdf.text("Recommendation of the medical officer :", marginLeft, yPos);
            yPos += 5;

            // Recommendation text - still slightly larger but manageable
            pdf.setFontSize(9.5);  // Increased from 7.5
            const recommendationLines = pdf.splitTextToSize(
                formData.recommendation || "[No recommendation provided]",
                contentWidth - 4
            );
            pdf.text(recommendationLines, marginLeft + 4, yPos);
            yPos += (recommendationLines.length * 4.5) + 1;  // Increased line spacing

            const diseaseText = `Is the person fit for Duty? ${formData.fitForDuty === "Yes" ? "Yes" : "No"}`;
            const dieseaseLines = pdf.splitTextToSize(diseaseText, contentWidth);
            pdf.text(dieseaseLines, marginLeft, yPos);
            yPos += (dieseaseLines.length * 5) + 1;  // Increased line spacing



            // Sick leave details if not fit
            if (formData.fitForDuty === "No") {


                if (formData.sickDaysCount === "1") {

                    pdf.text(`Recommended Leave : ${formData.sickDaysCount || "[Not Provided]"} day from ${formatDate(formData.sickDate) || "[Not Provided]"}`, marginLeft, yPos);
                    yPos += 6;
                } else {
                    pdf.text(`Recommended Leave : ${formData.sickDaysCount || "[Not Provided]"} days from ${formatDate(formData.sickDate) || "[Not Provided]"}`, marginLeft, yPos);
                    yPos += 6;
                }
            } else {
                pdf.text(`Date of Sickness : ${formatDate(formData.sickDate) || "[Not Provided]"}`, marginLeft, yPos);
                yPos += 6;
            }

            // Certificate issue date and signature - positioned near bottom
            const signatureY = 185;
            pdf.setFontSize(10);  // Increased from 8
            pdf.text(`Date: ${formatDate(formData.reportDate)}`, marginLeft, signatureY);

            // Signature line
            pdf.line(pageWidth - 65, signatureY - 3, pageWidth - marginRight, signatureY - 3);
            pdf.setFontSize(9);  // Increased from 7
            pdf.text("Signature", pageWidth - 38, signatureY + 2, { align: "center" });

            // Footer with certificate ID
            pdf.setFontSize(8);  // Increased from 6
            pdf.text(`Certificate ID: MC-${nextMCId}`, centerX, 200, { align: "center" });

            // Save the PDF with a dynamic filename
            const filename = formData.patientName
                ? `Medical_Certificate_${formData.patientName.replace(/\s+/g, '_')}.pdf`
                : 'Medical_Certificate.pdf';

            pdf.save(filename);
        } catch (error) {
            console.error("Error saving medical certificate:", error);
            // You might want to show an error message to the user
            alert("Failed to save medical certificate. Recheck all the requred feilds are filled correctly.");
            return;
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <FileText className="w-5 h-5 text-white" /> Generate Medical Certificate
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-xl h-[90vh] flex flex-col">
                {/* Form Header */}
                <DialogHeader>
                    <div className="bg-primary text-white p-4 rounded-lg">
                        <DialogTitle className="text-xl font-bold text-center">Medical Certificate
                            Generator</DialogTitle>
                        <p className="text-center text-blue-100 text-sm">Complete the form below to generate
                            certificate</p>
                    </div>
                </DialogHeader>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50 rounded-lg">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="text-blue-600">Loading patient data...</div>
                        </div>
                    ) : (
                        <div className="space-y-6 max-w-lg mx-auto">
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                <h3 className="text-blue-700 font-medium mb-3 flex items-center">
                                    <span
                                        className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center mr-2 text-sm">1</span>
                                    Patient Information
                                </h3>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Patient Name</label>
                                        <Input
                                            name="patientName"
                                            value={formData.patientName}
                                            onChange={handleChange}
                                            placeholder="Full name"
                                            className="border-gray-300 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Age</label>
                                        <Input
                                            name="age"
                                            value={formData.age}
                                            onChange={handleChange}
                                            type="number"
                                            placeholder="Years"
                                            className="border-gray-300 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="text-sm font-medium text-gray-700">Address</label>
                                    <Input
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Full address"
                                        className="border-gray-300 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="text-sm font-medium text-gray-700">Name & Adress of the Work
                                        Place</label>
                                    <Input
                                        name="workPlace"
                                        value={formData.workPlace}
                                        onChange={handleChange}
                                        placeholder="Company/Organization name and Address"
                                        className="border-gray-300 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                <h3 className="text-blue-700 font-medium mb-3 flex items-center">
                                    <span
                                        className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center mr-2 text-sm">2</span>
                                    Medical Details
                                </h3>

                                <div className="mb-4">
                                    <label className="text-sm font-medium text-gray-700">Condition/Disease</label>
                                    <Input
                                        name="disease"
                                        value={formData.disease}
                                        onChange={handleChange}
                                        placeholder="Medical condition"
                                        className="border-gray-300 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="text-sm font-medium text-gray-700">Medical Recommendation</label>
                                    <Textarea
                                        name="recommendation"
                                        value={formData.recommendation}
                                        onChange={handleChange}
                                        placeholder="Detailed recommendation"
                                        className="border-gray-300 focus:ring-blue-500 min-h-20"
                                    />
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                <h3 className="text-blue-700 font-medium mb-3 flex items-center">
                                    <span
                                        className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center mr-2 text-sm">3</span>
                                    Fitness Assessment
                                </h3>

                                <div className="mb-4">
                                    <label className="text-sm font-medium text-gray-700">Fit for Duty?</label>
                                    <select
                                        name="fitForDuty"
                                        value={formData.fitForDuty}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>

                                {formData.fitForDuty === "No" ? (
                                    <div className="mb-4">
                                        <label className="text-sm font-medium text-gray-700">Days of Leave
                                            Recommended</label>
                                        <Input
                                            name="sickDaysCount"
                                            value={formData.sickDaysCount}
                                            onChange={handleChange}
                                            type="number"
                                            placeholder="Number of days"
                                            className="border-gray-300 focus:ring-blue-500"
                                        />
                                    </div>
                                ) : (
                                    <input
                                        type="hidden"
                                        name="sickDaysCount"
                                        value="0"
                                        onChange={handleChange}
                                    />
                                )}
                                {formData.fitForDuty === "No" ? (
                                    <div className="mb-4">
                                        <label className="text-sm font-medium text-gray-700">From date</label>
                                        <Input
                                            name="sickDate"
                                            value={formData.sickDate}
                                            onChange={handleChange}
                                            type="date"
                                            className="border-gray-300 focus:ring-blue-500"
                                        />
                                    </div>
                                ) : (
                                    <div className="mb-4">
                                        <label className="text-sm font-medium text-gray-700">Date of Sickness</label>
                                        <Input
                                            name="sickDate"
                                            value={formData.sickDate}
                                            onChange={handleChange}
                                            type="date"
                                            className="border-gray-300 focus:ring-blue-500"
                                        />
                                    </div>
                                )}

                                <div className="mb-4">
                                    <label className="text-sm font-medium text-gray-700">Report Issue Date</label>
                                    <Input
                                        name="reportDate"
                                        value={formData.reportDate}
                                        onChange={handleChange}
                                        type="date"
                                        className="border-gray-300 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Submit button */}
                <div className="  ">
                    <Button
                        onClick={exportToPDF}
                        className="w-full"
                        disabled={isLoading}
                    >
                        <FileText className="w-5 h-5 mr-2" /> Generate Medical Certificate
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}