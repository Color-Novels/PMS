'use server'

import {myConfirmation, myError} from "@/app/lib/definitions";
import {prisma} from "@/app/lib/prisma";
import {DrugType, Prisma} from "@prisma/client";
import {revalidatePath} from "next/cache";
import {verifySession} from "@/app/lib/sessions";
import {PrescriptionFormData} from "@/app/(dashboard)/patients/[id]/prescriptions/add/_components/PrescriptionForm";
import {
    BrandOption, CustomDrugType, DrugOption,
    ConcentrationOption
} from "@/app/(dashboard)/patients/[id]/prescriptions/add/_components/IssueFromInventory";
import {VitalFormData} from "@/app/(dashboard)/admin/prescription/_components/AddVitalDialog";
import {redirect} from "next/navigation";
import {triggerQueueUpdate} from "@/app/lib/actions/queue";

export async function completePrescription(
    prescriptionID: number
): Promise<myError> {
    try {
        // Fetch prescription with related data in one query
        const prescription = await prisma.prescription.findUnique({
            where: {id: prescriptionID},
            include: {
                issues: {
                    include: {batch: true},
                },
                Charges: {
                    where: {
                        type: "MEDICINE"
                    }
                }
            },
        });

        // Validation checks before transaction

        if (!prescription) {
            return {success: false, message: "Prescription not found"};
        }

        if (prescription.status === "COMPLETED") {
            return {success: false, message: "Prescription already completed"};
        }

        // Check if all issues have batches
        const missingBatchIssue = prescription.issues.find(issue => !issue.batch || !issue.batchId);
        if (missingBatchIssue) {
            return {success: false, message: "Batch not found for a drug"};
        }

        // Check if final medicine cost is not calculated
        if (prescription.Charges.length === 0 || prescription.finalPrice === null) {
            return {
                success: false,
                message: "You have to generate bill at least once"
            }
        }

        // Perform all database operations in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // Prepare batch updates (more efficient than sequential updates)
            const batchUpdates = prescription.issues.map(issue =>
                tx.batch.update({
                    where: {id: issue.batchId!},
                    data: {
                        remainingQuantity: {
                            decrement: issue.quantity,
                        },
                    },
                })
            );

            // Execute batch updates in parallel
            await Promise.all(batchUpdates);

            // Update prescription status
            await tx.prescription.update({
                where: {id: prescriptionID},
                data: {status: "COMPLETED"},
            });

            // Check and update queue entry if exists
            const queueEntry = await tx.queueEntry.findFirst({
                where: {
                    patientId: prescription.patientId,
                    status: "PRESCRIBED",
                },
            });

            if (queueEntry) {
                await tx.queueEntry.update({
                    where: {id: queueEntry.id},
                    data: {status: "COMPLETED"},
                });
                return queueEntry.id;
            }

            return null;
        });

        // Handle revalidation after transaction
        revalidatePath(`/patients/${prescription.patientId}/prescriptions`);
        if (result) {
            await triggerQueueUpdate();
        }

        return {
            success: true,
            message: "Prescription completed successfully",
        };
    } catch (error) {
        console.error("Error completing prescription:", error);
        return {
            success: false,
            message: "An error occurred while completing prescription",
        };
    }
}

export async function getCachedBatch({
                                         drugId,
                                         brandId,
                                         type,
                                         unitConcentrationId
                                     }: {
    drugId: number;
    brandId: number;
    unitConcentrationId: number;
    type: DrugType;
}) {
    return prisma.batchHistory.findUnique({
        where: {
            drugId_drugBrandId_type_unitConcentrationId: {
                unitConcentrationId,
                type,
                drugId,
                drugBrandId: brandId,
            }
        },
        select: {
            batchId: true,
        },
    });
}

