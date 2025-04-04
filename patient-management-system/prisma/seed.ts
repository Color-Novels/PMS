import {
    PrismaClient,
    DrugType,
    BatchStatus,
    Gender,
    Role,
} from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

// Common drug names (generic names)
const drugNames = [
    "Paracetamol",
    "Ibuprofen",
    "Amoxicillin",
    "Omeprazole",
    "Metformin",
    "Amlodipine",
    "Cetirizine",
    "Azithromycin",
    "Metronidazole",
    "Gabapentin",
];

// Common concentrations in mg
const tabletConcentrations = [
    100, 200, 250, 300, 400, 500, 600, 650, 750, 1000,
];
const capsuleConcentrations = [50, 100, 150, 200, 250, 300, 400, 500];
const syrupConcentrations = [100, 125, 150, 200, 250]; // mg/5ml typically
const dropConcentrations = [0.5, 1, 2, 5, 10]; // percentage or mg/ml
const topicalConcentrations = [0.5, 1, 2, 5, 10, 15, 20]; // percentage
const inhalationConcentrations = [50, 100, 200, 250, 500]; // mcg
const injectionConcentrations = [10, 25, 50, 100, 250, 500]; // mg/ml
const lozengeConcentrations = [5, 10, 15, 25]; // mg
const suppositoryConcentrations = [25, 50, 100, 200]; // mg
const patchConcentrations = [5, 10, 20, 30, 50]; // mcg/hour or mg
const oralSolutionConcentrations = [50, 100, 125, 200, 250]; // mg/5ml or mg/ml

async function createUnitConcentrations() {
    console.log("\n--- Creating Unit Concentrations ---");
    const allConcentrations = [
        ...new Set([
            ...tabletConcentrations,
            ...syrupConcentrations,
            ...dropConcentrations,
            ...topicalConcentrations,
            ...inhalationConcentrations,
            ...injectionConcentrations,
            ...lozengeConcentrations,
            ...suppositoryConcentrations,
            ...patchConcentrations,
            ...oralSolutionConcentrations,
        ]),
    ];

    for (const concentration of allConcentrations) {
        await prisma.unitConcentration.create({
            data: { concentration },
        });
        console.log(`Created concentration: ${concentration}mg`);
    }
}

async function createSuppliers() {
    console.log("\n--- Creating Suppliers ---");
    const suppliers = [];

    for (let i = 0; i < 10; i++) {
        const supplier = await prisma.supplier.create({
            data: {
                name: faker.company.name(),
                contact: faker.phone.number(),
            },
        });
        console.log(`Created supplier: ${supplier.name}`);
        suppliers.push(supplier);
    }
    return suppliers;
}

async function createUsersAndPatients() {
    console.log("\n--- Creating Users and Patients ---");

    // Generate 50 random patients
    const patients = Array.from({ length: 50 }).map(() => ({
        telephone: faker.phone.number({ style: "national" }),
        name: faker.person.fullName(),
        birthDate: faker.date.birthdate({ min: 18, max: 80, mode: "age" }),
        address: `${faker.location.city()}, Sri Lanka`,
        height: faker.number.int({ min: 150, max: 190 }),
        weight: faker.number.int({ min: 50, max: 100 }),
        gender: faker.helpers.arrayElement([Gender.MALE, Gender.FEMALE]),
        NIC: `${faker.number.int({ min: 190000000, max: 209999999 })}V`,
    }));

    // Insert the random patients into the database
    await prisma.patient.createMany({ data: patients });
    console.log(`Created ${patients.length} patients`);

    // Create staff users
    const staffUsers = [
        {
            email: "doctor1@srilanka.com",
            mobile: "0765432189",
            password:
                "$2a$10$uQpRRBUzSZWg6vqcVHE3HeDiuN5aJcvM5dXaU.IBnFNYuaxniCE.a",
            role: Role.DOCTOR,
            gender: Gender.MALE,
            name: "Dasun Piyumal",
        },
        {
            email: "nurse1@srilanka.com",
            mobile: "0775671234",
            password:
                "$2a$10$uQpRRBUzSZWg6vqcVHE3HeDiuN5aJcvM5dXaU.IBnFNYuaxniCE.a",
            role: Role.NURSE,
            gender: Gender.FEMALE,
            name: "Kasuni Nimali",
        },
        {
            email: "nurse2@srilanka.com",
            mobile: "0775677890",
            password:
                "$2a$10$uQpRRBUzSZWg6vqcVHE3HeDiuN5aJcvM5dXaU.IBnFNYuaxniCE.a",
            role: Role.NURSE,
            gender: Gender.FEMALE,
            name: "Dilini Perera",
        },
    ];

    for (const user of staffUsers) {
        await prisma.user.create({ data: user });
        console.log(`Created ${user.role.toLowerCase()}: ${user.name}`);
    }
}

