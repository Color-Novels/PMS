"use client";

import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";
import {getNextUSSReferralId, fetchPatientData } from "../documents/lib/actions";
import { storeUSSReferral } from "../documents/lib/actions";

export function USSReferralExport({ patientId }: { patientId?: number }) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        patientName: "",
        patient_title: "",
        radiologist: "GH Chilaw",
        radiologist_title: "Sir",
        age: "",
        presentingComplaint: "",
        duration: "",
        onExamination: "",
        pshx_pmhx: "",
        USS_type: "",
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

                let defaultTitle = "";
                if (patientData.gender === "MALE") {
                    defaultTitle = "Mr";
                } else if (patientData.gender === "FEMALE") {
                    defaultTitle = "Mrs";
                }

                // Update form with patient data
                setFormData(prev => ({
                    ...prev,
                    patientName: patientData.name || "",
                    age: age,
                    patient_title: defaultTitle,
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


    const exportToPDF = async () => {
        try {
            const nextReferralId = await getNextUSSReferralId();
            await storeUSSReferral({
                patientId: patientId!, // This is now required
                nameOfThePatient: formData.patientName,
                presentingComplaint: formData.presentingComplaint,
                duration: formData.duration,
                onExamination: formData.onExamination,
                pshx_pmhx: formData.pshx_pmhx,
                ageOfThePatient: formData.age,
                reportDate: formData.reportDate,
                USS_type: formData.USS_type,
                radiologist: formData.radiologist,
                radiologist_title: formData.radiologist_title,

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
            pdf.text("Consultant Radiologist,", marginLeft, yPos);
            yPos += 6;

            pdf.text(`${formData.radiologist},`, marginLeft, yPos);
            yPos += 6;

            pdf.text(`Dear ${formData.radiologist_title},`, marginLeft, yPos);
            yPos += 6;

            pdf.setFontSize(12);  // Increased from 9
            pdf.setFont("helvetica", "bold");
            pdf.text("Request for an Ultra sound scan", centerX, yPos, { align: "center" });
            yPos += 10;

            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(10);  // Increased from 8

            // Combine patient details into a single paragraph
            const patientDetails = `This patient ${formData.patient_title}. ${formData.patientName}, ${formData.age ? formData.age + " years" : "[Not Provided]"} old, was presented with ${formData.presentingComplaint || "[Not Provided]"} for ${formData.duration || "[Not Provided]"} days.`;

            // Split the paragraph into lines that fit within the content width
            const patientDetailsLines = pdf.splitTextToSize(patientDetails, contentWidth);

            // Add the paragraph to the PDF
            pdf.text(patientDetailsLines, marginLeft, yPos);
            yPos += (patientDetailsLines.length * 5) + 1; // Adjust line spacing

            // Divide the content width into two columns
            const columnWidth = contentWidth / 2;

            // onExamination (First Column)
            const onExamination = `O/E -`;
            const onExaminationLines = pdf.splitTextToSize(onExamination, columnWidth - 4); // Adjust for padding
            pdf.text(onExaminationLines, marginLeft, yPos);

            // pshx_pmhx (Second Column)
            const pshx_pmhx = `PSHx/PMHx -`;
            const pshx_pmhxLines = pdf.splitTextToSize(pshx_pmhx, columnWidth - 4); // Adjust for padding
            pdf.text(pshx_pmhxLines, marginLeft + columnWidth, yPos);

            yPos += 5;

            const onExaminationText = `${formData.onExamination || "[Not Provided]"}`;
            const onExaminationTextLines = pdf.splitTextToSize(onExaminationText, columnWidth - 4); // Adjust for padding
            pdf.text(onExaminationTextLines, marginLeft, yPos);

            const pshx_pmhxText = `${formData.pshx_pmhx || "[Not Provided]"}`;
            const pshx_pmhxTextLines = pdf.splitTextToSize(pshx_pmhxText, columnWidth - 4); // Adjust for padding
            pdf.text(pshx_pmhxTextLines, marginLeft + columnWidth, yPos);

            // Update yPos based on the maximum number of lines
            const maxLines = Math.max(onExaminationTextLines.length, pshx_pmhxTextLines.length);
            yPos += (maxLines * 5) + 1; // Adjust line spacing

            const USSDetails = `I would be grateful to you if you could arrange an USS ${formData.USS_type || "[Not Provided]"}  for this patient and advice on further managemnt.`;

            // Split the paragraph into lines that fit within the content width
            const USStDetailsLines = pdf.splitTextToSize(USSDetails, contentWidth);

            // Add the paragraph to the PDF
            pdf.text(USStDetailsLines, marginLeft, yPos);
            yPos += (USStDetailsLines.length * 5) + 1; // Adjust line spacing
            // Signature and date
            const signatureY = 165; // Vertical position for signature and date
            pdf.setFontSize(10);
            pdf.text("Thank you,", marginLeft , signatureY + 5);

            // Signature line on the left
            pdf.line(marginLeft, signatureY +20, marginLeft + 50, signatureY + 20); // Adjust line length (50) as needed

            // Signature on the left
            pdf.text("Dr. Dinej Chandrasiri", marginLeft , signatureY + 26);

            // Footer with referral ID
            pdf.setFontSize(8);  // Increased from 6
            pdf.text(`Referral ID: USS-${nextReferralId}`, centerX, 200, { align: "center" });

            // Save the PDF with a dynamic filename
            const filename = formData.patientName
                ? `USS_Referral_${formData.patientName.replace(/\s+/g, '_')}.pdf`
                : 'USS_Referral.pdf';

            pdf.save(filename);
        } catch (error) {
            console.error("Error saving referral:", error);
            // You might want to show an error message to the user
            alert("Failed to save referral. Recheck all the required fields are filled correctly.");
            return;
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <FileText className="w-5 h-5 text-white" /> Generate USS Referral
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-xl h-[90vh] flex flex-col">
                {/* Form Header */}
                <DialogHeader>
                    <div className="bg-primary text-white p-4 rounded-lg">
                        <DialogTitle className="text-xl font-bold text-center">USS Referral Generator</DialogTitle>
                        <p className="text-center text-blue-100 text-sm">Complete the form below to generate referral</p>
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
                                <div className="mb-4">
                                    <label className="text-sm font-medium text-gray-700">Title</label>
                                    <select
                                        name="patient_title"
                                        value={formData.patient_title}
                                        onChange={handleChange}
                                        className=" text-sm w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="Mr" className="text-sm">Mr</option>
                                        <option value="Mrs" className="text-sm">Mrs</option>
                                        <option value="Mast" className="text-sm">Mast</option>
                                        <option value="Miss" className="text-sm">Miss</option>
                                        <option value="Baby" className="text-sm">Baby</option>

                                    </select>
                                </div>
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
                                    Radiologist Information
                                </h3>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Title</label>
                                        <select
                                            name="radiologist_title"
                                            value={formData.radiologist_title}
                                            onChange={handleChange}
                                            className=" text-sm w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="Sir" className="text-sm">Sir</option>
                                            <option value="Madam" className="text-sm">Madam</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Radiologist</label>
                                        <select
                                            name="radiologist"
                                            value={["GH Chilaw", "BH Marawila"].includes(formData.radiologist) ? formData.radiologist : "Other"}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    radiologist: value === "Other" ? "" : value,
                                                }));
                                            }}
                                            className="text-sm w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="GH Chilaw">GH Chilaw</option>
                                            <option value="BH Marawila">BH Marawila</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        {/* Show text input when radiologist is empty or not one of the predefined options */}
                                        {(formData.radiologist === "" ||
                                            (formData.radiologist !== "GH Chilaw" &&
                                                formData.radiologist !== "BH Marawila" &&
                                                formData.radiologist !== "Other")) && (
                                                <input
                                                    type="text"
                                                    name="radiologist"
                                                    value={formData.radiologist}
                                                    onChange={(e) => {
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            radiologist: e.target.value
                                                        }));
                                                    }}
                                                    placeholder="Enter custom radiologist name"
                                                    className="mt-2 text-sm w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                    autoFocus
                                                />
                                            )}
                                    </div>


                                </div>

                            </div>

                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                <h3 className="text-blue-700 font-medium mb-3 flex items-center">
                                    <span
                                        className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center mr-2 text-sm">3</span>
                                    Medical Details
                                </h3>

                                <div className="mb-4">
                                    <label className="text-sm font-medium text-gray-700">Presenting Complaint</label>
                                    <Textarea
                                        name="presentingComplaint"
                                        value={formData.presentingComplaint}
                                        onChange={handleChange}
                                        placeholder="Patient's presenting complaint"
                                        className="border-gray-300 focus:ring-blue-500 min-h-20"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="text-sm font-medium text-gray-700">Duration</label>
                                    <Input
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleChange}
                                        placeholder="Duration of complaint"
                                        className="border-gray-300 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="text-sm font-medium text-gray-700">O/E</label>
                                    <Textarea
                                        name="onExamination"
                                        value={formData.onExamination}
                                        onChange={handleChange}
                                        placeholder="O/E"
                                        className="border-gray-300 focus:ring-blue-500 min-h-20"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="text-sm font-medium text-gray-700">PSHx/PMHx</label>
                                    <Textarea
                                        name="pshx_pmhx"
                                        value={formData.pshx_pmhx}
                                        onChange={handleChange}
                                        placeholder="Past Surgical/Medical History"
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
                                    <label className="text-sm font-medium text-gray-700">USS type</label>
                                    <Input
                                        name="USS_type"
                                        value={formData.USS_type}
                                        onChange={handleChange}
                                        placeholder="USS type"
                                        className="border-gray-300 focus:ring-blue-500"
                                    />
                                </div>

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
                        <FileText className="w-5 h-5 mr-2" /> Generate USS Referral
                    </Button>
                </div>
            </DialogContent>
        </Dialog >
    );
}