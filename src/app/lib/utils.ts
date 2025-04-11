import {toast, ToastPosition} from "react-toastify";
import {z} from "zod";
import {ChargeType, IssuingStrategy, PatientHistoryType} from "@prisma/client";
import {BasicColorType} from "@/app/(dashboard)/_components/CustomBadge";
import {Bill, ChargeEntry, myError} from "@/app/lib/definitions";

export function calcAge(birthDate: Date): number {
    const diff_ms = Date.now() - birthDate.getTime();
    const age_dt = new Date(diff_ms);

    return Math.abs(age_dt.getUTCFullYear() - 1970);
}

// Get the text color class based on the selected color
export const getTextColorClass = (color: keyof BasicColorType) => {
    const iconColorMap: Record<keyof BasicColorType, string> = {
        slate: "text-slate-600",
        gray: "text-gray-600",
        zinc: "text-zinc-600",
        neutral: "text-neutral-600",
        stone: "text-stone-600",
        red: "text-red-600",
        orange: "text-orange-600",
        amber: "text-amber-600",
        yellow: "text-yellow-600",
        lime: "text-lime-600",
        green: "text-green-600",
        emerald: "text-emerald-600",
        teal: "text-teal-600",
        cyan: "text-cyan-600",
        sky: "text-sky-600",
        blue: "text-blue-600",
        indigo: "text-indigo-600",
        violet: "text-violet-600",
        purple: "text-purple-600",
        fuchsia: "text-fuchsia-600",
        pink: "text-pink-600",
        rose: "text-rose-600",
        destructive: "",
        okay: ""
    };

    return iconColorMap[color] || "text-gray-600";
};

export const getInitials = (name: string) => {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};


// Now the server action is just a function that returns a Promise<ServerActionResult>
type ServerAction = () => Promise<myError>;

export interface ActionOptions {
    loadingMessage?: string;
    successMessage?: string;
    errorMessage?: string;
    position?: ToastPosition;
}

/**
 * Handles server actions with toast notifications.
 * @param action - The server action function with pre-bound parameters.
 * @param options - Toast options (optional).
 * @returns The result of the server action.
 */