async function generateBatchData(
    drugType: DrugType,
    createdAt: Date,
    supplierId: number
) {
    const expiryDate = new Date(createdAt);
    expiryDate.setDate(
        expiryDate.getDate() + faker.number.int({ min: 1, max: 730 })
    ); // 1 day to 2 years

    // Select appropriate concentration based on drug type
    let concentrations;
    switch (drugType) {
        case DrugType.TABLET:
            concentrations = tabletConcentrations;
            break;
        case DrugType.CAPSULE:
            concentrations = capsuleConcentrations;
            break;
        case DrugType.SYRUP:
            concentrations = syrupConcentrations;
            break;
        case DrugType.EYE_DROP:
        case DrugType.EAR_DROP:
        case DrugType.NASAL_DROP:
            concentrations = dropConcentrations;
            break;
        case DrugType.CREAM:
        case DrugType.OINTMENT:
        case DrugType.GEL:
        case DrugType.LOTION:
            concentrations = topicalConcentrations;
            break;
        case DrugType.INJECTION:
            concentrations = injectionConcentrations;
            break;
        case DrugType.INHALER:
        case DrugType.SPRAY:
            concentrations = inhalationConcentrations;
            break;
        case DrugType.LOZENGE:
            concentrations = lozengeConcentrations;
            break;
        case DrugType.SUPPOSITORY:
            concentrations = suppositoryConcentrations;
            break;
        case DrugType.PATCH:
            concentrations = patchConcentrations;
            break;
        case DrugType.POWDER:
            concentrations = tabletConcentrations; // Using tablet concentrations as a default
            break;
        case DrugType.SOLUTION:
        case DrugType.SUSPENSION:
        case DrugType.GARGLE:
        case DrugType.MOUTHWASH:
            concentrations = oralSolutionConcentrations;
            break;
        default:
            concentrations = tabletConcentrations; // Fallback
    }

    const concentration =
        concentrations[Math.floor(Math.random() * concentrations.length)];

    // Adjust fullAmount based on drug type
    let minAmount = 50;
    let maxAmount = 1000;

    // Smaller quantities for certain drug types
    if (
        drugType === DrugType.EYE_DROP ||
        drugType === DrugType.EAR_DROP ||
        drugType === DrugType.NASAL_DROP ||
        drugType === DrugType.SPRAY
    ) {
        minAmount = 5;
        maxAmount = 100;
    } else if (
        drugType === DrugType.CREAM ||
        drugType === DrugType.OINTMENT ||
        drugType === DrugType.GEL ||
        drugType === DrugType.LOTION
    ) {
        minAmount = 10;
        maxAmount = 200;
    } else if (
        drugType === DrugType.SUPPOSITORY ||
        drugType === DrugType.PATCH
    ) {
        minAmount = 5;
        maxAmount = 50;
    }

    const fullAmount = faker.number.int({ min: minAmount, max: maxAmount });

    // Adjust pricing based on drug type
    let minPrice = 10;
    let maxPrice = 100;

    // Higher pricing for certain drug types
    if (drugType === DrugType.INJECTION || drugType === DrugType.INHALER) {
        minPrice = 50;
        maxPrice = 300;
    } else if (drugType === DrugType.PATCH || drugType === DrugType.SPRAY) {
        minPrice = 30;
        maxPrice = 200;
    }

    const wholesalePrice = faker.number.float({
        min: minPrice,
        max: maxPrice,
        fractionDigits: 2,
    });

    // Get the concentration ID
    const unitConcentration = await prisma.unitConcentration.findFirst({
        where: { concentration },
    });

    if (!unitConcentration) {
        throw new Error(`Concentration ${concentration} not found in database`);
    }

    return {
        number: faker.string.alphanumeric(8).toUpperCase(),
        type: drugType,
        fullAmount,
        remainingQuantity: fullAmount,
        expiry: expiryDate,
        wholesalePrice,
        retailPrice: wholesalePrice * 1.3, // 30% markup
        status: BatchStatus.AVAILABLE,
        unitConcentrationId: unitConcentration.id, // Pass the ID instead of concentration value
        supplierId,
    };
}