export async function getBatches({
                                     drugID,
                                     brandID,
                                     type,
                                     concentrationID,
                                 }: {
    drugID: number;
    brandID: number;
    type: DrugType;
    concentrationID: number;
}) {
    return prisma.batch.findMany({
        where: {
            drugId: drugID,
            drugBrandId: brandID,
            status: "AVAILABLE",
            type: type,
            unitConcentrationId: concentrationID,
        },
        select: {
            id: true,
            number: true,
            remainingQuantity: true,
            expiry: true,
        },
    });
}

export async function getPrescription(
    prescriptionID: number,
    patientID: number
) {
    const session = await verifySession();

    return prisma.prescription.findUnique({
        where: {
            id: prescriptionID,
            patientId: patientID,
            ...(session.role !== "DOCTOR" && {status: "PENDING"}),
        },
        include: {
            issues: {
                include: {
                    drug: true,
                    brand: true,
                    batch: true,
                    unitConcentration: true,
                },
            },
            OffRecordMeds: true,
            Charges: {
                where: {
                    type: 'PROCEDURE',
                },
            },
            ...(session.role === "DOCTOR"
                ? {
                    PrescriptionVitals: {
                        include: {
                            vital: true,
                        },
                    },
                }
                : {}),
        },
    });
}


//For prescriptions page
export async function getPrescriptionsCount(patientID: number) {
    return prisma.prescription.count({
        where: {
            patientId: patientID,
        },
    });
}

export async function searchPrescriptions({
                                              patientID,
                                              query,
                                              filter,
                                              take,
                                              skip,
                                          }: {
    patientID: number;
    query: string;
    filter: string;
    take: number;
    skip: number;
}) {
    let where = {};
    let select: Prisma.PrescriptionSelect = {};
    const session = await verifySession();

    if (query) {
        if (filter === "symptom") {
            where = {
                presentingSymptoms: {
                    contains: query,
                    mode: 'insensitive',
                },
            };
        }
        if (filter === "drug") {
            where = {
                OR: [
                    {
                        issues: {
                            some: {
                                drug: {
                                    name: {
                                        contains: query,
                                        mode: 'insensitive',
                                    },
                                },
                            },
                        },
                    },
                    {
                        OffRecordMeds: {
                            some: {
                                name: {
                                    contains: query,
                                    mode: 'insensitive',
                                },
                            },
                        },
                    },
                ],
            };
        }
    }

    // Only pending prescriptions can be viewed by non-doctor users
    if (session.role !== "DOCTOR") {
        where = {
            ...where,
            status: "PENDING",
        };
    }

    if (session.role === 'DOCTOR') {
        select = {
            PrescriptionVitals: {
                select: {
                    value: true,
                    vital: {
                        select: {
                            color: true,
                            icon: true,
                            name: true,
                        }
                    },
                },
            },
        }
    }

    return prisma.prescription.findMany({
        where: {
            patientId: patientID,
            ...where,
        },
        take,
        skip,
        orderBy: {
            time: "desc",
        },
        select: {
            id: true,
            time: true,
            presentingSymptoms: true,
            details: true,
            status: true,
            issues: {
                select: {
                    drug: {
                        select: {
                            name: true
                        }
                    }
                }
            },
            OffRecordMeds: {
                select: {
                    name: true,
                },
            },
            Charges: true,
            ...select,
        },
    });
}

export async function searchPrescriptionCount({
                                                  patientID,
                                                  query,
                                                  filter,
                                              }: {
    patientID: number;
    query: string;
    filter: string;
}) {
    let where = {};

    if (query) {
        if (filter === "symptom") {
            where = {
                presentingSymptoms: {
                    contains: query,
                    mode: 'insensitive',
                },
            };
        }
        if (filter === "drug") {
            where = {
                OR: [
                    {
                        issues: {
                            some: {
                                drug: {
                                    name: {
                                        contains: query,
                                        mode: 'insensitive',
                                    },
                                },
                            },
                        },
                    },
                    {
                        OffRecordMeds: {
                            some: {
                                name: {
                                    contains: query,
                                    mode: 'insensitive',
                                },
                            },
                        },
                    },
                ],
            };
        }
    }

    return prisma.prescription.count({
        where: {
            patientId: patientID,
            ...where,
        },
    });
}

