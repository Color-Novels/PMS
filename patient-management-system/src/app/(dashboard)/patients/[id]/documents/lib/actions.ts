'use server'
import { prisma } from '@/app/lib/prisma'
import { revalidatePath } from 'next/cache'
import { MedicalCertificateStatus } from '@prisma/client'

interface MedicalCertificateData {
    patientId: number;
    nameOfThePatient: string;
    addressOfThePatient: string;
    fitForDuty: string;
    dateOfSickness: string;
    recommendedLeaveDays: string;
    natureOfTheDisease: string;
    ageOfThePatient: string;
    reccomendations: string;
}

export async function storeMedicalCertificate(data: MedicalCertificateData) {
    try {
        return await prisma.medicalCertificate.create({
            data: {
                patientId: data.patientId,
                nameOfThePatient: data.nameOfThePatient,
                addressOfThePatient: data.addressOfThePatient,
                fitForDuty:
                    data.fitForDuty === "Yes"
                        ? MedicalCertificateStatus.FIT
                        : MedicalCertificateStatus.UNFIT,
                dateOfSickness: new Date(data.dateOfSickness),
                recommendedLeaveDays: parseInt(data.recommendedLeaveDays),
                natureOfTheDisease: data.natureOfTheDisease,
                ageOfThePatient: parseInt(data.ageOfThePatient),
                reccomendations: data.reccomendations,
                time: new Date(),
            },
        });
    } catch (error) {
        console.error("Error storing medical certificate:", error);
        throw new Error("Failed to store medical certificate");
    }
}

export const getNextMedicalCertificateId = async (): Promise<number> => {
    const latestCertificate = await prisma.medicalCertificate.findFirst({
        orderBy: {id: "desc"},
        select: {id: true},
    });
 
    return latestCertificate ? latestCertificate.id + 1 : 1;
 };

export async function getMedicalCertificates(patientId: number) {
    try {
        return await prisma.medicalCertificate.findMany({
            where: {patientId},
            orderBy: {time: "desc"},
        });
    } catch (error) {
        console.error("Failed to fetch certificates:", error);
        throw new Error("Failed to fetch certificates");
    }
}

export async function deleteMedicalCertificate(id: number) {
    try {
        await prisma.medicalCertificate.delete({
            where: {id},
        });
        revalidatePath("/patients/[id]/documents");
        return {success: true};
    } catch (error) {
        console.error("Failed to delete certificate:", error);
        throw new Error("Failed to delete certificate");
    }
}

interface PatientData {
    id: number;
    name: string;
    birthDate?: Date | null;
    address?: string | null;
    gender?: string | null;
}

/**
 * Fetches patient data from the database
 * @param patientId - The ID of the patient to fetch
 * @returns Promise with patient data or null if not found
 */
export async function fetchPatientData(
    patientId: number
): Promise<PatientData | null> {
    try {
        // Query the database for the patient with the given ID
        return await prisma.patient.findUnique({
            where: {
                id: patientId,
            },
            select: {
                id: true,
                name: true,
                birthDate: true,
                address: true,
                gender: true,
            },
        });
    } catch (error) {
        console.error("Error fetching patient data:", error);
        throw new Error("Failed to fetch patient data");
    }
}


interface USSReferralData {
    patientId: number;
    nameOfThePatient: string;
    presentingComplaint: string;
    duration: string;
    onExamination: string;
    pshx_pmhx: string;
    ageOfThePatient: string;
    reportDate: string;
    USS_type: string;
    radiologist: string;
    radiologist_title: string;
}

export async function storeUSSReferral(data: USSReferralData) {
    try {
        return await prisma.uSSReferral.create({
            data: {
                patientId: data.patientId,
                nameOfThePatient: data.nameOfThePatient,
                presentingComplaint: data.presentingComplaint,
                duration: data.duration,
                onExamination: data.onExamination,
                pshx_pmhx: data.pshx_pmhx,
                ageOfThePatient: parseInt(data.ageOfThePatient),
                reportDate: new Date(data.reportDate),
                USS_type: data.USS_type,
                radiologist: data.radiologist,
                radiologist_title: data.radiologist_title,
            },
        });
    } catch (error) {
        console.error("Error storing USS referral:", error);
        throw new Error("Failed to store USS referral");
    }
}

export const getNextUSSReferralId = async (): Promise<number> => {
    const latestReferral = await prisma.uSSReferral.findFirst({
        orderBy: { id: "desc" },
        select: { id: true },
    });

    return latestReferral ? latestReferral.id + 1 : 1;
};



export async function getUSSReferrals(patientId: number) {
    try {
        return await prisma.uSSReferral.findMany({
            where: { patientId },
            orderBy: { time: "desc" },
        });
    } catch (error) {
        console.error("Failed to fetch USS referrals:", error);
        throw new Error("Failed to fetch USS referrals");
    }
}

export async function deleteUSSReferral(id: number) {
    try {
        await prisma.uSSReferral.delete({
            where: { id },
        });
        revalidatePath("/patients/[id]/documents");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete USS referral:", error);
        throw new Error("Failed to delete USS referral");
    }
}

export interface ReferralLetterData {
    patientId: number;
    nameOfThePatient: string;
    consultant_speciality: string;
    consultant_name: string;
    condition1: string;
    condition2: string;
    condition3: string;
    investigations: string;
    ageOfThePatient: string; // Received as string from form
    reportDate: string; // Received as string from form
}

export async function storeReferralLetter(data: ReferralLetterData) {
    try {
        return await prisma.referralLetter.create({
            data: {
                patientId: data.patientId,
                nameOfThePatient: data.nameOfThePatient,
                consultant_speciality: data.consultant_speciality,
                consultant_name: data.consultant_name,
                condition1: data.condition1,
                condition2: data.condition2,
                condition3: data.condition3,
                investigations: data.investigations,
                ageOfThePatient: parseInt(data.ageOfThePatient),
                reportDate: new Date(data.reportDate),
            },
        });
    } catch (error) {
        console.error("Error storing referral letter:", error);
        throw new Error("Failed to store referral letter");
    }
}

export async function getReferralLetters(patientId: number) {
    try {
        return await prisma.referralLetter.findMany({
            where: { patientId },
            orderBy: { time: "desc" },
        });
    } catch (error) {
        console.error("Failed to fetch referral letters:", error);
        throw new Error("Failed to fetch referral letters");
    }
}

export async function deleteReferralLetter(id: number) {
    try {
        await prisma.referralLetter.delete({
            where: { id },
        });
        revalidatePath("/patients/[id]/documents");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete referral letter:", error);
        throw new Error("Failed to delete referral letter");
    }
}


export const getNextReferralLetterId = async (): Promise<number> => {
    const latestLetter = await prisma.referralLetter.findFirst({
        orderBy: { id: "desc" },
        select: { id: true },
    });
    return latestLetter ? latestLetter.id + 1 : 1;
};
