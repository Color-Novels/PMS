'use server'

import {myError} from "@/app/lib/definitions";
import {prisma} from "@/app/lib/prisma";
import {ChargeType, Prisma} from "@prisma/client";
import {verifySession} from "@/app/lib/sessions";
import {redirect} from "next/navigation";
import {FeeInForm} from "@/app/(dashboard)/admin/fees/_components/FeeForm";

export async function updateCharges({
                                        charges,
                                    }: {
    charges: FeeInForm[];
}): Promise<myError> {
    try {
        // Filter only charges that were updated
        const session = await verifySession();
        if (session.role !== 'DOCTOR') {
            redirect('/unauthorized');
        }
        const updatedCharges = charges.filter(charge => charge.updated);

        if (updatedCharges.length === 0) {
            return {
                success: true,
                message: "No changes to update",
            };
        }

        // Check for negative values
        const negativeCharges = updatedCharges.filter(charge => charge.value < 0);
        if (negativeCharges.length > 0) {
            return {
                success: false,
                message: "Charge values cannot be negative",
            };
        }

        // Use transaction for atomic operation
        const result = await prisma.$transaction(
            updatedCharges.map(charge =>
                prisma.charge.upsert({
                    where: {
                        id: charge.id,
                    },
                    update: {
                        name: charge.name,
                        value: charge.value,
                    },
                    create: {
                        name: charge.name,
                        value: charge.value,
                        type: charge.type as ChargeType,
                    }
                })
            )
        );
        return {
            success: true,
            message: `Successfully updated ${result.length} charge${result.length !== 1 ? 's' : ''}`,
        };
    } catch (e) {
        console.error("Charge update error:", e);
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            // Handle specific Prisma errors with more detailed messages
            if (e.code === 'P2002') {
                return {
                    success: false,
                    message: "A charge with this name already exists",
                };
            }
        }

        return {
            success: false,
            message: "An error occurred while updating charges",
        };
    }
}

export async function deleteCharge({id}: { id: number }): Promise<myError> {
    try {
        const session = await verifySession();
        if (session.role !== 'DOCTOR') {
            redirect('/unauthorized');
        }
        await prisma.charge.delete({
            where: {
                id,
            },
        });

        return {
            success: true,
            message: "Charge deleted successfully",
        };
    } catch (e) {
        console.error("Charge delete error:", e);

        return {
            success: false,
            message: "An error occurred while deleting charge",
        };
    }
}


export async function getCharges() {
    const session = await verifySession();
    if (session.role !== 'DOCTOR') {
        redirect('/unauthorized');
    }
    return prisma.charge.findMany();
}

export async function getChargesOnType({types}: { types: ChargeType[] }) {
    const session = await verifySession();
    if (session.role !== 'DOCTOR') {
        redirect('/unauthorized');
    }
    return prisma.charge.findMany({
        where: {
            type: {
                in: types,
            }
        },
    });
}