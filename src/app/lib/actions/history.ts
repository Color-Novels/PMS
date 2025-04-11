"use server";

import { Prisma } from "@prisma/client";
import type { PatientHistoryType } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";
import { verifySession } from "@/app/lib/sessions";
import { redirect } from "next/navigation";
import { myError } from "@/app/lib/definitions";
import { revalidatePath } from "next/cache";
import { compareHistoryTypes } from "../utils";

export async function getHistorySidebar({
    filter = "all",
    patientID,
    query = "",
}: {
    filter?: string;
    query?: string;
    patientID: number;
}) {
    const session = await verifySession();

    if (session.role !== "DOCTOR") redirect("/unauthorized");
    if (!patientID) throw new Error("No patient ID");

    const baseSearchCriteria: Prisma.PatientHistoryWhereInput = {
        OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
        ],
    };

    let typeFilter: object;

    switch (filter) {
        case "medical":
            typeFilter = { type: "MEDICAL" };
            break;
        case "social":
            typeFilter = { type: "SOCIAL" };
            break;
        case "family":
            typeFilter = { type: "FAMILY" };
            break;
        case "allergy":
            typeFilter = { type: "ALLERGY" };
            break;
        case "all":
        default:
            typeFilter = {};
            break;
    }
    const result = await prisma.patientHistory.findMany({
        where: {
            patientId: patientID,
            ...typeFilter,
            ...baseSearchCriteria,
        },
        orderBy: {
            time: "desc",
        },
    });

    result.sort((a, b) => {
        return compareHistoryTypes(b.type, a.type);
    })

    return result;
}

export async function addHistory({
    patientID,
    name,
    description,
    type,
    time,
}: {
    patientID: number;
    name: string;
    description?: string;
    type: PatientHistoryType;
    time?: Date;
}): Promise<myError> {
    const session = await verifySession();
    if (session.role !== "DOCTOR") {
        return { success: false, message: "Unauthorized" };
    }

    try {
        await prisma.patientHistory.create({
            data: {
                patientId: patientID,
                name,
                description,
                type,
                time: time || new Date(), // Use provided time or default to current time
            },
        });

        revalidatePath(`/patients/${patientID}/history`);
        revalidatePath(`/patients/${patientID}/prescriptions/add`);
        return { success: true, message: "History added successfully" };
    } catch (error) {
        console.log(error);
        return { success: false, message: "Error adding history" };
    }
}

export async function deleteHistory({ id }: { id: number }) {
    const session = await verifySession();
    if (session.role !== "DOCTOR") {
        return { success: false, message: "Unauthorized" };
    }

    try {
        await prisma.patientHistory.delete({
            where: {
                id,
            },
        });
        return { success: true, message: "History deleted successfully" };
    } catch (error) {
        console.log(error);
        return { success: false, message: "Error deleting history" };
    }
}

export async function getHistoryCount({ patientID }: { patientID: number }) {
    return await prisma.patientHistory.count({
        where: {
            patientId: patientID,
        },
    });
}

export async function getAllHistory({ patientID }: { patientID: number }) {
    return await prisma.patientHistory.findMany({
        where: {
            patientId: patientID,
        },
        orderBy: {
            time: "desc",
        },
    });
}
