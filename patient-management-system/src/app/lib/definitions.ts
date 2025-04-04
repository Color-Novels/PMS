import type {LucideIcon} from "lucide-react";
import {ChargeType, Role} from "@prisma/client";
import type {DrugType} from "@prisma/client";

export type SessionPayload = {
    id: number;
    role: Role;
};

export interface Parameter {
    name: string;
    units: string;
}

export interface ReportForm {
    name: string;
    description: string;
    parameters: Parameter[];
}

export type SidebarLinkItem = {
    type: "link";
    icon?: LucideIcon;
    title: string;
    url: string;
    isActive: boolean;
};

export type SidebarExpandableItem = {
    type: "expandable";
    title: string;
    icon?: LucideIcon;
    initiallyExpanded: boolean;
    items: SidebarLinkItem[];
};

export type SidebarItem = SidebarLinkItem | SidebarExpandableItem;

export type myError = {
    success: boolean;
    message: string;
};

export type myConfirmation = {
    confirmationRequired: boolean;
    message: string;
};

export type myBillError = {
    success: boolean;
    message: string;
    bill?: Bill | null;
};

export type PatientFormData = {
    name: string;
    NIC: string;
    telephone: string;
    birthDate: string;
    address: string;
    height: string; // Keep as string since input fields return strings
    weight: string; // Keep as string since input fields return strings
    gender: "MALE" | "FEMALE" | "";
};

export type InventoryFormData = {
    drugName: string;
    brandName: string;
    brandDescription?: string;
    batchNumber: string;
    drugType: DrugType;
    quantity: number | string;
    expiry: string;
    retailPrice: number | string;
    wholesalePrice: number | string;
    brandId?: number; // Add brandId property
    drugId?: number; // Add drugId property
    concentrationId?: number;
    concentration?: number;
    Buffer: number; // Add Buffer property
    supplierId?: number;
    supplierName: string; // Add supplierName property
    supplierContact: string; // Add supplierContact property
};

// export type InventoryFormData = {
//     brandName: string,
//     brandDescription: string,
//     drugName: string,
//     batchNumber: string,
//     drugType: string,
//     quantity: number,
//     expiry: string,
//     price: number
// };

export const searchModels = [
    {
        label: "By Brand",
        value: "brand",
        sortOptions: [
            {label: "Alphabetically", value: "alphabetically"},
            {label: "Lowest", value: "lowest"},
            {label: "Highest", value: "highest"},
        ],
    },
    {
        label: "By Model",
        value: "model",
        sortOptions: [
            {label: "Alphabetically", value: "alphabetically"},
            {label: "Lowest", value: "lowest"},
            {label: "Highest", value: "highest"},
        ],
    },
    {
        label: "By Batch",
        value: "batch",
        sortOptions: [
            {label: "Expiry Date", value: "expiryDate"},
            {label: "Newly Added", value: "newlyAdded"},
            {label: "Alphabetically", value: "alphabetically"},
        ],
    },
];

//search models for cost management

export const searchModelsCM = [
    {
        label: "By Brand",
        value: "brand",
        sortOptions: [
            {label: "Alphabetically", value: "alphabetically"},
            {label: "Total Cost", value: "totalcost"},
            {label: "Cost Per Unit", value: "costperunit"},
        ],
    },
    {
        label: "By Model",
        value: "model",
        sortOptions: [
            {label: "Alphabetically", value: "alphabetically"},
            {label: "Total Cost", value: "totalcost"},
            {label: "Cost Per Unit", value: "costperunit"},
        ],
    },
    {
        label: "By Batch",
        value: "batch",
        sortOptions: [
            {label: "Total Cost", value: "totalcost"},
            {label: "Cost Per Unit", value: "costperunit"},
            {label: "Alphabetically", value: "alphabetically"},
        ],
    },
];

export interface StockData {
    id: number;
    name: string;
    drugName?: string;
    brandName?: string;
    totalPrice: number;
    retailPrice?: number;
    wholesalePrice?: number;
    remainingQuantity?: number;
    supplier?: string;
}

export type SortOption =
    | "alphabetically"
    | "highest"
    | "lowest"
    | "unit-highest"
    | "unit-lowest";

export interface StockQueryParams {
    query?: string;
    page?: number;
    sort?: SortOption;
    startDate?: Date;
    endDate?: Date;
}