// Add this function to create a pool of pharmaceutical brands
async function createDrugBrands(count: number) {
    console.log("\n--- Creating Drug Brands ---");
    const brands = [];

    for (let i = 0; i < count; i++) {
        const brand = await prisma.drugBrand.create({
            data: {
                name: faker.company.name() + " Pharmaceuticals",
                description: faker.company.catchPhrase(),
            },
        });
        console.log(`Created brand: ${brand.name}`);
        brands.push(brand);
    }

    return brands;
}

async function createDrugsAndBatches() {
    console.log("\n--- Creating Drugs and Batches ---");

    // Create a pool of brands first (20 pharmaceutical companies)
    const allSuppliers = await createSuppliers(); // Get suppliers
    const allBrands = await createDrugBrands(20);

    // Create drugs and their batches
    for (const drugName of drugNames) {
        console.log(`\nProcessing drug: ${drugName}`);

        // Create drug
        const drug = await prisma.drug.create({
            data: {
                name: drugName,
            },
        });
        console.log(`Created drug: ${drug.name} (ID: ${drug.id})`);

        // Randomly select 2-4 brands that will manufacture this drug
        const brandCount = faker.number.int({ min: 2, max: 4 });
        const selectedBrands = faker.helpers
            .shuffle([...allBrands])
            .slice(0, brandCount);

        for (const brand of selectedBrands) {
            console.log(`Assigning ${brand.name} to produce ${drugName}`);

            // Create 3-10 batches for each brand-drug combination
            const batchCount = faker.number.int({ min: 2, max: 5 });

            // Randomly assign different drug types based on the drug
            // Some drugs might appear in multiple forms (e.g., both TABLET and CAPSULE)
            const drugFormCount = faker.number.int({ min: 1, max: 3 }); // How many different forms this drug has

            // Select random drug types for this drug
            const drugTypes = faker.helpers
                .shuffle(Object.values(DrugType))
                .slice(0, drugFormCount);

            for (let i = 0; i < batchCount; i++) {
                // Distribute batches among the selected drug types
                const drugType = drugTypes[i % drugTypes.length];
                const supplier = faker.helpers.arrayElement(allSuppliers); // Random supplier
                const batchData = await generateBatchData(
                    drugType,
                    new Date(),
                    supplier.id
                );

                const batch = await prisma.batch.create({
                    data: {
                        ...batchData,
                        drugId: drug.id,
                        drugBrandId: brand.id,
                    },
                });

                console.log(
                    `Created batch: ${batch.number} (${batch.type}, Brand: ${brand.name})`
                );
            }
        }

        // Create BufferLevel entries for each drug
        const drugTypes = faker.helpers
            .shuffle(Object.values(DrugType))
            .slice(0, faker.number.int({ min: 1, max: 3 }));

        for (const drugType of drugTypes) {
            const unitConcentration = await prisma.unitConcentration.findFirst({
                where: {
                    concentration:
                        faker.helpers.arrayElement(tabletConcentrations),
                },
            });

            if (unitConcentration) {
                await prisma.bufferLevel.create({
                    data: {
                        drugId: drug.id,
                        type: drugType,
                        unitConcentrationId: unitConcentration.id,
                        bufferAmount: faker.number.int({ min: 10, max: 100 }),
                    },
                });
                console.log(
                    `Created BufferLevel for drug: ${drug.name} (Type: ${drugType}, Concentration: ${unitConcentration.concentration}mg)`
                );
            }
        }
    }
}