export async function addPrescription({
                                          prescriptionForm,
                                          patientID,
                                      }: {
    prescriptionForm: PrescriptionFormData;
    patientID: number;
}): Promise<myError> {
    try {
        // Session verification moved to the beginning to fail fast
        const session = await verifySession();
        if (session.role !== "DOCTOR") {
            redirect('/unauthorized');
        }

        // Early validation checks
        if (!prescriptionForm.issues.length && !prescriptionForm.offRecordMeds.length) {
            return {
                success: false,
                message: "At least one prescription is required please add at least one from off record or from inventory",
            };
        }

        // Check for repeated drugs more efficiently
        const drugIds = prescriptionForm.issues.map(issue => issue.drugId);
        const uniqueDrugs = new Set(drugIds);
        if (uniqueDrugs.size < drugIds.length) {
            return {
                success: false,
                message: "Repeated drugs are not allowed in a single prescription",
            };
        }

        // Pre-process data outside of transaction to minimize transaction time
        const issuesData = prescriptionForm.issues.map(issue => ({
            drugId: issue.drugId,
            details: issue.details,
            brandId: issue.brandId,
            strategy: issue.strategy,
            quantity: issue.quantity,
            meal: issue.meal,
            dose: issue.dose,
            type: issue.drugType,
            unitConcentrationId: issue.concentrationID,
        }));

        const offRecordMedsData = prescriptionForm.offRecordMeds.map(med => ({
            name: med.name,
            description: med.description,
        }));

        const vitalsData = prescriptionForm.vitals
            .filter(vital => vital.value !== "")
            .map(vital => ({
                vitalId: vital.id,
                value: vital.value,
            }));

        const chargesData = prescriptionForm.charges.map(charge => ({
            value: charge.value,
            type: charge.type,
            name: charge.name,
            description: charge.description,
        }));

        // Execute database operations in a transaction with optimized queries
        const queueId = await prisma.$transaction(async (tx) => {
            // Create prescription with all related data in one operation
            const prescription = await tx.prescription.create({
                data: {
                    patientId: patientID,
                    presentingSymptoms: prescriptionForm.presentingSymptoms,
                    details: prescriptionForm.description,
                    status: "PENDING",
                    issues: {create: issuesData},
                    OffRecordMeds: {create: offRecordMedsData},
                    PrescriptionVitals: {create: vitalsData},
                    Charges: {create: chargesData},
                },//
                select: {
                    id: true,
                    issues: {select: {id: true, drugId: true}}
                },
            });

            // Update queue status if needed - using findFirst with select for minimum data
            const queueEntry = await tx.queueEntry.findFirst({
                where: {
                    patientId: patientID,
                    status: "PENDING",
                },
                select: {id: true}
            });

            if (queueEntry) {
                await tx.queueEntry.update({
                    where: {id: queueEntry.id},
                    data: {status: "PRESCRIBED"},
                });
            }

            // Batch strategy history updates with more efficient operation
            await tx.stratergyHistory.createMany({
                data: prescription.issues.map(issue => ({
                    drugId: issue.drugId,
                    issueId: issue.id,
                })),
                skipDuplicates: true, // This replaces the upsert operation
            });

            return queueEntry?.id;
        });

        // Handle path revalidation and queue updates after successful transaction
        if (queueId) {
            await triggerQueueUpdate();
        }
        revalidatePath(`/patients/${patientID}/prescriptions`);
        return {
            success: true,
            message: "Prescription created successfully",
        };
    } catch (e) {
        if (e instanceof Error) {
            console.error(e.message);
        }
        return {
            success: false,
            message: "An error occurred while adding prescription",
        };
    }
}

