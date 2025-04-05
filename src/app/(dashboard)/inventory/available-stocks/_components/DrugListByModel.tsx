import {AiOutlineMedicineBox} from "react-icons/ai";
import {MdOutlineBrandingWatermark} from "react-icons/md";
import {MdEventAvailable} from "react-icons/md";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import AppendButton from "./AppendButton";

interface Drug {
    id: number;
    name: string;
    totalRemainingQuantity: number;
    brandCount: number;
}

export default function DrugListMyModel({drugs}: { drugs: Drug[] }) {
    return (
        <div className="space-y-6 p-4">
            {drugs.length > 0 ? (
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {drugs.map((drug) => {
                        const isLowStock = drug.totalRemainingQuantity < 25;

                        return (
                            <Card
                                className="hover:shadow-lg transition-all duration-200"
                                key={drug.id}
                            >
                                {/* Icon and Name */}
                                <CardHeader className="flex gap-4">
                                    <CardTitle className="flex items-center justify-start gap-4">
                                        <AiOutlineMedicineBox className="size-10 text-primary-500"/>
                                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                                            {drug.name}
                                        </h3>
                                    </CardTitle>
                                </CardHeader>

                                {/* Stock and Brand Count Line */}
                                <CardContent>
                                    <div className="flex items-center justify-between mt-4">
                                        {/* Stock */}
                                        <div className="flex items-center gap-2">
                                            <MdEventAvailable
                                                className={`w-6 h-6 ${isLowStock ? 'text-red-500' : 'text-gray-500'}`}
                                            />
                                            <span
                                                className={`text-lg font-medium ${isLowStock ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'}`}
                                            >
                                                {drug.totalRemainingQuantity} Available
                                            </span>
                                        </div>

                                        {/* Brand Count */}
                                        <div className="flex items-center gap-2">
                                            <MdOutlineBrandingWatermark className="text-primary-500 w-5 h-5"/>
                                            <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                                                {drug.brandCount} Brands
                                            </span>
                                        </div>
                                    </div>

                                    {/* View Details Button */}
                                    <AppendButton append={`drug/${drug.id}`}/>

                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <p className="text-gray-500 text-center">No medicines found.</p>
            )}
        </div>
    );
}
