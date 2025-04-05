"use server";

import {revalidatePath} from "next/cache";
import {
    DateRange,
    DrugConcentrationDataSuggestion,
    InventoryFormData,
    myError,
    PatientFormData,
    SortOption,
    StockAnalysis,
    StockData,
    StockQueryParams,
} from "@/app/lib/definitions";
import {prisma} from "./prisma";
import {BatchStatus, DrugType} from "@prisma/client";
import {DrugBufferStatus} from "@/app/(dashboard)/inventory/buffer-level/page";

export async function getTotalPages(query = "", filter = "name") {
    const whereClause = query
        ? {
            [filter]: {contains: query, mode: "insensitive"},
        }
        : {};

    const totalPatients = await prisma.patient.count({where: whereClause});
    return Math.ceil(totalPatients / PAGE_SIZE);
}

export async function getFilteredPatients(
    query: string = "",
    page: number = 1,
    filter: string = "name"
) {
    const whereCondition = query
        ? {
            [filter]: {contains: query, mode: "insensitive"},
        }
        : {};

    return prisma.patient.findMany({
        where: whereCondition,
        take: PAGE_SIZE,
        skip: (page - 1) * PAGE_SIZE,
        orderBy: {name: "asc"},
    });
}

const PAGE_SIZE_AVAILABLE_DRUGS_BY_MODEL = 9;
const PAGE_SIZE_AVAILABLE_DRUGS_BY_BRAND = 9;
const PAGE_SIZE_AVAILABLE_DRUGS_BY_BATCH = 6;

// Function to get total pages for filtered drugs by model
export async function getTotalPagesForFilteredDrugsByModel({
                                                               query = "",
                                                               brandId = 0,
                                                           }: {
    query?: string;
    brandId?: number;
}) {
    const totalItems = await prisma.drug.count({
        where: {
            name: {
                contains: query,
                mode: "insensitive",
            },
            batch: {
                some: {
                    status: "AVAILABLE",
                    ...(brandId !== 0 ? {drugBrandId: brandId} : {}),
                },
            },
        },
    });

    return Math.ceil(totalItems / PAGE_SIZE_AVAILABLE_DRUGS_BY_MODEL);
}

// Function to get total pages for filtered drugs by brand
export async function getTotalPagesForFilteredDrugsByBrand({
                                                               query = "",
                                                               modelId = 0,
                                                           }: {
    query?: string;
    modelId?: number;
}) {
    if (modelId !== 0) {
        const uniqueBrandCount = await prisma.batch.groupBy({
            by: ["drugBrandId"],
            where: {
                drugId: modelId,
                status: "AVAILABLE",
            },
        });

        return Math.ceil(
            uniqueBrandCount.length / PAGE_SIZE_AVAILABLE_DRUGS_BY_BRAND
        );
    }

    const totalItems = await prisma.drugBrand.count({
        where: {
            name: {
                contains: query,
                mode: "insensitive",
            },
            Batch: {
                some: {
                    status: "AVAILABLE",
                },
            },
        },
    });

    return Math.ceil(totalItems / PAGE_SIZE_AVAILABLE_DRUGS_BY_BRAND);
}

interface whereCondition {
    status: BatchStatus;
    number: {
        contains: string;
        mode: "insensitive";
    };
    drugId?: number;
    drugBrandId?: number;
}

// Function to get total pages for filtered drugs by batch
export async function getTotalPagesForFilteredDrugsByBatch({
                                                               query = "",
                                                               modelId = 0,
                                                               brandId = 0,
                                                           }: {
    query?: string;
    modelId?: number;
    brandId?: number;
}) {
    const whereCondition: whereCondition = {
        status: "AVAILABLE",
        number: {
            contains: query,
            mode: "insensitive",
        },
    };

    if (modelId !== 0) whereCondition.drugId = Number(modelId);
    if (brandId !== 0) whereCondition.drugBrandId = Number(brandId);

    const totalItems = await prisma.batch.count({
        where: whereCondition,
    });

    return Math.ceil(totalItems / PAGE_SIZE_AVAILABLE_DRUGS_BY_BATCH);
}

export async function getFilteredDrugsByModel({
                                                  query = "",
                                                  page = 1,
                                                  sort = "alphabetically",
                                                  brandId = 0,
                                              }: {
    query?: string;
    page?: number;
    sort?: string;
    brandId?: number;
}) {
    const drugs = await prisma.drug.findMany({
        where: {
            name: {
                contains: query,
                mode: "insensitive",
            },
            batch: {
                some: {
                    status: "AVAILABLE",
                    ...(brandId !== 0 ? {drugBrandId: brandId} : {}), // Filter by brandId if it's not 0
                },
            },
        },
        include: {
            batch: {
                where: {
                    status: "AVAILABLE",
                    ...(brandId !== 0 ? {drugBrandId: brandId} : {}), // Apply brandId filter
                },
                select: {
                    remainingQuantity: true,
                    drugBrand: {
                        select: {
                            id: true,
                        },
                    },
                },
            },
        },
    });

    // Filter out drugs with no available batches and aggregate remaining quantity
    const aggregatedDrugs = drugs
        .filter((drug) => drug.batch.length > 0)
        .map((drug) => {
            const uniqueBrandIds = new Set(
                drug.batch.map((batch) => batch.drugBrand.id)
            );

            return {
                id: drug.id,
                name: drug.name,
                totalRemainingQuantity: drug.batch.reduce(
                    (sum, batch) => sum + batch.remainingQuantity,
                    0
                ),
                brandCount: uniqueBrandIds.size, // Count unique brands associated with batches
            };
        });

    // Sorting logic
    if (sort === "lowest") {
        aggregatedDrugs.sort(
            (a, b) => a.totalRemainingQuantity - b.totalRemainingQuantity
        );
    } else if (sort === "highest") {
        aggregatedDrugs.sort(
            (a, b) => b.totalRemainingQuantity - a.totalRemainingQuantity
        );
    } else if (sort === "alphabetically") {
        aggregatedDrugs.sort((a, b) => a.name.localeCompare(b.name));
    }

    return aggregatedDrugs.slice(
        (page - 1) * PAGE_SIZE_AVAILABLE_DRUGS_BY_MODEL,
        page * PAGE_SIZE_AVAILABLE_DRUGS_BY_MODEL
    );
}