async function createReportTypes() {
    console.log("\n--- Creating Report Types and Parameters ---");

    const reportTypes = [
        {
            name: "Full Blood Count (FBC)",
            description: "Complete blood cell count analysis",
            parameters: [
                { name: "WBC", units: "×10^9/L" },
                { name: "RBC", units: "×10^12/L" },
                { name: "Hemoglobin", units: "g/dL" },
                { name: "Platelets", units: "×10^9/L" },
                { name: "Hematocrit", units: "%" },
            ],
        },
        {
            name: "Liver Function Test (LFT)",
            description: "Assessment of liver function and health",
            parameters: [
                { name: "ALT", units: "U/L" },
                { name: "AST", units: "U/L" },
                { name: "Bilirubin", units: "mg/dL" },
                { name: "Albumin", units: "g/dL" },
            ],
        },
        {
            name: "Lipid Profile",
            description: "Cholesterol and triglycerides measurement",
            parameters: [
                { name: "Total Cholesterol", units: "mg/dL" },
                { name: "HDL", units: "mg/dL" },
                { name: "LDL", units: "mg/dL" },
                { name: "Triglycerides", units: "mg/dL" },
            ],
        },
        {
            name: "Kidney Function Test",
            description: "Assessment of kidney function",
            parameters: [
                { name: "Creatinine", units: "mg/dL" },
                { name: "BUN", units: "mg/dL" },
                { name: "eGFR", units: "mL/min/1.73m²" },
            ],
        },
        {
            name: "Thyroid Function Test",
            description: "Evaluation of thyroid hormone levels",
            parameters: [
                { name: "TSH", units: "mIU/L" },
                { name: "T3", units: "ng/dL" },
                { name: "T4", units: "µg/dL" },
            ],
        },
        {
            name: "Blood Glucose Test",
            description: "Blood sugar level measurement",
            parameters: [
                { name: "Fasting Blood Sugar", units: "mg/dL" },
                { name: "Post Prandial Blood Sugar", units: "mg/dL" },
                { name: "HbA1c", units: "%" },
            ],
        },
        {
            name: "Electrolyte Panel",
            description: "Measurement of blood electrolyte levels",
            parameters: [
                { name: "Sodium", units: "mEq/L" },
                { name: "Potassium", units: "mEq/L" },
                { name: "Chloride", units: "mEq/L" },
                { name: "Bicarbonate", units: "mEq/L" },
            ],
        },
        {
            name: "CRP Test",
            description: "C-Reactive Protein inflammation marker test",
            parameters: [
                { name: "CRP Level", units: "mg/L" },
                { name: "ESR", units: "mm/hr" },
                { name: "PCT", units: "ng/mL" },
            ],
        },
        {
            name: "Urinalysis",
            description: "Physical and chemical examination of urine",
            parameters: [
                { name: "pH", units: null },
                { name: "Specific Gravity", units: null },
                { name: "Protein", units: "mg/dL" },
                { name: "Glucose", units: "mg/dL" },
            ],
        },
        {
            name: "Cardiac Markers",
            description: "Heart function and damage indicators",
            parameters: [
                { name: "Troponin I", units: "ng/mL" },
                { name: "CK-MB", units: "ng/mL" },
                { name: "BNP", units: "pg/mL" },
            ],
        },
    ];

    for (const reportType of reportTypes) {
        const created = await prisma.reportType.create({
            data: {
                name: reportType.name,
                description: reportType.description,
                parameters: {
                    create: reportType.parameters,
                },
            },
        });
        console.log(
            `Created report type: ${created.name} with ${reportType.parameters.length} parameters`
        );
    }
}

async function createCharges() {
    console.log("\n--- Creating Charges ---");
    prisma.charge.createMany({
        data: [
            {
                name: "Doctor fee",
                value: 100,
                type: "FIXED",
                updatedAt: new Date(),
            },
            {
                name: "Dispensory fee",
                value: 50,
                type: "FIXED",
                updatedAt: new Date(),
            },
            {
                name: "Nebulize",
                value: 10,
                type: "PROCEDURE",
                updatedAt: new Date(),
            },
            {
                name: "Injection",
                value: 20,
                type: "PROCEDURE",
                updatedAt: new Date(),
            },
            {
                name: "Wound",
                value: 30,
                type: "PROCEDURE",
                updatedAt: new Date(),
            },
            {
                name: "Failed visit",
                value: 100,
                type: "DISCOUNT",
                updatedAt: new Date(),
            },
            {
                name: "VAT",
                value: 18,
                type: "PERCENTAGE",
                updatedAt: new Date(),
            },
        ],
    });
}

async function main() {
    console.log("\nStarting database seeding...");

    // Create all data in sequence
    await createUnitConcentrations();
    await createUsersAndPatients();
    await createDrugsAndBatches();
    await createReportTypes();
    await createCharges();
    // await createQueuesAndEntries();
    // await createMedicalCertificates();

    console.log("\nDatabase seeding completed successfully!");
}

main()
    .catch((e) => {
        console.error("Error during seeding:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