// types for inventory cost analysis

export interface StockAnalysis {
    available: number; // Total value of available drugs
    sold: number; // Total value of sold drugs
    expired: number; // Total value of expired drugs
    disposed: number; // Total value of disposed drugs
    quality_failed: number; // Total value of quality failed drugs
    errors: number; // Total value of drugs with errors
}

export interface DateRange {
    startDate: Date;
    endDate: Date;
}

export interface BatchAnalysisData {
    id: number;
    status: string;
    price: number;
    fullAmount: number;
    remainingQuantity: number;
    stockDate: Date;
    expiry: Date;
}

export interface PieChartData {
    name: string;
    value: number;
    color: string;
}

export interface DrugBrandSuggestion {
  id: number;
  name: string;
  bufferLevels?: {
    id: number;
    type: DrugType;
    bufferAmount: number;
    unitConcentration: {
      id: number;
      concentration: number;
    };
  }[];
}

export interface DrugModelSuggestion {
  id: number;
  name: string;
  bufferLevels?: {
    id: number;
    type: DrugType;
    bufferAmount: number;
    unitConcentration: {
      id: number;
      concentration: number;
    };
  }[];
}

export interface DrugConcentrationDataSuggestion {
    id: number;
    concentration: number;
}

export type BillEntry = {
    drugName: string;
    brandName: string;
    quantity: number;
    unitPrice: number;
};

export type ChargeEntry = {
    name: string;
    value: number;
    description?: string;
    type: ChargeType;
}

export type Bill = {
    prescriptionID: number;
    patientName: string;
    entries: BillEntry[];
    charges: ChargeEntry[];
    patientID: number;
};

export type MedicalCertificate = {
    id: number;
    patientId: number;
    nameOfThePatient: string;
    addressOfThePatient: string;
    fitForDuty: "FIT" | "UNFIT";
    dateOfSickness: Date;
    recommendedLeaveDays: number;
    natureOfTheDisease: string;
    ageOfThePatient: number;
    reccomendations: string;
    time: Date;
};

export type USSReferral = {
    id: number;
    patientId: number;
    nameOfThePatient: string;
    presentingComplaint: string;
    duration: string;
    onExamination: string;
    pshx_pmhx: string;
    ageOfThePatient: number;
    reportDate: Date;
    USS_type: string;
    radiologist: string;
    radiologist_title: string;
    time: Date;
};

export type ReferralLetter = {
    id: number;
    patientId: number;
    nameOfThePatient: string;
    consultant_speciality: string;
    consultant_name: string;
    condition1: string;
    condition2: string;
    condition3: string;
    investigations: string;
    ageOfThePatient: number;
    reportDate: Date;
    time: Date;
};

//types of income for day

export interface DailyIncome {
    date: string;
    totalIncome: number;
    patientCount: number;
}

export interface IncomeStats {
    totalIncome: number;
    patientCount: number;
    averagePerPatient: number;
}

export interface SupplierSuggestion {
    id: number;
    name: string;
    contact: string | null;
}

export interface DrugModelsWithBufferLevel {
  id: number;
  name: string;
  availableAmount: number;
  fullAmount: number;
  bufferLevels: {
    type: DrugType;
    unitConcentration: {
      concentration: number;
    };
    bufferAmount: number;
  }[];
}

export type PrescriptionCard = {
    id: number;
    patientId: number;
    time: Date;
    status: string;
    issues: Array<{
        drug: {
            name: string;
        } | null;
    }>;
    OffRecordMeds: Array<{
        name: string;
    }>;
    PrescriptionVitals?: Array<{
        value: string;
        vital: {
            color: string;
            icon: string;
            name: string;
        };
    }>;
}
//
// type QueueCountCacheType = {
//     dirty: boolean;
//     data: Awaited<ReturnType<typeof getPendingPatientsCount>>;
//     timestamp: number;
//     fetchPromise: Promise<Awaited<ReturnType<typeof getPendingPatientsCount>>> | null;
// }
//
// export const queueCountCache: QueueCountCacheType = {
//     dirty: true,
//     data: {total: 0, pending: 0},
//     timestamp: 0,
//     fetchPromise: null
// };
//
// export const invalidateQueueCountCache = () => {
//     queueCountCache.dirty = true;
// }