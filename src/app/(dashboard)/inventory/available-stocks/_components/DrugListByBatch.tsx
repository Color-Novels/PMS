import { AiOutlineMedicineBox } from "react-icons/ai";
import { MdOutlineBrandingWatermark, MdEventAvailable } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppendButton from "./AppendButton";
import { CustomBadge } from "@/app/(dashboard)/_components/CustomBadge";

interface Batch {
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
}

export default function DrugListByBatch({ batches }: { batches: Batch[] }) {
    return (
        <div className="space-y-6 p-4">
            {batches.length > 0 ? (
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {batches.map((batch) => (
                        <Card key={batch.id} className="hover:shadow-lg transition-all duration-200">
                            <CardHeader className="flex flex-col items-center text-center">
                                <span className="text-lg font-semibold text-gray-500 dark:text-gray-400">
                                    Batch Number
                                </span>
                                <CardTitle className="text-2xl font-bold text-primary-500">
                                    {batch.batchNumber}
                                </CardTitle>
                                <CustomBadge
                                    text={batch.status}
                                    color={
                                        batch.status === "AVAILABLE"
                                            ? "green"
                                            : batch.status === "TRASHED"
                                                ? "red"
                                                : batch.status === "EXPIRED"
                                                    ? "yellow"
                                                    : batch.status === "COMPLETED"
                                                        ? "blue"
                                                        : "gray"
                                    }
                                />
                            </CardHeader>

                            <CardContent>
                                <div className="flex flex-col gap-4">
                                    {/* Model Name */}
                                    <div className="flex items-center gap-2 text-gray-700 dark:text-white font-medium">
                                        <AiOutlineMedicineBox className="size-6 text-blue-500" />
                                        <span>{batch.modelName} - {batch.unitConcentration}mg</span>
                                    </div>

                                    {/* Brand Name */}
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                        <MdOutlineBrandingWatermark className="size-6 text-purple-500" />
                                        <span>{batch.brandName}</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
                                        {/* Expiry Date */}
                                        <div className="flex flex-col items-center p-2 border rounded-lg bg-red-100 dark:bg-red-900">
                                            <FaCalendarAlt className="size-5 text-red-500" />
                                            <span className="font-semibold">Expiry</span>
                                            <span>{new Date(batch.expiryDate).toLocaleDateString("en-GB")}</span>
                                        </div>

                                        {/* Stock Date */}
                                        <div className="flex flex-col items-center p-2 border rounded-lg bg-green-100 dark:bg-green-900">
                                            <FaCalendarAlt className="size-5 text-green-500" />
                                            <span className="font-semibold">Added</span>
                                            <span>{new Date(batch.stockDate).toLocaleDateString("en-GB")}</span>
                                        </div>
                                    </div>

                                    {/* Stock Information */}
                                    <div className="flex items-center justify-center gap-2 text-lg font-semibold text-gray-700 dark:text-white">
                                        <MdEventAvailable className="size-6 text-gray-500" />
                                        {batch.remainingAmount} / {batch.fullAmount} Available
                                    </div>
                                </div>

                                {/* View Details Button */}
                                <AppendButton append={`batch/${batch.id}`} />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-center">No available batches found.</p>
            )}
        </div>
    );
}
