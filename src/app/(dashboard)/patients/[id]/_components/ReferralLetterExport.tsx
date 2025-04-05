"use client";

import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";
import { fetchPatientData } from "../documents/lib/actions";
import { storeReferralLetter,getNextReferralLetterId } from "../documents/lib/actions";

export function ReferralLetterExport({ patientId }: { patientId?: number }) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        patientName: "",
        age: "",
        consultant_speciality: "Physician",
        consultant_name: "",
        consultant_title: "Sir",
        conditions: ["", "", ""], // Three conditions
        investigations: "",
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
                    age: age
                }));
            }
        } catch (error) {
            console.error("Error loading patient data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleConditionChange = (index: number, value: string) => {
        const updatedConditions = [...formData.conditions];
        updatedConditions[index] = value;
        setFormData((prev) => ({
            ...prev,
            conditions: updatedConditions,
        }));
    };


    const exportToPDF = async () => {
        try {
            const nextReferralId = await getNextReferralLetterId();
            await storeReferralLetter({
                patientId: patientId!, // This is now required
                nameOfThePatient: formData.patientName,
                consultant_speciality: formData.consultant_speciality,
                consultant_name: formData.consultant_name,
                condition1: formData.conditions[0],
                condition2: formData.conditions[1],
                condition3: formData.conditions[2],
                investigations: formData.investigations,
                ageOfThePatient: formData.age,
                reportDate: formData.reportDate,
            });

            // Generate the PDF
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
            pdf.text("Registered Medical Officer. SLMC No. 3002", marginLeft, yPos);
            yPos += 6;

            pdf.text("Thoduwawa Medical Center, Church Rd, Thoduwawa", marginLeft, yPos);
            yPos += 5;

            // Draw a full-width horizontal line
            pdf.setDrawColor(0); // Set line color to black
            pdf.setLineWidth(0.2); // Set line thickness
            pdf.line(marginLeft, yPos, marginLeft + contentWidth, yPos); // Draw line from left to right
            yPos += 7; // Adjust yPos for spacing after the line

            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(10);  // Increased from 7
            pdf.text(`Consultant ${formData.consultant_speciality},`, marginLeft, yPos);
            yPos += 6;

            pdf.text(`${formData.consultant_name},`, marginLeft, yPos);
            yPos += 6;

            pdf.text(`Dear ${formData.consultant_title},`, marginLeft, yPos);
            yPos += 6;

            pdf.setFontSize(11);  // Increased from 9
            pdf.setFont("helvetica", "bold");
            pdf.text(`Re - ${formData.patientName || "[Not Provided]"}`, centerX, yPos, { align: "center" });
            yPos += 8;

            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(10);

            // Conditions
            // Split the instruction text into multiple lines if it exceeds the content width
            const instructionText = "Please be kind enough to see this patient with the following conditions and do the needful.";
            const instructionLines = pdf.splitTextToSize(instructionText, contentWidth);

            // Add the instruction lines to the PDF
            pdf.text(instructionLines, marginLeft, yPos);
            yPos += (instructionLines.length * 5) + 1; // Adjust line spacing

            formData.conditions.forEach((condition, index) => {
                if (condition) {
                    // Split condition text into multiple lines if it exceeds the content width
                    const conditionLines = pdf.splitTextToSize(`${index + 1}. ${condition}`, contentWidth);

                    // Add the first line (with the number)
                    pdf.text(conditionLines[0], marginLeft, yPos);
                    yPos += 5; // Adjust line spacing

                    // Add subsequent lines with padding to align with the text after the number
                    if (conditionLines.length > 1) {
                        for (let i = 1; i < conditionLines.length; i++) {
                            // Add padding to align with the text after the number
                            pdf.text(conditionLines[i], marginLeft + 4, yPos); // Adjust padding (10) as needed
                            yPos += 5; // Adjust line spacing
                        }
                    }
                }
            });

            yPos += 3;

            // Investigations
            if (formData.investigations) {
                // Split investigations text into multiple lines if it exceeds the content width
                const investigationsLines = pdf.splitTextToSize(`Ix: ${formData.investigations}`, contentWidth);

                // Add the first line (with "Ix:")
                pdf.text(investigationsLines[0], marginLeft, yPos);
                yPos += 5; // Adjust line spacing

                // Add subsequent lines with padding to align with the text after "Ix:"
                if (investigationsLines.length > 1) {
                    for (let i = 1; i < investigationsLines.length; i++) {
                        // Add padding to align with the text after "Ix:"
                        pdf.text(investigationsLines[i], marginLeft + 5, yPos); // Adjust padding (10) as needed
                        yPos += 5; // Adjust line spacing
                    }
                }
            }
            // Signature and date
            const signatureY = 165; // Vertical position for signature and date
            pdf.setFontSize(10);
            pdf.text("Thank you,", marginLeft , signatureY + 5);

            // Signature line on the left
            pdf.line(marginLeft, signatureY +20, marginLeft + 50, signatureY + 20); // Adjust line length (50) as needed

            // Signature on the left
            pdf.text("Dr. Dinej Chandrasiri", marginLeft , signatureY + 26);

            // Footer with referral ID
            pdf.setFontSize(8);
            pdf.text(`Referral ID: REF-${nextReferralId}`, centerX, 200, { align: "center" });

            // Save the PDF with a dynamic filename
            const filename = formData.patientName
                ? `Referral_Letter_${formData.patientName.replace(/\s+/g, '_')}.pdf`
                : 'Referral_Letter.pdf';

            pdf.save(filename);
        } catch (error) {
            console.error("Error saving referral letter:", error);
            alert("Failed to save referral letter. Please check all required fields are filled correctly.");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <FileText className="w-5 h-5 text-white" /> Generate Referral Letter
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-xl h-[90vh] flex flex-col">
                {/* Form Header */}
                <DialogHeader>
                    <div className="bg-primary text-white p-4 rounded-lg">
                        <DialogTitle className="text-xl font-bold text-center">Referral Letter Generator</DialogTitle>
                        <p className="text-center text-blue-100 text-sm">Complete the form below to generate the referral letter</p>
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

                            </div>

                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                <h3 className="text-blue-700 font-medium mb-3 flex items-center">
                                    <span
                                        className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center mr-2 text-sm">2</span>
                                    consultant Information
                                </h3>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Title</label>
                                        <select
                                            name="consultant_title"
                                            value={formData.consultant_title}
                                            onChange={handleChange}
                                            className=" text-sm w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="Sir" className="text-sm">Sir</option>
                                            <option value="Madam" className="text-sm">Madam</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Specialty</label>
                                        <select
                                            name="consultant_speciality"
                                            value={["Physician", "Surgeon", "Pediatrician", "Gynecologist & Obstetrician"].includes(formData.consultant_speciality) ? formData.consultant_speciality : "Other"}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    consultant_speciality: value === "Other" ? "" : value,
                                                }));
                                            }}
                                            className="text-sm w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="Physician">Physician</option>
                                            <option value="Surgeon">Surgeon</option>
                                            <option value="Pediatrician">Pediatrician</option>
                                            <option value="Gynecologist & Obstetrician">Gynecologist & Obstetrician</option>
                                            <option value="Other">Other</option>

                                        </select>
                                        {/* Show text input when consultant is empty or not one of the predefined options */}
                                        {(formData.consultant_speciality === "" ||
                                            (formData.consultant_speciality !== "Physician" &&
                                                formData.consultant_speciality !== "Surgeon" &&
                                                formData.consultant_speciality !== "Pediatrician" &&
                                                formData.consultant_speciality !== "Gynecologist & Obstetrician" &&
                                                formData.consultant_speciality !== "Other")) && (
                                                <input
                                                    type="text"
                                                    name="consultant"
                                                    value={formData.consultant_speciality}
                                                    onChange={(e) => {
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            consultant: e.target.value
                                                        }));
                                                    }}
                                                    placeholder="Enter custom consultant name"
                                                    className="mt-2 text-sm w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                    autoFocus
                                                />
                                            )}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="text-sm font-medium text-gray-700">Name</label>
                                    <Input
                                        name="consultant_name"
                                        value={formData.consultant_name}
                                        onChange={handleChange}
                                        placeholder="Consultant name"
                                        className="border-gray-300 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                <h3 className="text-blue-700 font-medium mb-3 flex items-center">
                                    <span
                                        className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center mr-2 text-sm">3</span>
                                    Medical Details
                                </h3>

                                {formData.conditions.map((condition, index) => (
                                    <div key={index} className="mb-4">
                                        <label className="text-sm font-medium text-gray-700">Condition {index + 1}</label>
                                        <Input
                                            value={condition}
                                            onChange={(e) => handleConditionChange(index, e.target.value)}
                                            placeholder={`Condition ${index + 1}`}
                                            className="border-gray-300 focus:ring-blue-500"
                                        />
                                    </div>
                                ))}

                                <div className="mb-4">
                                    <label className="text-sm font-medium text-gray-700">Investigations</label>
                                    <Textarea
                                        name="investigations"
                                        value={formData.investigations}
                                        onChange={handleChange}
                                        placeholder="Required investigations"
                                        className="border-gray-300 focus:ring-blue-500 min-h-20"
                                    />
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                <h3 className="text-blue-700 font-medium mb-3 flex items-center">
                                    <span
                                        className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center mr-2 text-sm">4</span>
                                    Report Details
                                </h3>

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

                    {/* Submit button */}
                    <div className="  ">
                        <Button
                            onClick={exportToPDF}
                            className="w-full"
                            disabled={isLoading}
                        >
                            <FileText className="w-5 h-5 mr-2" /> Generate Referral Letter
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}