export const handleServerAction = async (
    action: ServerAction,
    options: ActionOptions = {}
): Promise<myError> => {
    const {
        loadingMessage = "Processing...",
        position = "bottom-right",
    } = options;

    const id = toast.loading(loadingMessage, {position, pauseOnFocusLoss: false});

    try {
        const result = await action();

        if (!result.success) {
            toast.update(id, {
                render: result.message || "An error occurred!",
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
            return {success: false, message: result.message};
        }

        toast.update(id, {
            render: result.message || "Success!",
            type: "success",
            isLoading: false,
            autoClose: 2000,
        });
        return result;
    } catch (error) {
        toast.update(id, {
            render: error instanceof Error ? error.message : "An error occurred!",
            type: "error",
            isLoading: false,
            autoClose: 3000,
        });
        return {success: false, message: "An error occurred"};
    }
};


export function calculateQuantity({
                                      strategy,
                                      dose,
                                      forDays,
                                      times
                                  }: {
    strategy: IssuingStrategy,
    dose: number,
    forDays: number
    times?: number
}): number {
    switch (strategy) {
        case IssuingStrategy.TDS: // Three times a day
            return dose * 3 * forDays;

        case IssuingStrategy.BD: // Twice a day
            return dose * 2 * forDays;

        case IssuingStrategy.OD: // Once daily
            return dose * forDays;

        case IssuingStrategy.QDS: // Four times a day (every 6 hours)
            return dose * 4 * forDays;

        case 'SOS': // When needed (can't calculate exact quantity)
            if (times) return dose * times;
            throw new Error(`Times must be provided for SOS strategy`);

        case 'WEEKLY': // Once per week times is required
            if (times) return dose * times;
            throw new Error(`Times must be provided for WEEKLY strategy`);

        case IssuingStrategy.NOCTE: // At night
        case IssuingStrategy.MANE: // In the morning
        case IssuingStrategy.VESPE : // In the evening
        case IssuingStrategy.NOON: // At noon
            return dose * forDays;

        case 'OTHER':
            if (times) return dose * times;
            throw new Error(`Times must be provided for OTHER strategy`);


        default:
            throw new Error(`Unknown strategy type`);
    }
}

export function calculateForDays({
                                     strategy,
                                     dose,
                                     quantity,
                                 }: {
    strategy: IssuingStrategy;
    dose: number;
    quantity: number;
    times?: number;
}): number | null {
    switch (strategy) {
        case IssuingStrategy.TDS: // Three times a day
            return Math.floor(quantity / (dose * 3));

        case IssuingStrategy.BD: // Twice a day
            return Math.floor(quantity / (dose * 2));

        case IssuingStrategy.OD: // Once daily
            return Math.floor(quantity / dose);

        case IssuingStrategy.QDS: // Four times a day
            return Math.floor(quantity / (dose * 4));

        case 'SOS': // When needed
        case 'OTHER':
            return null;

        case IssuingStrategy.NOCTE: // At night
        case IssuingStrategy.MANE: // In the morning
        case IssuingStrategy.VESPE: // In the evening
        case IssuingStrategy.NOON: // At noon
            return Math.floor(quantity / dose);

        case 'WEEKLY': // Once per week
            return Math.ceil((quantity / dose) * 7);

        default:
            throw new Error(`Unknown strategy type`);
    }
}

export function calculateTimes({
                                   strategy,
                                   dose,
                                   quantity,
                               }: {
    strategy: IssuingStrategy;
    dose: number;
    quantity: number;
}): number {
    switch (strategy) {
        case IssuingStrategy.TDS: // Three times a day
            return Math.floor(quantity / (dose * 3));

        case IssuingStrategy.BD: // Twice a day
            return Math.floor(quantity / (dose * 2));

        case IssuingStrategy.OD: // Once daily
            return Math.floor(quantity / dose);

        case IssuingStrategy.QDS: // Four times a day
            return Math.floor(quantity / (dose * 4));

        case 'SOS': // When needed
        case 'OTHER':
            return Math.floor(quantity / dose);

        case IssuingStrategy.NOCTE: // At night
        case IssuingStrategy.MANE: // In the morning
        case IssuingStrategy.VESPE: // In the evening
        case IssuingStrategy.NOON: // At noon
            return Math.floor(quantity / dose);

        case 'WEEKLY': // Once per week
            return Math.floor(quantity / dose);

        default:
            throw new Error(`Unknown strategy type`);
    }
}


const emailSchema = z.string().email("Invalid email format");

const mobileSchema = z
    .string()
    .regex(/^\d{10}$/, "Invalid mobile number (must be 10 digits)");

export const validateEmail = (email: string) => {
    const result = emailSchema.safeParse(email);
    return result.success ? null : result.error.errors[0].message;
};

export const validateMobile = (mobile: string) => {
    const result = mobileSchema.safeParse(mobile);
    return result.success ? null : result.error.errors[0].message;
};


// Define the custom order for ChargeType
const chargeTypeOrder: Record<ChargeType, number> = {
    'MEDICINE': 0,
    'FIXED': 1,
    'PERCENTAGE': 2,
    'PROCEDURE': 3,
    'DISCOUNT': 4
};

export const compareChargeTypes = (typeA: ChargeType, typeB: ChargeType) => {
    const orderA = chargeTypeOrder[typeA] || 999;
    const orderB = chargeTypeOrder[typeB] || 999;
    return orderA - orderB;
};

const historyTypeOrder: Record<PatientHistoryType, number> = {
    'ALLERGY': 5,
    'MEDICAL': 4,
    'SURGICAL': 3,
    'FAMILY': 2,
    'SOCIAL': 1,
};

export const compareHistoryTypes = (typeA: PatientHistoryType, typeB: PatientHistoryType) => {
    const orderA = historyTypeOrder[typeA] || 999;
    const orderB = historyTypeOrder[typeB] || 999;
    return orderA - orderB;
};


export function getFinalBillSummary(bill: Bill) {
    // Group charges by type using a more efficient approach
    const chargesByType = bill.charges.reduce<Record<ChargeType, ChargeEntry[]>>((acc, charge) => {
        (acc[charge.type] ??= []).push(charge);
        return acc;
    }, {} as Record<ChargeType, ChargeEntry[]>);

    // Calculate medicine charge more concisely
    const medicineCharge = chargesByType['MEDICINE']?.[0]?.value ??
        bill.entries.reduce((sum, entry) => sum + entry.unitPrice * entry.quantity, 0);

    // Consolidated charge calculation function
    const calculateChargeTotal = (type: ChargeType) => chargesByType[type]?.reduce((sum, charge) => sum + charge.value, 0) ?? 0;

    // Calculate subtotal components
    const fixedCharges = calculateChargeTotal('FIXED');
    const procedureCharges = calculateChargeTotal('PROCEDURE');
    const subtotal = medicineCharge + fixedCharges + procedureCharges;

    // Calculate percentage and discount charges with a shared helper function
    const calculatePercentageBasedCharges = (type: ChargeType, baseValue: number) => (chargesByType[type] ?? []).map(charge => ({
        ...charge,
        calculatedValue: (baseValue * charge.value) / 100
    }));

    const percentageCharges = calculatePercentageBasedCharges('PERCENTAGE', subtotal);
    const percentageTotal = percentageCharges.reduce((sum, charge) => sum + charge.calculatedValue, 0);

    const discountCharges = calculatePercentageBasedCharges('DISCOUNT', subtotal + percentageTotal);
    const discountTotal = discountCharges.reduce((sum, charge) => sum + charge.calculatedValue, 0);

    // Return final calculation results
    return {
        subtotal,
        total: subtotal + percentageTotal - discountTotal,
        chargesByType,
        percentageCharges,
        discountCharges
    };
}
