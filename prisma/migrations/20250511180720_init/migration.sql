-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('DOCTOR', 'NURSE');

-- CreateEnum
CREATE TYPE "QueueStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "VisitStatus" AS ENUM ('PENDING', 'PRESCRIBED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "DrugType" AS ENUM ('TABLET', 'CAPSULE', 'SYRUP', 'EYE_DROP', 'EAR_DROP', 'NASAL_DROP', 'CREAM', 'OINTMENT', 'GEL', 'LOTION', 'INJECTION', 'INHALER', 'SPRAY', 'LOZENGE', 'SUPPOSITORY', 'PATCH', 'POWDER', 'SOLUTION', 'SUSPENSION', 'GARGLE', 'MOUTHWASH');

-- CreateEnum
CREATE TYPE "BatchStatus" AS ENUM ('AVAILABLE', 'EXPIRED', 'COMPLETED', 'QUALITY_FAILED', 'DISPOSED');

-- CreateEnum
CREATE TYPE "IssuingStrategy" AS ENUM ('TDS', 'BD', 'OD', 'QDS', 'SOS', 'NOCTE', 'MANE', 'VESPE', 'NOON', 'WEEKLY', 'OTHER');

-- CreateEnum
CREATE TYPE "MEAL" AS ENUM ('BEFORE', 'AFTER', 'WITH');

