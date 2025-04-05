import { getBatchData } from '@/app/lib/actions'; // Adjust the import path as necessary
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AiOutlineMedicineBox } from 'react-icons/ai';
import { MdEventAvailable, MdOutlineBrandingWatermark } from 'react-icons/md';
import { FaCalendarAlt, FaCoins } from 'react-icons/fa';
import { CustomBadge } from '@/app/(dashboard)/_components/CustomBadge';
import { GiMedicines } from "react-icons/gi";
import { FiShoppingCart } from 'react-icons/fi';
import BatchStatusChangeButtonBar from '@/app/(dashboard)/inventory/available-stocks/_components/BatchStatusChangeButtonBar';

export default async function BatchDetail({ batchId }: { batchId: string }) {
    const batchData = await getBatchData(parseInt(batchId));

    return (
        <div className="flex flex-col flex-grow w-full p-4 gap-4">
            {/* Header */}
            <div className="flex justify-between items-center bg-primary/10 p-6 rounded-xl shadow-sm">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Batch #{batchData.number}</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Batch details and stock status</p>
                </div>
            </div>

            <Card className="rounded-xl shadow-md">
                {/* Header */}
                <CardHeader className="p-6 border-b flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center gap-3">
                        <AiOutlineMedicineBox className="size-10 text-blue-500" />
                        <CardTitle className="text-3xl font-semibold">{batchData.drugName} - {batchData.unitConcentration}mg</CardTitle>
                    </div>
                    <CustomBadge
                        text={batchData.status}
                        color={
                            batchData.status === "AVAILABLE"
                                ? "green"
                                : batchData.status === "DISPOSED"
                                    ? "red"
                                    : batchData.status === "EXPIRED"
                                        ? "yellow"
                                        : batchData.status === "QUALITY_FAILED"
                                            ? "violet"
                                            : batchData.status === "COMPLETED"
                                                ? "blue"
                                                : "gray"
                        }
                        className="text-sm px-4 py-1"
                    />
                </CardHeader>

                <CardContent className="p-6 space-y-6 text-gray-700 dark:text-gray-300">
                    {/* Drug Information */}
                    <div className="grid grid-cols-3 gap-6 text-center">
                        <div className="flex flex-col items-center">
                            <MdOutlineBrandingWatermark className="size-6 text-purple-500" />
                            <span className="font-medium"><strong>Brand:</strong> {batchData.drugBrandName}</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <FiShoppingCart className="size-6 text-pink-500" />
                            <span className="font-medium"><strong>Supplier:</strong> {batchData.supplier}</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <GiMedicines className="size-6 text-gray-500" />
                            <span className="font-medium"><strong>Type:</strong> {batchData.drugType}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-6 text-center">
                        <div className="flex flex-col items-center">
                            <FaCoins className="size-6 text-yellow-500" />
                            <span className="text-xl font-semibold text-primary">
                                {Number(batchData.wholesalePrice).toFixed(2)}
                            </span>
                            <span className="font-medium">Wholesale price</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <FaCoins className="size-6 text-yellow-500" />
                            <span className="text-xl font-semibold text-primary">
                                {Number(batchData.retailPrice).toFixed(2)}
                            </span>
                            <span className="font-medium">Retail price</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <FaCoins className="size-6 text-yellow-500" />
                            <span className="text-xl font-semibold text-primary">
                                {(batchData.wholesalePrice * batchData.fullAmount).toFixed(2)}
                            </span>
                            <span className="font-medium">Batch cost</span>
                        </div>
                    </div>

                    {/* Stock Details */}
                    <div className="bg-primary/10 p-4 rounded-lg grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="flex flex-col items-center">
                            <FaCalendarAlt className="size-6 text-red-500" />
                            <span className="font-semibold">Expiry Date</span>
                            <span>{new Date(batchData.expiryDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <FaCalendarAlt className="size-6 text-green-500" />
                            <span className="font-semibold">Stock Added</span>
                            <span>{new Date(batchData.stockDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <MdEventAvailable className="size-6 text-gray-500" />
                            <span className="font-semibold">Stock Available</span>
                            <span>{batchData.remainingQuantity} / {batchData.fullAmount}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <BatchStatusChangeButtonBar batchId={batchId} />
            </div>
        </div>
    );
}