export async function getCachedStrategy(drugID: number) {
    return prisma.stratergyHistory.findUnique({
        where: {
            drugId: drugID,
        },
        select: {
            issueId: true,
            issue: {
                select: {
                    strategy: true,
                    brandId: true,
                    dose: true,
                    meal: true,
                    details: true,
                    quantity: true,
                    unitConcentrationId: true,
                    type: true,
                }
            }
        },
    });
}

export async function searchAvailableDrugs(term: string): Promise<DrugOption[]> {
    return prisma.drug
        .findMany({
            where: {
                name: {
                    startsWith: term,
                    mode: "insensitive",
                },
                batch: {
                    some: {
                        status: "AVAILABLE",
                    },
                },
            },
            select: {
                id: true,
                name: true,
            },
        })
        .then((drugs) =>
            drugs.map((drug) => ({
                id: drug.id,
                name: drug.name,
            }))
        );
}

export async function getConcentrationByDrug({
                                                 drugID,
                                                 type
                                             }: {
    drugID: number;
    type: DrugType;
}): Promise<ConcentrationOption[]> {
    const results = await prisma.batch.groupBy({
        by: ['unitConcentrationId'],
        where: {
            drugId: drugID,
            type: type,
            status: 'AVAILABLE',
        },
        _max: {
            expiry: true,
        },
        _count: {
            drugBrandId: true,
        },
        _sum: {
            remainingQuantity: true,
        },
    });

    const concentrations = await prisma.unitConcentration.findMany({
        where: {
            id: {in: results.map(r => r.unitConcentrationId)}
        },
        select: {
            id: true,
            concentration: true,
        }
    });

    return results.map(result => {
        const concentration = concentrations.find(c => c.id === result.unitConcentrationId);
        return {
            id: result.unitConcentrationId,
            concentration: concentration ? concentration.concentration.toString() : "Unknown",
            brandCount: result._count.drugBrandId,
            totalRemainingQuantity: result._sum.remainingQuantity || 0,
            farthestExpiry: result._max.expiry!,
        };
    });
}


export async function getBrandByDrugConcentrationType({
                                                          drugID,
                                                          concentrationID,
                                                          type,
                                                      }: {
    drugID: number;
    concentrationID: number;
    type: DrugType;
}): Promise<BrandOption[]> {
    const results = await prisma.batch.groupBy({
        by: ['drugBrandId'],
        where: {
            drugId: drugID,
            unitConcentrationId: concentrationID,
            type: type,
            status: 'AVAILABLE',
        },
        _max: {
            expiry: true,
        },
        _sum: {
            remainingQuantity: true,
        },
        _count: {
            id: true,
        }
    });

    const brands = await prisma.drugBrand.findMany({
        where: {
            id: {in: results.map(r => r.drugBrandId)}
        },
        select: {
            id: true,
            name: true,
        }
    });


    return results.map(result => {
        const brand = brands.find(b => b.id === result.drugBrandId);
        return {
            id: result.drugBrandId,
            name: brand ? brand.name : "Unknown",
            totalRemainingQuantity: result._sum.remainingQuantity || 0,
            batchCount: result._count.id,
            farthestExpiry: result._max.expiry!,
        };
    });
}

export async function getDrugTypesByDrug(drugID: number): Promise<CustomDrugType[]> {
    return prisma.batch.findMany({
        where: {
            drugId: drugID,
            status: 'AVAILABLE'
        },
        distinct: ['type'],
        select: {
            type: true,
        }
    }).then((types) => {
        return types.map((type) => ({
            name: type.type.toString(),
            type: type.type
        }));
    });
}

export async function getAllVitals() {
    return prisma.vitals.findMany({
        orderBy: {
            id: "asc",
        }
    });
}

export async function getPatientSpecificVitals(patientID: number) {
    // Fetch the patient to get their gender
    const patient = await prisma.patient.findUnique({
        where: {
            id: patientID,
        }
    });

    if (!patient) {
        throw new Error("Patient not found");
    }

    return prisma.vitals.findMany({
        where: {
            OR: [
                {forGender: null}, // Include vitals with no gender restriction
                {forGender: patient.gender}, // Include vitals specific to the patient's gender
            ],
        },
        orderBy: {
            id: "asc",
        }
    });
}

