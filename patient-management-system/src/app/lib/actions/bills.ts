"use server";

import { BatchAssignPayload } from "@/app/(dashboard)/patients/[id]/prescriptions/[prescriptionID]/_components/BatchAssign";
import { Bill, myBillError } from "@/app/lib/definitions";
import { prisma } from "@/app/lib/prisma";
import { ChargeType, Prisma } from "@prisma/client";
import { getFinalBillSummary } from "../utils";

export async function calculateBill({
    prescriptionData,
}: {
    prescriptionData: BatchAssignPayload;
}): Promise<myBillError> {
    const prescriptionID = prescriptionData.prescriptionID;
    const batchAssignments = prescriptionData.batchAssigns;

    try {
        // Increase the transaction timeout to 10000ms
        return await prisma.$transaction(
            async (prisma): Promise<myBillError> => {
                // 1. Fetch prescription and fees in parallel to save time
                const [prescription, issues] = await Promise.all([
                    prisma.prescription.findUnique({
                        where: { id: prescriptionID },
                        include: {
                            patient: {
                                select: {
                                    name: true,
                                },
                            },
                            Charges: true,
                        },
                    }),
                    prisma.issue.findMany({
                        where: {
                            id: {
                                in: batchAssignments.map(
                                    (assign) => assign.issueID
                                ),
                            },
                        },
                    }),
                ]);

                if (!prescription) {
                    return {
                        success: false,
                        message: "Prescription not found",
                    };
                }

                if (prescription.status === "COMPLETED") {
                    return {
                        success: false,
                        message: "Prescription already completed",
                    };
                }

                // 4. Initialize bill object
                const bill: Bill = {
                    prescriptionID,
                    patientName: prescription.patient.name,
                    patientID: prescriptionData.patientID,
                    entries: [],
                    charges: prescription.Charges.map((item) => ({
                        name: item.name,
                        value: item.value,
                        description: item.description ? item.description : "",
                        type: item.type,
                    })),
                };

                const medicineCost = {
                    name: "Medicines Cost",
                    value: 0,
                    type: ChargeType.MEDICINE,
                    description: "Cost for the medicines",
                    prescriptionId: prescription.id,
                };

                // 5. Fetch all batches at once instead of in loop
                // Filter out any null or undefined batch IDs and ensure we have the right number
                const validBatchAssignments = batchAssignments.filter(
                    (assign) =>
                        assign.batchID !== null && assign.batchID !== undefined
                );

                if (validBatchAssignments.length !== batchAssignments.length) {
                    return {
                        success: false,
                        message: `Batch not found for a drug`,
                    };
                }

                // Extract the batch IDs as a non-null array
                const batchIds: number[] = validBatchAssignments.map(
                    (assign) => assign.batchID!
                );

                const batches = await prisma.batch.findMany({
                    where: { id: { in: batchIds } },
                    include: { drug: true, drugBrand: true },
                });

                // Verify all batches were found
                if (batches.length !== batchIds.length) {
                    return {
                        success: false,
                        message: `Some batches were not found`,
                    };
                }

                // Create a map for easier access
                const batchMap = new Map(
                    batches.map((batch) => [batch.id, batch])
                );
                const issueMap = new Map(
                    issues.map((issue) => [issue.id, issue])
                );

                // 6. Prepare batch history updates and issue updates for bulk operations
                const batchHistories = [];
                const issueUpdates = [];
                const batchHistoryKeys = new Set();

                for (const assign of batchAssignments) {
                    // Safely check and get the batch ID and issue ID
                    const batchID = assign.batchID;
                    const issueID = assign.issueID;

                    if (batchID === null || batchID === undefined) {
                        return {
                            success: false,
                            message: `Batch ID is missing`,
                        };
                    }

                    if (issueID === null || issueID === undefined) {
                        return {
                            success: false,
                            message: `Issue ID is missing`,
                        };
                    }

                    const batch = batchMap.get(batchID);
                    const issue = issueMap.get(issueID);

                    if (!batch) {
                        return {
                            success: false,
                            message: `Batch not found for drug ${batchID}`,
                        };
                    }

                    if (!issue) {
                        return {
                            success: false,
                            message: `Issue not found for drug ${issueID}`,
                        };
                    }

                    // Prepare issue update - ensure batchId is not null
                    issueUpdates.push(
                        prisma.issue.update({
                            where: { id: issueID },
                            data: { batchId: batchID },
                        })
                    );

                    // Prepare batch history upsert (avoiding duplicates)
                    const historyKey = `${batch.drugId}-${batch.drugBrandId}-${batch.type}-${batch.unitConcentrationId}`;
                    if (!batchHistoryKeys.has(historyKey)) {
                        batchHistoryKeys.add(historyKey);
                        batchHistories.push(
                            prisma.batchHistory.upsert({
                                where: {
                                    drugId_drugBrandId_type_unitConcentrationId:
                                        {
                                            drugId: batch.drugId,
                                            drugBrandId: batch.drugBrandId,
                                            type: batch.type,
                                            unitConcentrationId:
                                                batch.unitConcentrationId,
                                        },
                                },
                                update: { batchId: batchID },
                                create: {
                                    drugId: batch.drugId,
                                    drugBrandId: batch.drugBrandId,
                                    type: batch.type,
                                    unitConcentrationId:
                                        batch.unitConcentrationId,
                                    batchId: batchID,
                                },
                            })
                        );
                    }

                    // Calculate cost and add entry to bill
                    const batchCost = issue.quantity * batch.retailPrice;
                    medicineCost.value += Number(batchCost.toFixed(2));

                    bill.entries.push({
                        drugName: batch.drug.name,
                        brandName: batch.drugBrand.name,
                        quantity: issue.quantity,
                        unitPrice: batch.retailPrice,
                    });
                }

                // 7. Execute batch operations in parallel
                await Promise.all([...batchHistories, ...issueUpdates]);

                // 8. Update final medicine charges
                // First, find any existing MEDICINE charges
                const existingMedicineCharges = prescription.Charges.filter(
                    (charge) => charge.type === "MEDICINE"
                );

                // Remove any existing MEDICINE charges from the bill object
                bill.charges = bill.charges.filter(
                    (charge) => charge.type !== "MEDICINE"
                );

                // Update database
                if (existingMedicineCharges.length === 1) {
                    // If there's exactly one medicine charge, update it
                    await prisma.prescriptionCharges.update({
                        where: {
                            id: existingMedicineCharges[0].id,
                        },
                        data: medicineCost,
                    });
                } else {
                    // If there are zero or multiple medicine charges, delete them all and create a new one
                    // First delete any existing medicine charges
                    if (existingMedicineCharges.length > 0) {
                        await prisma.prescriptionCharges.deleteMany({
                            where: {
                                id: {
                                    in: existingMedicineCharges.map(
                                        (charge) => charge.id
                                    ),
                                },
                            },
                        });
                    }

                    // Then create a new medicine charge
                    await prisma.prescriptionCharges.create({
                        data: {
                            ...medicineCost,
                            prescriptionId: prescription.id, // Make sure to include the prescription ID
                        },
                    });
                }

                // Now push the updated medicine cost to bill
                bill.charges.push(medicineCost);
                const { total } = getFinalBillSummary(bill);

                // 9. Update prescription status and total cost
                await prisma.prescription.update({
                    where: { id: prescriptionID },
                    data: {
                        finalPrice: total,
                    },
                });

                return {
                    success: true,
                    message: "Bill calculated successfully",
                    bill,
                };
            },
            {
                timeout: 10000, // Increase timeout to 10 seconds
            }
        );
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            console.error(error.message);
        }
        return {
            success: false,
            message: "An error occurred while calculating bill",
        };
    }
}

export async function getBill(prescriptionID: number): Promise<Bill> {
    const prescription = await prisma.prescription.findUnique({
        where: { id: prescriptionID },
        include: {
            patient: {
                select: {
                    name: true,
                },
            },
            issues: {
                include: {
                    batch: true,
                    drug: true,
                    brand: true,
                },
            },
            Charges: true,
        },
    });

    if (!prescription) {
        throw new Error("Prescription not found");
    }

    if (
        prescription.status === "PENDING" ||
        !prescription.issues.every((issue) => issue.batch)
    ) {
        throw new Error("Prescription not completed");
    }

    return {
        patientName: prescription.patient.name,
        prescriptionID,
        patientID: prescription.patientId,
        entries: prescription.issues.map((issue) => ({
            drugName: issue.drug.name,
            brandName: issue.brand.name,
            quantity: issue.quantity,
            unitPrice: issue.batch?.retailPrice ?? 0,
        })),
        charges: prescription.Charges.map((charge) => ({
            ...charge,
            description: charge.description ? charge.description : "",
        })),
    };
}
