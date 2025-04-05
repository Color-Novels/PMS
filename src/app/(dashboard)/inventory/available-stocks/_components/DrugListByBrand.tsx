import {MdOutlineBrandingWatermark} from "react-icons/md";
import {AiFillMedicineBox} from "react-icons/ai";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import AppendButton from "./AppendButton";

interface Brand {
    id: number;
    name: string;
    modelCount: number;
}

export default function BrandListCard({brands}: { brands: Brand[] }) {
    return (
        <div className="space-y-6 p-4">
            {brands.length > 0 ? (
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {brands.map((brand) => (
                        <Card
                            className="hover:shadow-lg transition-all duration-200"
                            key={brand.id}
                        >
                            {/* Icon and Brand Name */}
                            <CardHeader className="flex gap-4">
                                <CardTitle className="flex items-center justify-start gap-4">
                                    <MdOutlineBrandingWatermark className="size-10 text-primary-500"/>
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                                        {brand.name}
                                    </h3>
                                </CardTitle>
                            </CardHeader>

                            {/* Number of Models Available */}
                            <CardContent>
                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center gap-2">
                                        <AiFillMedicineBox className="w-6 h-6 text-gray-500"/>
                                        <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                                            {brand.modelCount} Models Available
                                        </span>
                                    </div>
                                </div>

                                {/* View Details Button */}
                                <AppendButton append={`brand/${brand.id}`}/>

                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-center">No brands with available stock.</p>
            )}
        </div>
    );
}