-- CreateEnum
CREATE TYPE "PrescriptionStatus" AS ENUM ('PENDING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "MedicalCertificateStatus" AS ENUM ('FIT', 'UNFIT');

-- CreateEnum
CREATE TYPE "PatientHistoryType" AS ENUM ('ALLERGY', 'MEDICAL', 'SURGICAL', 'FAMILY', 'SOCIAL');

-- CreateEnum
CREATE TYPE "VitalType" AS ENUM ('NUMBER', 'TEXT', 'DATE');

-- CreateEnum
CREATE TYPE "ChargeType" AS ENUM ('MEDICINE', 'FIXED', 'PERCENTAGE', 'PROCEDURE', 'DISCOUNT');

-- CreateTable
CREATE TABLE "Patient" (
    "id" SERIAL NOT NULL,
    "telephone" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3),
    "address" TEXT,
    "height" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "gender" "Gender" NOT NULL,
    "NIC" TEXT,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientHistory" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "description" TEXT,
    "type" "PatientHistoryType" NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,

    CONSTRAINT "PatientHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "image" TEXT,
    "mobile" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Queue" (
    "id" SERIAL NOT NULL,
    "start" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end" TIMESTAMP(3),
    "status" "QueueStatus" NOT NULL DEFAULT 'IN_PROGRESS',

    CONSTRAINT "Queue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QueueEntry" (
    "id" SERIAL NOT NULL,
    "token" INTEGER NOT NULL,
    "status" "VisitStatus" NOT NULL DEFAULT 'PENDING',
    "queueId" INTEGER NOT NULL,
    "patientId" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QueueEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DrugBrand" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "DrugBrand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Drug" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Drug_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BufferLevel" (
    "id" SERIAL NOT NULL,
    "drugId" INTEGER NOT NULL,
    "type" "DrugType" NOT NULL,
    "unitConcentrationId" INTEGER NOT NULL,
    "bufferAmount" INTEGER NOT NULL,

    CONSTRAINT "BufferLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "contact" TEXT,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Batch" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "drugId" INTEGER NOT NULL,
    "drugBrandId" INTEGER NOT NULL,
    "type" "DrugType" NOT NULL,
    "fullAmount" DOUBLE PRECISION NOT NULL,
    "expiry" TIMESTAMP(3) NOT NULL,
    "stockDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "remainingQuantity" DOUBLE PRECISION NOT NULL,
    "wholesalePrice" DOUBLE PRECISION NOT NULL,
    "retailPrice" DOUBLE PRECISION NOT NULL,
    "status" "BatchStatus" NOT NULL,
    "unitConcentrationId" INTEGER NOT NULL,
    "supplierId" INTEGER NOT NULL,

    CONSTRAINT "Batch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitConcentration" (
    "id" SERIAL NOT NULL,
    "concentration" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "UnitConcentration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prescription" (
    "id" SERIAL NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "presentingSymptoms" TEXT NOT NULL,
    "status" "PrescriptionStatus" NOT NULL DEFAULT 'PENDING',
    "details" TEXT,
    "patientId" INTEGER NOT NULL,
    "finalPrice" DOUBLE PRECISION,

    CONSTRAINT "Prescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrescriptionCharges" (
    "id" SERIAL NOT NULL,
    "prescriptionId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ChargeType" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "description" TEXT,

    CONSTRAINT "PrescriptionCharges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vitals" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "placeholder" TEXT NOT NULL,
    "forGender" "Gender",
    "type" "VitalType" NOT NULL,

    CONSTRAINT "Vitals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrescriptionVitals" (
    "id" SERIAL NOT NULL,
    "prescriptionId" INTEGER NOT NULL,
    "vitalId" INTEGER NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "PrescriptionVitals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalCertificate" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "nameOfThePatient" TEXT NOT NULL,
    "addressOfThePatient" TEXT NOT NULL,
    "fitForDuty" "MedicalCertificateStatus" NOT NULL,
    "dateOfSickness" TIMESTAMP(3) NOT NULL,
    "recommendedLeaveDays" INTEGER NOT NULL,
    "natureOfTheDisease" TEXT NOT NULL,
    "ageOfThePatient" INTEGER NOT NULL,
    "reccomendations" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicalCertificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "USSReferral" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "nameOfThePatient" TEXT NOT NULL,
    "presentingComplaint" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "onExamination" TEXT NOT NULL,
    "pshx_pmhx" TEXT NOT NULL,
    "ageOfThePatient" INTEGER NOT NULL,
    "reportDate" TIMESTAMP(3) NOT NULL,
    "USS_type" TEXT NOT NULL,
    "radiologist" TEXT NOT NULL,
    "radiologist_title" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "USSReferral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferralLetter" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "nameOfThePatient" TEXT NOT NULL,
    "consultant_speciality" TEXT NOT NULL,
    "consultant_name" TEXT NOT NULL,
    "condition1" TEXT NOT NULL,
    "condition2" TEXT NOT NULL,
    "condition3" TEXT NOT NULL,
    "investigations" TEXT NOT NULL,
    "ageOfThePatient" INTEGER NOT NULL,
    "reportDate" TIMESTAMP(3) NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReferralLetter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OffRecordMeds" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "prescriptionId" INTEGER NOT NULL,

    CONSTRAINT "OffRecordMeds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Issue" (
    "id" SERIAL NOT NULL,
    "prescriptionId" INTEGER NOT NULL,
    "batchId" INTEGER,
    "drugId" INTEGER NOT NULL,
    "brandId" INTEGER NOT NULL,
    "strategy" "IssuingStrategy" NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "dose" DOUBLE PRECISION NOT NULL,
    "details" TEXT,
    "meal" "MEAL",
    "type" "DrugType" NOT NULL,
    "unitConcentrationId" INTEGER NOT NULL,

    CONSTRAINT "Issue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportParameter" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "units" TEXT,
    "reportTypeId" INTEGER,

    CONSTRAINT "ReportParameter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "ReportType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientReport" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "reportTypeId" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PatientReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportValue" (
    "id" SERIAL NOT NULL,
    "reportParameterId" INTEGER NOT NULL,
    "attention" BOOLEAN NOT NULL DEFAULT false,
    "value" TEXT NOT NULL,
    "patientReportId" INTEGER,

    CONSTRAINT "ReportValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StratergyHistory" (
    "id" SERIAL NOT NULL,
    "drugId" INTEGER NOT NULL,
    "issueId" INTEGER NOT NULL,

    CONSTRAINT "StratergyHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BatchHistory" (
    "id" SERIAL NOT NULL,
    "drugId" INTEGER NOT NULL,
    "type" "DrugType" NOT NULL,
    "unitConcentrationId" INTEGER NOT NULL,
    "drugBrandId" INTEGER NOT NULL,
    "batchId" INTEGER NOT NULL,

    CONSTRAINT "BatchHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Charge" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ChargeType" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Charge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "QueueEntry_queueId_token_key" ON "QueueEntry"("queueId", "token");

-- CreateIndex
CREATE UNIQUE INDEX "BufferLevel_drugId_type_unitConcentrationId_key" ON "BufferLevel"("drugId", "type", "unitConcentrationId");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_name_key" ON "Supplier"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UnitConcentration_concentration_key" ON "UnitConcentration"("concentration");

-- CreateIndex
CREATE UNIQUE INDEX "ReportType_name_key" ON "ReportType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "StratergyHistory_drugId_key" ON "StratergyHistory"("drugId");

-- CreateIndex
CREATE UNIQUE INDEX "BatchHistory_drugId_drugBrandId_type_unitConcentrationId_key" ON "BatchHistory"("drugId", "drugBrandId", "type", "unitConcentrationId");

-- CreateIndex
CREATE UNIQUE INDEX "Charge_name_key" ON "Charge"("name");

-- AddForeignKey
ALTER TABLE "PatientHistory" ADD CONSTRAINT "PatientHistory_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueEntry" ADD CONSTRAINT "QueueEntry_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueEntry" ADD CONSTRAINT "QueueEntry_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES "Queue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BufferLevel" ADD CONSTRAINT "BufferLevel_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "Drug"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BufferLevel" ADD CONSTRAINT "BufferLevel_unitConcentrationId_fkey" FOREIGN KEY ("unitConcentrationId") REFERENCES "UnitConcentration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Batch" ADD CONSTRAINT "Batch_drugBrandId_fkey" FOREIGN KEY ("drugBrandId") REFERENCES "DrugBrand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Batch" ADD CONSTRAINT "Batch_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "Drug"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Batch" ADD CONSTRAINT "Batch_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Batch" ADD CONSTRAINT "Batch_unitConcentrationId_fkey" FOREIGN KEY ("unitConcentrationId") REFERENCES "UnitConcentration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrescriptionCharges" ADD CONSTRAINT "PrescriptionCharges_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "Prescription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrescriptionVitals" ADD CONSTRAINT "PrescriptionVitals_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "Prescription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrescriptionVitals" ADD CONSTRAINT "PrescriptionVitals_vitalId_fkey" FOREIGN KEY ("vitalId") REFERENCES "Vitals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalCertificate" ADD CONSTRAINT "MedicalCertificate_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "USSReferral" ADD CONSTRAINT "USSReferral_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralLetter" ADD CONSTRAINT "ReferralLetter_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OffRecordMeds" ADD CONSTRAINT "OffRecordMeds_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "Prescription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "DrugBrand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "Drug"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "Prescription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_unitConcentrationId_fkey" FOREIGN KEY ("unitConcentrationId") REFERENCES "UnitConcentration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportParameter" ADD CONSTRAINT "ReportParameter_reportTypeId_fkey" FOREIGN KEY ("reportTypeId") REFERENCES "ReportType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientReport" ADD CONSTRAINT "PatientReport_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientReport" ADD CONSTRAINT "PatientReport_reportTypeId_fkey" FOREIGN KEY ("reportTypeId") REFERENCES "ReportType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportValue" ADD CONSTRAINT "ReportValue_patientReportId_fkey" FOREIGN KEY ("patientReportId") REFERENCES "PatientReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportValue" ADD CONSTRAINT "ReportValue_reportParameterId_fkey" FOREIGN KEY ("reportParameterId") REFERENCES "ReportParameter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StratergyHistory" ADD CONSTRAINT "StratergyHistory_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "Drug"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StratergyHistory" ADD CONSTRAINT "StratergyHistory_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatchHistory" ADD CONSTRAINT "BatchHistory_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatchHistory" ADD CONSTRAINT "BatchHistory_drugBrandId_fkey" FOREIGN KEY ("drugBrandId") REFERENCES "DrugBrand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatchHistory" ADD CONSTRAINT "BatchHistory_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "Drug"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatchHistory" ADD CONSTRAINT "BatchHistory_unitConcentrationId_fkey" FOREIGN KEY ("unitConcentrationId") REFERENCES "UnitConcentration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