export async function getFilteredDrugsByBrand({
                                                  query = "",
                                                  page = 1,
                                                  sort = "alphabetically",
                                                  modelId = 0,
                                              }: {
    query?: string;
    page?: number;
    sort?: string;
    modelId?: number;
}) {
    if (modelId !== 0) {
        // Fetch all brands associated with the specified model
        const batches = await prisma.batch.findMany({
            where: {
                drugId: modelId,
                status: "AVAILABLE",
            },
            include: {
                drugBrand: true,
            },
        });

        const uniqueBrands = new Map();

        batches.forEach((batch) => {
            uniqueBrands.set(batch.drugBrand.id, {
                id: batch.drugBrand.id,
                name: batch.drugBrand.name,
                modelCount: 1, // Since it's a specific model
            });
        });

        return Array.from(uniqueBrands.values());
    }

    // Fetch all drug brands with available batches
    const brands = await prisma.drugBrand.findMany({
        where: {
            name: {
                contains: query,
                mode: "insensitive",
            },
        },
        include: {
            Batch: {
                where: {
                    status: "AVAILABLE",
                },
                include: {
                    drug: true,
                },
            },
        },
    });

    // Aggregate brands with available models
    const aggregatedBrands = brands
        .map((brand) => ({
            id: brand.id,
            name: brand.name,
            modelCount: new Set(brand.Batch.map((batch) => batch.drug.id)).size, // Count unique drug models
        }))
        .filter((brand) => brand.modelCount > 0);

    // Sorting logic
    if (sort === "lowest") {
        aggregatedBrands.sort((a, b) => a.modelCount - b.modelCount);
    } else if (sort === "highest") {
        aggregatedBrands.sort((a, b) => b.modelCount - a.modelCount);
    } else if (sort === "alphabetically") {
        aggregatedBrands.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Pagination
    return aggregatedBrands.slice(
        (page - 1) * PAGE_SIZE_AVAILABLE_DRUGS_BY_BRAND,
        page * PAGE_SIZE_AVAILABLE_DRUGS_BY_BRAND
    );
}

export async function getFilteredDrugsByBatch({
                                                  query = "",
                                                  page = 1,
                                                  sort = "expiryDate",
                                                  modelId = 0,
                                                  brandId = 0,
                                              }: {
    query?: string;
    page?: number;
    sort?: string;
    modelId?: number;
    brandId?: number;
}) {
    // Base where condition
    const whereCondition: whereCondition = {
        status: "AVAILABLE",
        number: {
            contains: query, // Search by batch number
            mode: "insensitive",
        },
    };

    // Apply modelId and brandId filters if provided
    if (modelId !== 0) whereCondition.drugId = Number(modelId);
    if (brandId !== 0) whereCondition.drugBrandId = Number(brandId);

    const batches = await prisma.batch.findMany({
        where: whereCondition,
        include: {
            drug: true,
            drugBrand: true,
            unitConcentration: true,
        },
    });

    const formattedBatches = batches.map((batch) => ({
        id: batch.id,
        batchNumber: batch.number,
        brandName: batch.drugBrand.name,
        modelName: batch.drug.name,
        expiryDate: batch.expiry.toISOString(),
        stockDate: batch.stockDate.toISOString(),
        remainingAmount: batch.remainingQuantity,
        fullAmount: batch.fullAmount,
        status: batch.status,
        unitConcentration: batch.unitConcentration.concentration,
        type: batch.type,
    }));

    // Sorting logic
    if (sort === "expiryDate") {
        formattedBatches.sort(
            (a, b) =>
                new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
        );
    } else if (sort === "newlyAdded") {
        formattedBatches.sort(
            (a, b) =>
                new Date(b.stockDate).getTime() - new Date(a.stockDate).getTime()
        );
    } else if (sort === "alphabetically") {
        formattedBatches.sort((a, b) => a.modelName.localeCompare(b.modelName));
    }

    // Pagination logic
    return formattedBatches.slice(
        (page - 1) * PAGE_SIZE_AVAILABLE_DRUGS_BY_BATCH,
        page * PAGE_SIZE_AVAILABLE_DRUGS_BY_BATCH
    );
}

export async function getPatientDetails(id: number) {
    return prisma.patient.findUnique({
        where: {
            id,
        },
    });
}

export async function addPatient({
                                     formData,
                                 }: {
    formData: PatientFormData;
}): Promise<myError> {
    try {
        const floatHeight = parseFloat(formData.height);

        const floatWeight = parseFloat(formData.weight);

        if (formData.gender === "") {
            return {success: false, message: "Select a valid Gender"};
        }

        if (!formData.name || !formData.telephone) {
            return {success: false, message: "Please fill all fields"};
        }

        if (formData.telephone.length !== 10) {
            return {success: false, message: "Invalid telephone number"};
        }

        const date = new Date(formData.birthDate);

        if (isNaN(date.getTime())) {
            return {success: false, message: "Invalid birth date"};
        }

        await prisma.patient.create({
            data: {
                name: formData.name,
                NIC: formData.NIC,
                telephone: formData.telephone,
                birthDate: date,
                address: formData.address,
                height: floatHeight,
                weight: floatWeight,
                gender: formData.gender,
            },
        });

        revalidatePath("/patients");
        return {success: true, message: "Patient added successfully"};
    } catch (e) {
        console.error(e);
        return {
            success: false,
            message: "An error occurred while adding patient",
        };
    }
}

export async function updatePatient(
    formData: PatientFormData,
    id: number
): Promise<myError> {
    try {
        const floatHeight = parseFloat(formData.height);
        const floatWeight = parseFloat(formData.weight);

        if (formData.gender === "") {
            return {success: false, message: "Select a valid Gender"};
        }

        if (!formData.name || !formData.telephone) {
            return {success: false, message: "Please fill all fields"};
        }

        const date = new Date(formData.birthDate);

        if (isNaN(date.getTime())) {
            return {success: false, message: "Invalid birth date"};
        }

        await prisma.patient.update({
            where: {id},
            data: {
                name: formData.name,
                NIC: formData.NIC,
                telephone: formData.telephone,
                birthDate: date,
                address: formData.address,
                height: floatHeight,
                weight: floatWeight,
                gender: formData.gender,
            },
        });

        revalidatePath(`/patients/${id}`);
        return {success: true, message: "Patient updated successfully"};
    } catch (e) {
        console.error(e);
        return {
            success: false,
            message: "An error occurred while updating patient",
        };
    }
}

//suggest supplier information
export async function searchSuppliers(query: string) {
    "use server";

    try {
        return await prisma.supplier.findMany({
            where: {
                name: {
                    contains: query,
                    mode: "insensitive",
                },
            },
            select: {
                id: true,
                name: true,
                contact: true,
            },
            take: 5, // Limit results
        });
    } catch (error) {
        console.error("Error searching suppliers:", error);
        return [];
    }
}

//For adding drugs to the inventory
export async function addNewItem({
                                     formData,
                                 }: {
    formData: InventoryFormData;
}): Promise<myError> {
    try {
        // Check all the required fields
        if (
            !formData.concentrationId ||
            !formData.concentration ||
            !formData.batchNumber ||
            !formData.drugType ||
            !formData.quantity ||
            !formData.expiry ||
            !formData.retailPrice ||
            !formData.wholesalePrice ||
            !formData.supplierName ||
            !formData.Buffer ||
            !formData.supplierContact
        ) {
            return {success: false, message: "Please fill all fields"};
        }

        return await prisma.$transaction(async (tx) => {
            // 1. Create or connect drug brand
            const brand = await tx.drugBrand.upsert({
                where: {id: formData.brandId ?? 0},
                update: {},
                create: {
                    name: formData.brandName,
                    description: formData.brandDescription || null,
                },
            });

            // 2. Create or connect drug
            const drug = await tx.drug.upsert({
                where: {id: formData.drugId ?? 0},
                update: {},
                create: {
                    name: formData.drugName,
                },
            });

            // 3. Create or connect supplier
            const supplier = await tx.supplier.upsert({
                where: formData.supplierId
                    ? {id: formData.supplierId}
                    : {name: formData.supplierName},
                update: {
                    contact: formData.supplierContact, // Update contact info in case it changed
                },
                create: {
                    name: formData.supplierName,
                    contact: formData.supplierContact || "N/A",
                },
            });

            // 4. Create batch with both drug and brand relationships
            if (
                formData.concentrationId === undefined ||
                formData.concentration === undefined
            ) {
                return {success: false, message: "Please select a concentration"};
            }

            let newConcentrationId: number;

            if (formData.concentrationId === -1) {
                const newConcentration = await tx.unitConcentration.upsert({
                    where: {concentration: formData.concentration},
                    update: {},
                    create: {
                        concentration: formData.concentration,
                    },
                });
                newConcentrationId = newConcentration.id;
            } else {
                newConcentrationId = formData.concentrationId;
            }

            await tx.batch.create({
                data: {
                    number: formData.batchNumber,
                    drug: {
                        connect: {id: drug.id},
                    },
                    drugBrand: {
                        connect: {id: brand.id},
                    },
                    type: formData.drugType as DrugType,
                    fullAmount: parseFloat(formData.quantity.toString()),
                    remainingQuantity: parseFloat(formData.quantity.toString()),
                    expiry: new Date(formData.expiry),
                    retailPrice: parseFloat(formData.retailPrice.toString()),
                    wholesalePrice: parseFloat(formData.wholesalePrice.toString()),
                    unitConcentration: {
                        connect: {id: newConcentrationId},
                    },
                    Supplier: {
                        connect: {id: supplier.id}, // Connect the batch to the supplier
                    },
                    status: "AVAILABLE",
                },
            });

            // 6. Create or update BufferLevel for the drug
            await tx.bufferLevel.upsert({
                where: {
                    drugId_type_unitConcentrationId: {
                        drugId: drug.id,
                        type: formData.drugType as DrugType,
                        unitConcentrationId: newConcentrationId,
                    },
                },
                update: {
                    bufferAmount: formData.Buffer, // Update buffer amount if it already exists
                },
                create: {
                    drugId: drug.id,
                    type: formData.drugType as DrugType,
                    unitConcentrationId: newConcentrationId,
                    bufferAmount: formData.Buffer, // Create new buffer level
                },
            });

            revalidatePath("/inventory/available-stocks");
            return {success: true, message: "Item added successfully"};
        });
    } catch (e) {
        if (e instanceof Error) {
            console.error(e.message);
        } else {
            console.error(e);
        }
        return {success: false, message: "Failed to add item"};
    }
}

export async function getBatchData(batchId: number) {
    try {
        const batchData = await prisma.batch.findUnique({
            where: {
                id: batchId,
            },
            include: {
                drug: {
                    select: {
                        name: true,
                    },
                },
                drugBrand: {
                    select: {
                        name: true,
                    },
                },
                Supplier: {
                    select: {
                        name: true,
                    },
                },
                unitConcentration: true,
            },
        });

        if (!batchData) {
            throw new Error("Batch not found");
        }

        return {
            number: batchData.number,
            drugName: batchData.drug.name,
            drugBrandName: batchData.drugBrand.name,
            drugType: batchData.type,
            fullAmount: batchData.fullAmount,
            remainingQuantity: batchData.remainingQuantity,
            expiryDate: batchData.expiry.toISOString().split("T")[0], // Format to 'YYYY-MM-DD'
            stockDate: batchData.stockDate.toISOString().split("T")[0], // Format to 'YYYY-MM-DD'
            retailPrice: batchData.retailPrice,
            wholesalePrice: batchData.wholesalePrice,
            supplier: batchData.Supplier.name,
            status: batchData.status,
            unitConcetration: batchData.unitConcentration.concentration,
        };
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

export async function handleConfirmationOfBatchStatusChange(
    batchId: number,
    action: "completed" | "disposed" | "quality_failed" | "available"
): Promise<myError> {
    if (!batchId) return {success: false, message: "Batch ID not provided"};

    const newStatus =
        action === "completed"
            ? "COMPLETED"
            : action === "disposed"
                ? "DISPOSED"
                : action === "quality_failed"
                    ? "QUALITY_FAILED"
                    : "AVAILABLE";
    try {
        await prisma.batch.update({
            where: {id: batchId},
            data: {status: newStatus},
        });

        revalidatePath(`/inventory/all-drugs/batch/${batchId}`);
        return {success: true, message: "Batch status updated successfully"};
    } catch (error) {
        console.error("Error updating batch status:", error);
        return {
            success: false,
            message: "An error occurred while updating batch status",
        };
    }
}

// Fetch functions for brand, drug, and batch data
export async function getBrandName(id: number): Promise<string> {
    try {
        const brand = await prisma.drugBrand.findUnique({
            where: {id},
            select: {name: true},
        });
        return brand?.name || `Brand-${id}`;
    } catch (error) {
        console.error("Error fetching brand name:", error);
        return `Brand-${id}`;
    }
}

export async function getDrugName(id: number): Promise<string> {
    try {
        const drug = await prisma.drug.findUnique({
            where: {id},
            select: {name: true},
        });
        return drug?.name || `Drug-${id}`;
    } catch (error) {
        console.error("Error fetching drug name:", error);
        return `Drug-${id}`;
    }
}

export async function getBatchNumber(id: number): Promise<string> {
    try {
        const batch = await prisma.batch.findUnique({
            where: {id},
            select: {number: true},
        });
        return batch?.number || `Batch-${id}`;
    } catch (error) {
        console.error("Error fetching batch number:", error);
        return `Batch-${id}`;
    }
}

const PAGE_SIZE = 10;

// Helper function to apply sorting
function applySorting(
    data: StockData[],
    sort: SortOption = "alphabetically"
): StockData[] {
    switch (sort) {
        case "alphabetically":
            return data.sort((a, b) => a.name.localeCompare(b.name));
        case "highest":
            return data.sort((a, b) => b.totalPrice - a.totalPrice);
        case "lowest":
            return data.sort((a, b) => a.totalPrice - b.totalPrice);
        case "unit-highest":
            return data.sort((a, b) => {
                const aUnit = a.retailPrice || 0;
                const bUnit = b.retailPrice || 0;
                return bUnit - aUnit;
            });
        case "unit-lowest":
            return data.sort((a, b) => {
                const aUnit = a.retailPrice || 0;
                const bUnit = b.retailPrice || 0;
                return aUnit - bUnit;
            });
        default:
            return data;
    }
}

// Get total pages for pagination
export async function getAvailableDrugsTotalPages(
    query: string,
    selection: string
): Promise<number> {
    let count = 0;

    switch (selection) {
        case "brand":
            count = await prisma.drugBrand.count({
                where: {
                    name: {contains: query},
                    Batch: {some: {status: "AVAILABLE"}},
                },
            });
            break;
        case "model":
            count = await prisma.drug.count({
                where: {
                    name: {contains: query},
                    batch: {some: {status: "AVAILABLE"}},
                },
            });
            break;
        case "batch":
            count = await prisma.batch.count({
                where: {
                    OR: [
                        {drug: {name: {contains: query}}},
                        {drugBrand: {name: {contains: query}}},
                    ],
                    status: "AVAILABLE",
                },
            });
            break;
    }

    return Math.ceil(count / PAGE_SIZE);
}

// Fetch stock grouped by model
export async function getStockByModel({
                                          query = "",
                                          page = 1,
                                          sort = "alphabetically",
                                          startDate,
                                          endDate,
                                      }: StockQueryParams): Promise<StockData[]> {
    const drugs = await prisma.drug.findMany({
        where: {
            name: {contains: query, mode: "insensitive"},
            batch: {
                some: {
                    // status: "AVAILABLE",
                    ...(startDate && endDate
                        ? {
                            stockDate: {
                                gte: startDate,
                                lte: endDate,
                            },
                        }
                        : {}),
                },
            },
        },
        include: {
            batch: {
                where: {
                    // status: "AVAILABLE",
                    ...(startDate && endDate
                        ? {
                            stockDate: {
                                gte: startDate,
                                lte: endDate,
                            },
                        }
                        : {}),
                },
                select: {
                    wholesalePrice: true,
                    retailPrice: true,
                    remainingQuantity: true,
                },
            },
        },
    });

    const stockData: StockData[] = drugs.map((drug) => ({
        id: drug.id,
        name: drug.name,
        totalPrice: drug.batch.reduce(
            (
                sum: number,
                batch: { retailPrice: number; remainingQuantity: number }
            ) => sum + batch.retailPrice * batch.remainingQuantity,
            0
        ),
    }));

    const sortedData = applySorting(stockData, sort as SortOption);
    return sortedData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
}

// Fetch stock grouped by batch
export async function getStockByBatch({
                                          query = "",
                                          page = 1,
                                          sort = "alphabetically",
                                          startDate,
                                          endDate,
                                      }: StockQueryParams): Promise<StockData[]> {
    const batches = await prisma.batch.findMany({
        where: {
            OR: [
                {drug: {name: {contains: query, mode: "insensitive"}}},
                {drugBrand: {name: {contains: query, mode: "insensitive"}}},
                {number: {contains: query, mode: "insensitive"}},
                {Supplier: {name: {contains: query, mode: "insensitive"}}},
            ],
            // status: "AVAILABLE",
            ...(startDate && endDate
                ? {
                    stockDate: {
                        gte: startDate,
                        lte: endDate,
                    },
                }
                : {}),
        },
        include: {
            drug: true,
            drugBrand: true,
            Supplier: true,
        },
    });

    const stockData: StockData[] = batches.map((batch) => ({
        id: batch.id,
        name: `(Batch ${batch.number})`,
        brandName: batch.drugBrand.name,
        drugName: batch.drug.name,
        totalPrice: batch.retailPrice * batch.remainingQuantity,
        retailPrice: batch.retailPrice,
        wholesalePrice: batch.wholesalePrice,
        remainingQuantity: batch.remainingQuantity,
        supplier: batch.Supplier.name,
    }));

    const sortedData = applySorting(stockData, sort as SortOption);
    return sortedData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
}

export async function getStockByBrand({
                                          query = "",
                                          page = 1,
                                          sort = "alphabetically",
                                          startDate,
                                          endDate,
                                      }: StockQueryParams): Promise<StockData[]> {
    // Ensure dates are properly formatted for Prisma
    const formattedStartDate = startDate ? new Date(startDate) : undefined;
    const formattedEndDate = endDate ? new Date(endDate) : undefined;

    const brands = await prisma.drugBrand.findMany({
        where: {
            name: {contains: query},
            Batch: {
                some: {
                    AND: [
                        // { status: "AVAILABLE" },
                        {
                            stockDate: {
                                gte: formattedStartDate,
                                lte: formattedEndDate,
                            },
                        },
                    ],
                },
            },
        },
        include: {
            Batch: {
                where: {
                    AND: [
                        // { status: "AVAILABLE" },
                        {
                            stockDate: {
                                gte: formattedStartDate,
                                lte: formattedEndDate,
                            },
                        },
                    ],
                },
                select: {
                    wholesalePrice: true,
                    retailPrice: true,
                    remainingQuantity: true,
                },
            },
        },
    });

    // Transform and sort the data
    const stockData: StockData[] = brands
        .filter((brand) => brand.Batch.length > 0) // Only include brands with matching batches
        .map((brand) => ({
            id: brand.id,
            name: brand.name,
            totalPrice: brand.Batch.reduce(
                (sum, batch) => sum + batch.retailPrice * batch.remainingQuantity,
                0
            ),
        }));

    const sortedData = applySorting(stockData, sort as SortOption);
    return sortedData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
}

// Define interfaces for the return types
interface BatchInfo {
    batchId: number;
    batchNumber: string;
    brandName: string;
    concentration: number;
    retailPrice: number;
    totalPrice: number;
    remainingQuantity: number;
    expiryDate: string;
}

interface SupplierData {
    supplierId: number;
    supplierName: string;
    batches: BatchInfo[];
}

export async function getSupplierWisePricing(
    drugId: number
): Promise<SupplierData[]> {
    try {
        const batches = await prisma.batch.findMany({
            where: {
                drugId: drugId,
                // status: "AVAILABLE",
            },
            include: {
                drugBrand: true,
                Supplier: true,
                unitConcentration: true,
            },
            orderBy: {
                retailPrice: "asc", // Sort by retail price (low to high)
            },
        });

        // Group batches by supplier
        const supplierData: Record<string, SupplierData> = batches.reduce(
            (acc, batch) => {
                const supplierName = batch.Supplier.name;

                if (!acc[supplierName]) {
                    acc[supplierName] = {
                        supplierId: batch.Supplier.id,
                        supplierName: supplierName,
                        batches: [],
                    };
                }

                acc[supplierName].batches.push({
                    batchId: batch.id,
                    batchNumber: batch.number,
                    brandName: batch.drugBrand.name,
                    concentration: batch.unitConcentration.concentration,
                    retailPrice: batch.retailPrice,
                    totalPrice: batch.fullAmount * batch.wholesalePrice,
                    remainingQuantity: batch.remainingQuantity,
                    expiryDate: batch.expiry.toISOString().split("T")[0],
                });

                return acc;
            },
            {} as Record<string, SupplierData>
        );

        return Object.values(supplierData);
    } catch (error) {
        console.error("Error fetching supplier-wise pricing:", error);
        throw new Error("Failed to fetch supplier-wise pricing");
    }
}

export async function getStockAnalysis(
    dateRange: DateRange
): Promise<StockAnalysis> {
    try {
        const batches = await prisma.batch.findMany({
            where: {
                stockDate: {
                    gte: dateRange.startDate,
                    lte: dateRange.endDate,
                },
            },
            include: {
                Issue: true,
            },
        });

        const analysis: StockAnalysis = {
            available: 0, // Will store available quantity value
            sold: 0, // Will store sold quantity value
            expired: 0, // Will store expired quantity value
            disposed: 0, // Will store disposed quantity value
            quality_failed: 0, // Will store quality failed quantity value
            errors: 0, // Will store error quantity value
        };

        batches.forEach((batch) => {
            const pricePerUnit = batch.retailPrice;

            switch (batch.status) {
                case "AVAILABLE":
                    // For available status:
                    // - available = remainingQuantity * price
                    // - sold = (fullAmount - remainingQuantity) * price
                    analysis.available += batch.remainingQuantity * pricePerUnit;
                    if (batch.fullAmount > batch.remainingQuantity) {
                        analysis.sold +=
                            (batch.fullAmount - batch.remainingQuantity) * pricePerUnit;
                    }
                    break;

                case "EXPIRED":
                    // For expired status:
                    // - expired = remainingQuantity * price
                    // - sold = (fullAmount - remainingQuantity) * price
                    analysis.expired += batch.remainingQuantity * pricePerUnit;
                    if (batch.fullAmount > batch.remainingQuantity) {
                        analysis.sold +=
                            (batch.fullAmount - batch.remainingQuantity) * pricePerUnit;
                    }
                    break;

                case "COMPLETED":
                    // For completed status:
                    // - If there's remaining quantity, it's an error
                    // - sold = (fullAmount - remainingQuantity) * price
                    if (batch.remainingQuantity > 0) {
                        analysis.errors += batch.remainingQuantity * pricePerUnit;
                    }
                    analysis.sold +=
                        (batch.fullAmount - batch.remainingQuantity) * pricePerUnit;
                    break;

                case "DISPOSED":
                    // For disposed status:
                    // - disposed = remainingQuantity * price
                    // - sold = (fullAmount - remainingQuantity) * price
                    analysis.disposed += batch.remainingQuantity * pricePerUnit;
                    if (batch.fullAmount > batch.remainingQuantity) {
                        analysis.sold +=
                            (batch.fullAmount - batch.remainingQuantity) * pricePerUnit;
                    }
                    break;
                case "QUALITY_FAILED":
                    // For quality failed status:
                    // - quality_failed = remainingQuantity * price
                    // - sold = (fullAmount - remainingQuantity) * price
                    analysis.quality_failed += batch.remainingQuantity * pricePerUnit;
                    if (batch.fullAmount > batch.remainingQuantity) {
                        analysis.sold +=
                            (batch.fullAmount - batch.remainingQuantity) * pricePerUnit;
                    }
                    break;

                default:
                    // Any unknown status, count as error
                    analysis.errors += batch.fullAmount * pricePerUnit;
            }
        });

        return analysis;
    } catch (error) {
        console.error("Error fetching stock analysis:", error);
        throw new Error("Failed to fetch stock analysis");
    }
}

const PAGE_SIZE_COMPLETED_DRUGS_BY_BATCH = 15;

export async function getTotalPagesForCompletedFilteredDrugsByModel({
                                                                        query = "",
                                                                        status = "ALL",
                                                                        fromDate,
                                                                        toDate,
                                                                    }: {
    query?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
}) {
    const whereCondition: Record<string, unknown> = {
        drug: {name: {contains: query}},
    };

    if (status === "ALL") {
        whereCondition.status = {not: "AVAILABLE"};
    } else {
        whereCondition.status = status as BatchStatus;
    }
    if (fromDate && toDate) {
        whereCondition.stockDate = {
            gte: new Date(fromDate),
            lte: new Date(toDate),
        };
    }

    const totalItems = await prisma.batch.count({where: whereCondition});
    return Math.ceil(totalItems / PAGE_SIZE_COMPLETED_DRUGS_BY_BATCH);
}

export async function getCompletedFilteredDrugsByModel({
                                                           query = "",
                                                           page = 1,
                                                           sort = "expiryDate",
                                                           status = "ALL",
                                                           fromDate,
                                                           toDate,
                                                       }: {
    query?: string;
    page?: number;
    sort?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
}) {
    const whereCondition: Record<string, unknown> = {
        drug: {name: {contains: query}},
    };

    if (status === "ALL") {
        whereCondition.status = {not: "AVAILABLE"};
    } else {
        whereCondition.status = status as BatchStatus;
    }
    if (fromDate && toDate) {
        whereCondition.stockDate = {
            gte: new Date(fromDate),
            lte: new Date(toDate),
        };
    }

    const batches = await prisma.batch.findMany({
        where: whereCondition,
        include: {
            drug: true,
            drugBrand: true,
            unitConcentration: true,
        },
    });

    const formattedBatches = batches.map((batch) => ({
        id: batch.id,
        batchNumber: batch.number,
        brandName: batch.drugBrand.name,
        modelName: batch.drug.name,
        expiryDate: batch.expiry.toISOString(),
        stockDate: batch.stockDate.toISOString(),
        remainingAmount: batch.remainingQuantity,
        fullAmount: batch.fullAmount,
        status: batch.status,
        unitConcentration: batch.unitConcentration.concentration,
        type: batch.type,
    }));

    return sortAndPaginateBatches(formattedBatches, sort, page);
}

export async function getTotalPagesForCompletedFilteredDrugsByBrand({
                                                                        query = "",
                                                                        status = "ALL",
                                                                        fromDate,
                                                                        toDate,
                                                                    }: {
    query?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
}) {
    const whereCondition: Record<string, unknown> = {
        drugBrand: {name: {contains: query}},
    };

    if (status === "ALL") {
        whereCondition.status = {not: "AVAILABLE"};
    } else {
        whereCondition.status = status as BatchStatus;
    }
    if (fromDate && toDate) {
        whereCondition.stockDate = {
            gte: new Date(fromDate),
            lte: new Date(toDate),
        };
    }

    const totalItems = await prisma.batch.count({where: whereCondition});
    return Math.ceil(totalItems / PAGE_SIZE_COMPLETED_DRUGS_BY_BATCH);
}

export async function getCompletedFilteredDrugsByBrand({
                                                           query = "",
                                                           page = 1,
                                                           sort = "expiryDate",
                                                           status = "ALL",
                                                           fromDate,
                                                           toDate,
                                                       }: {
    query?: string;
    page?: number;
    sort?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
}) {
    const whereCondition: Record<string, unknown> = {
        drugBrand: {name: {contains: query}},
    };

    if (status === "ALL") {
        whereCondition.status = {not: "AVAILABLE"};
    } else {
        whereCondition.status = status as BatchStatus;
    }
    if (fromDate && toDate) {
        whereCondition.stockDate = {
            gte: new Date(fromDate),
            lte: new Date(toDate),
        };
    }

    const batches = await prisma.batch.findMany({
        where: whereCondition,
        include: {
            drug: true,
            drugBrand: true,
            unitConcentration: true,
        },
    });

    const formattedBatches = batches.map((batch) => ({
        id: batch.id,
        batchNumber: batch.number,
        brandName: batch.drugBrand.name,
        modelName: batch.drug.name,
        expiryDate: batch.expiry.toISOString(),
        stockDate: batch.stockDate.toISOString(),
        remainingAmount: batch.remainingQuantity,
        fullAmount: batch.fullAmount,
        status: batch.status,
        unitConcentration: batch.unitConcentration.concentration,
        type: batch.type,
    }));

    return sortAndPaginateBatches(formattedBatches, sort, page);
}

export async function getTotalPagesForCompletedFilteredDrugsByBatch({
                                                                        query = "",
                                                                        status = "ALL",
                                                                        fromDate,
                                                                        toDate,
                                                                    }: {
    query?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
}) {
    const whereCondition: Record<string, unknown> = {
        number: {contains: query},
    };

    if (status === "ALL") {
        whereCondition.status = {not: "AVAILABLE"};
    } else {
        whereCondition.status = status as BatchStatus;
    }
    if (fromDate && toDate) {
        whereCondition.stockDate = {
            gte: new Date(fromDate),
            lte: new Date(toDate),
        };
    }

    const totalItems = await prisma.batch.count({where: whereCondition});
    return Math.ceil(totalItems / PAGE_SIZE_COMPLETED_DRUGS_BY_BATCH);
}

export async function getCompletedFilteredDrugsByBatch({
                                                           query = "",
                                                           page = 1,
                                                           sort = "expiryDate",
                                                           status = "ALL",
                                                           fromDate,
                                                           toDate,
                                                       }: {
    query?: string;
    page?: number;
    sort?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
}) {
    const whereCondition: Record<string, unknown> = {
        number: {contains: query},
    };

    if (status === "ALL") {
        whereCondition.status = {not: "AVAILABLE"};
    } else {
        whereCondition.status = status as BatchStatus;
    }
    if (fromDate && toDate) {
        whereCondition.stockDate = {
            gte: new Date(fromDate),
            lte: new Date(toDate),
        };
    }

    const batches = await prisma.batch.findMany({
        where: whereCondition,
        include: {
            drug: true,
            drugBrand: true,
            unitConcentration: true,
        },
    });

    const formattedBatches = batches.map((batch) => ({
        id: batch.id,
        batchNumber: batch.number,
        brandName: batch.drugBrand.name,
        modelName: batch.drug.name,
        expiryDate: batch.expiry.toISOString(),
        stockDate: batch.stockDate.toISOString(),
        remainingAmount: batch.remainingQuantity,
        fullAmount: batch.fullAmount,
        status: batch.status,
        unitConcentration: batch.unitConcentration.concentration,
        type: batch.type,
    }));

    return sortAndPaginateBatches(formattedBatches, sort, page);
}

function sortAndPaginateBatches(
    batches: {
        id: number;
        batchNumber: string;
        brandName: string;
        modelName: string;
        expiryDate: string;
        stockDate: string;
        remainingAmount: number;
        fullAmount: number;
        status: string;
        unitConcentration: number;
        type: string;
    }[],
    sort: string,
    page: number
) {
    if (sort === "expiryDate") {
        batches.sort(
            (a, b) =>
                new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
        );
    } else if (sort === "newlyAdded") {
        batches.sort(
            (a, b) =>
                new Date(b.stockDate).getTime() - new Date(a.stockDate).getTime()
        );
    } else if (sort === "alphabetically") {
        batches.sort((a, b) => a.modelName.localeCompare(b.modelName));
    }

    return batches.slice(
        (page - 1) * PAGE_SIZE_COMPLETED_DRUGS_BY_BATCH,
        page * PAGE_SIZE_COMPLETED_DRUGS_BY_BATCH
    );
}

export async function getIssuedPatients(batchId: number) {
    return await prisma.issue
        .findMany({
            where: {batchId},
            select: {
                id: true,
                quantity: true,
                prescriptionId: true,
                prescription: {
                    select: {
                        time: true,
                        patientId: true,
                        patient: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        })
        .then((issues) =>
            issues.map((issue) => ({
                id: issue.id,
                issuedDate: issue.prescription.time.toISOString().split("T")[0],
                patientId: issue.prescription.patientId,
                patientName: issue.prescription.patient.name,
                prescriptionId: issue.prescriptionId,
                issuedAmount: issue.quantity,
            }))
        );
}

//Suggest the name when adding the drugs

export async function searchDrugBrands(query: string) {
    if (!query || query.length < 2) return [];

    return prisma.drugBrand.findMany({
        where: {
            name: {
                startsWith: query,
                mode: "insensitive",
            },
        },
        select: {
            id: true,
            name: true,
            description: true,
        },
        take: 8,
    });
}

export async function searchDrugModels(query: string) {
    if (!query || query.length < 2) return [];

    return prisma.drug.findMany({
        where: {
            name: {
                startsWith: query,
                mode: "insensitive",
            },
        },
        select: {
            id: true,
            name: true,
            bufferLevels: {
                // Include the related BufferLevel data
                select: {
                    id: true,
                    type: true,
                    bufferAmount: true,
                    unitConcentration: {
                        select: {
                            id: true,
                            concentration: true,
                        },
                    },
                },
            },
        },
        take: 8,
    });
}

export async function getDrugConcentrations(
    drugId: number,
    drugType: DrugType
): Promise<DrugConcentrationDataSuggestion[]> {
    try {
        const weights = await prisma.batch.findMany({
            where: {
                drugId: drugId,
                type: drugType,
            },
            include: {
                unitConcentration: true,
            },
            distinct: ["unitConcentrationId"], // Ensure unique weightIds
        });

        return weights.map((dw) => ({
            id: dw.unitConcentration.id,
            concentration: dw.unitConcentration.concentration,
        }));
    } catch (error) {
        console.error("Error fetching drug weights:", error);
        throw new Error("Failed to fetch drug weights");
    }
}

//show the info of one drug model
export async function getDrugModelStats(drugId: number) {
    try {
        const batches = await prisma.batch.findMany({
            where: {
                drugId: drugId,
            },
            select: {
                status: true,
                remainingQuantity: true,
                retailPrice: true,
                wholesalePrice: true,
                fullAmount: true,
            },
        });

        const stats = {
            available: {quantity: 0, value: 0},
            sold: {quantity: 0, value: 0},
            expired: {quantity: 0, value: 0},
            disposed: {quantity: 0, value: 0},
            quality_failed: {quantity: 0, value: 0},
            trashed: {quantity: 0, value: 0},
            errors: {quantity: 0, value: 0},
        };

        batches.forEach((batch) => {
            switch (batch.status) {
                case "AVAILABLE":
                    stats.available.quantity += batch.remainingQuantity;
                    stats.available.value += batch.retailPrice * batch.remainingQuantity;
                    if (batch.fullAmount > batch.remainingQuantity) {
                        stats.sold.quantity += batch.fullAmount - batch.remainingQuantity;
                        stats.sold.value +=
                            (batch.fullAmount - batch.remainingQuantity) * batch.retailPrice;
                    }
                    break;
                case "EXPIRED":
                    stats.expired.quantity += batch.remainingQuantity;
                    stats.expired.value += batch.retailPrice * batch.remainingQuantity;
                    if (batch.fullAmount > batch.remainingQuantity) {
                        stats.sold.quantity += batch.fullAmount - batch.remainingQuantity;
                        stats.sold.value +=
                            (batch.fullAmount - batch.remainingQuantity) * batch.retailPrice;
                    }
                    break;

                case "COMPLETED":
                    if (batch.remainingQuantity > 0) {
                        stats.errors.quantity += batch.remainingQuantity;
                        stats.errors.value += batch.remainingQuantity * batch.retailPrice;
                    }
                    stats.sold.quantity += batch.fullAmount - batch.remainingQuantity;
                    stats.sold.value +=
                        (batch.fullAmount - batch.remainingQuantity) * batch.retailPrice;
                    break;
                case "DISPOSED":
                    stats.trashed.quantity += batch.remainingQuantity;
                    stats.trashed.value += batch.remainingQuantity * batch.retailPrice;
                    if (batch.fullAmount > batch.remainingQuantity) {
                        stats.sold.value +=
                            (batch.fullAmount - batch.remainingQuantity) * batch.retailPrice;
                        stats.sold.quantity += batch.fullAmount - batch.remainingQuantity;
                    }
                    break;
                case "QUALITY_FAILED":
                    stats.quality_failed.quantity += batch.remainingQuantity;
                    stats.quality_failed.value +=
                        batch.retailPrice * batch.remainingQuantity;
                    if (batch.fullAmount > batch.remainingQuantity) {
                        stats.sold.quantity += batch.fullAmount - batch.remainingQuantity;
                        stats.sold.value +=
                            (batch.fullAmount - batch.remainingQuantity) * batch.retailPrice;
                    }
                    break;
                default:
                    // Any unknown status, count as error
                    stats.errors.value += batch.fullAmount * batch.retailPrice;
                    stats.errors.quantity += batch.fullAmount;
            }
        });

        return stats;
    } catch (error) {
        console.error("Error fetching stock analysis:", error);
        throw new Error("Failed to fetch stock analysis");
    }
}

export async function getDrugModelsWithBufferLevel(
    searchQuery?: string,
    selection?: string
) {
    try {
        // Only select the fields we actually need
        const drugs = await prisma.drug.findMany({
            where: searchQuery
                ? {
                    name: {
                        contains: searchQuery,
                        mode: "insensitive",
                    },
                }
                : undefined,
            select: {
                id: true,
                name: true,
                bufferLevels: {
                    // Fetch buffer levels for each drug
                    select: {
                        bufferAmount: true,
                        type: true,
                        unitConcentration: {
                            select: {
                                concentration: true,
                            },
                        },
                    },
                },
                batch: {
                    where: {
                        status: "AVAILABLE",
                    },
                    select: {
                        remainingQuantity: true,
                        fullAmount: true,
                    },
                },
            },
        });

        const results = drugs.map((drug) => {
            const availableAmount = drug.batch.reduce(
                (sum, batch) => sum + batch.remainingQuantity,
                0
            );

            const fullAmount = drug.batch.reduce(
                (sum, batch) => sum + batch.fullAmount,
                0
            );
            // Calculate the total buffer amount across all buffer levels for the drug
            const totalBufferAmount = drug.bufferLevels.reduce(
                (sum, bufferLevel) => sum + bufferLevel.bufferAmount,
                0
            );

            return {
                id: drug.id,
                name: drug.name,
                bufferLevel: totalBufferAmount, // Use the total buffer amount
                availableAmount,
                fullAmount,
                bufferLevels: drug.bufferLevels, // Include detailed buffer levels for UI
            };
        });

        // Apply sorting based on selection
        if (selection) {
            switch (selection) {
                case "buffered":
                    return results.sort((a, b) => {
                        // Calculate ratio of available amount to buffer level (no capping)
                        const aRatio =
                            a.bufferLevel > 0 ? a.availableAmount / a.bufferLevel : 0;
                        const bRatio =
                            b.bufferLevel > 0 ? b.availableAmount / b.bufferLevel : 0;
                        // Sort by ratio (ascending)
                        return aRatio - bRatio;
                    });
                case "stocked":
                    return results.sort((a, b) => {
                        // Calculate ratio of available amount to buffer level (no capping)
                        const aRatio =
                            a.bufferLevel > 0 ? a.availableAmount / a.bufferLevel : 0;
                        const bRatio =
                            b.bufferLevel > 0 ? b.availableAmount / b.bufferLevel : 0;
                        // Sort by ratio (descending)
                        return bRatio - aRatio;
                    });
                case "quantity-asc":
                    return results.sort((a, b) => a.availableAmount - b.availableAmount);
                case "quantity-desc":
                    return results.sort((a, b) => b.availableAmount - a.availableAmount);
                default:
                    return results;
            }
        }

        return results;
    } catch (error) {
        console.error("Failed to fetch drug models with buffer level:", error);
        throw new Error("Failed to fetch drug models with buffer level");
    }
}

export async function getDrugModelsWithBufferLevelUpdated(
    searchQuery?: string,
    selection?: string
): Promise<DrugBufferStatus[]> {
    try {
        // Only select the fields we actually need
        const batches = await prisma.batch.groupBy({
            by: ['drugId', 'unitConcentrationId', 'type'],
            where: {
                drug: {
                    name: {
                        contains: searchQuery,
                        mode: "insensitive",
                    },
                },
                status: "AVAILABLE",
            },
            _sum: {
                remainingQuantity: true,
                fullAmount: true,
            },
        });

        // Get all the unique drugId, unitConcentrationId, and type combinations
        const drugKeys = batches.map(batch => ({
            drugId: batch.drugId,
            unitConcentrationId: batch.unitConcentrationId,
            type: batch.type
        }));

        // Fetch buffer levels for these combinations
        const bufferLevels = await prisma.bufferLevel.findMany({
            where: {
                OR: drugKeys.map(key => ({
                    drugId: key.drugId,
                    unitConcentrationId: key.unitConcentrationId,
                    type: key.type
                }))
            },
            include: {
                drug: {
                    select: {
                        name: true,
                    }
                },
                unitConcentration: {
                    select: {
                        concentration: true,
                    }
                }
            }
        });

        // Combine the data
        const result = batches.map(batch => {
            const bufferLevel = bufferLevels.find(
                bl => bl.drugId === batch.drugId &&
                    bl.unitConcentrationId === batch.unitConcentrationId &&
                    bl.type === batch.type
            );

            return {
                drugId: batch.drugId,
                unitConcentrationId: batch.unitConcentrationId,
                type: batch.type,
                remainingQuantity: batch._sum.remainingQuantity || 0,
                fullAmount: batch._sum.fullAmount || 0,
                bufferAmount: bufferLevel?.bufferAmount || 0,
                drugName: bufferLevel?.drug.name || "",
                unitConcentrationValue: bufferLevel?.unitConcentration.concentration || 0,
            };
        });

        //sorting
        if (selection) {
            switch (selection) {
                case "buffered":
                    return result.sort((a, b) => {
                        // Calculate ratio of available amount to buffer level (no capping)
                        const aRatio =
                            a.bufferAmount > 0 ? a.remainingQuantity / a.bufferAmount : 0;
                        const bRatio =
                            b.bufferAmount > 0 ? b.remainingQuantity / b.bufferAmount : 0;
                        // Sort by ratio (ascending)
                        return aRatio - bRatio;
                    });
                case "stocked":
                    return result.sort((a, b) => {
                        // Calculate ratio of available amount to buffer level (no capping)
                        const aRatio =
                            a.bufferAmount > 0 ? a.remainingQuantity / a.bufferAmount : 0;
                        const bRatio =
                            b.bufferAmount > 0 ? b.remainingQuantity / b.bufferAmount : 0;
                        // Sort by ratio (descending)
                        return bRatio - aRatio;
                    });
                case "quantity-asc":
                    return result.sort((a, b) => a.remainingQuantity - b.remainingQuantity);
                case "quantity-desc":
                    return result.sort((a, b) => b.remainingQuantity - a.remainingQuantity);
                default:
                    return result;
            }
        }

        return result;
    } catch (error) {
        console.error("Failed to fetch drug models with buffer level:", error);
        throw new Error("Failed to fetch drug models with buffer level");
    }
}

export async function updateDrugBufferLevel(
    drugId: number,
    type: DrugType,
    concentration: number,
    newBufferLevel: number
) {
    try {
        if (!drugId || drugId <= 0) {
            return {success: false, message: "Invalid drug ID"};
        }
        if (newBufferLevel < 0) {
            return {success: false, message: "Buffer level cannot be negative"};
        }

        // Update the specific buffer level
        const updatedBufferLevel = await prisma.bufferLevel.upsert({
            where: {
                drugId_type_unitConcentrationId: {
                    drugId,
                    type,
                    unitConcentrationId: concentration,
                },
            },
            update: {
                bufferAmount: newBufferLevel,
            },
            create: {
                drugId,
                type,
                unitConcentrationId: concentration,
                bufferAmount: newBufferLevel,
            },
        });

        revalidatePath("/inventory/buffer-level");
        return {
            success: true,
            message: `Buffer level for drug ID ${drugId} (${type}, ${concentration}mg) updated to ${newBufferLevel}`,
            bufferLevel: updatedBufferLevel,
        };
    } catch (error) {
        console.error("Failed to update drug buffer level:", error);
        return {
            success: false,
            message: "Failed to update buffer level. Please try again.",
        };
    }
}