export async function addVital(vital: VitalFormData): Promise<myError> {


    if (!vital.name || !vital.icon || !vital.color || !vital.placeholder) {
        return {
            success: false,
            message: "All fields are required",
        };
    }

    const session = await verifySession();
    if (session.role !== 'DOCTOR') {
        redirect('/unauthorized');
    }

    const extVital = await prisma.vitals.findMany({
        where: {
            name: {
                equals: vital.name,
                mode: 'insensitive',
            }
        },
    })

    if (extVital.length > 0) {
        return {
            success: false,
            message: "Vital already exists",
        };
    }

    await prisma.vitals.create({
        data: {
            icon: vital.icon,
            color: vital.color,
            name: vital.name,
            placeholder: vital.placeholder,
            forGender: vital.forGender,
            type: vital.type
        }
    });

    revalidatePath('/admin/prescription');
    return {
        success: true,
        message: "Vital added successfully",
    };
}

export async function updateVital(vital: VitalFormData): Promise<myError> {
    if (!vital.id || !vital.name || !vital.icon || !vital.color || !vital.placeholder) {
        return {
            success: false,
            message: "All fields are required",
        };
    }

    const session = await verifySession();
    if (session.role !== 'DOCTOR') {
        redirect('/unauthorized');
    }

    // check if type changed
    const extVital = await prisma.vitals.findUnique({
        where: {
            id: vital.id, // Ensure `vital.id` is a valid integer
        },
        include: {
            _count: {
                select: {
                    PrescriptionVitals: true,
                },
            },
        },
    });

    if (!extVital) {
        return {
            success: false,
            message: "Vital not found",
        };
    } else {
        if (extVital.type !== vital.type) {
            if (extVital._count.PrescriptionVitals > 0) {
                return {
                    success: false,
                    message: "Vital type cannot be changed as it is already in use",
                };
            }
        }
    }


    await prisma.vitals.update({
        where: {
            id: vital.id
        },
        data: {
            icon: vital.icon,
            color: vital.color,
            name: vital.name,
            placeholder: vital.placeholder,
            forGender: vital.forGender,
            type: vital.type
        }
    });

    revalidatePath('/admin/prescription');
    return {
        success: true,
        message: "Vital updated successfully",
    };
}


export async function safeDeleteVital(vitalID: number): Promise<myError | myConfirmation> {
    const session = await verifySession();
    if (session.role !== 'DOCTOR') {
        redirect('/unauthorized');
    }

    const extVital = await prisma.vitals.findUnique({
        where: {
            id: vitalID,
        },
        include: {
            _count: {
                select: {
                    PrescriptionVitals: true,
                },
            },
        },
    });

    if (!extVital) {
        return {
            success: false,
            message: "Vital not found",
        };
    }

    if (extVital._count.PrescriptionVitals > 0) {
        return {
            confirmationRequired: true,
            message: `Vital is in use in ${extVital._count.PrescriptionVitals} prescriptions. Are you sure you want to delete it with all its data?`,
        }
    }

    await prisma.vitals.delete({
        where: {
            id: vitalID,
        },
    });

    revalidatePath('/admin/prescription');
    return {
        success: true,
        message: "Vital deleted successfully",
    };
}

export async function deleteVital(vitalID: number): Promise<myError> {
    const session = await verifySession();
    if (session.role !== 'DOCTOR') {
        redirect('/unauthorized');
    }

    try {
        await prisma.vitals.delete({
            where: {
                id: vitalID,
            },
        });

        revalidatePath('/admin/prescription');
        return {
            success: true,
            message: "Vital deleted successfully",
        };
    } catch (e) {
        console.error("Error deleting vital:", e);
        return {
            success: false,
            message: "An error occurred while deleting vital",
        };
    }
}