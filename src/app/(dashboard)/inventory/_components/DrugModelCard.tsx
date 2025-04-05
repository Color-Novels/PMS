"use client";
import React, {useState} from "react";
import {Card, CardContent, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {Input} from "@/components/ui/input";
import {updateDrugBufferLevel} from "@/app/lib/actions";
import {handleServerAction} from "@/app/lib/utils";
import {BasicColorType, CustomBadge,} from "@/app/(dashboard)/_components/CustomBadge";
import {Button} from "@/components/ui/button";
import {ChevronDown, ChevronUp} from "lucide-react";
import {DrugBufferStatus} from "@/app/(dashboard)/inventory/buffer-level/page";

export function SingleDrugBufferCard({drugCard}: { drugCard: DrugBufferStatus }) {
    const [newBufferLevel, setNewBufferLevel] = useState(
        drugCard.bufferAmount.toString()
    );
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Use the buffer amount directly from the drugCard
    const bufferAmount = drugCard.bufferAmount;

    const handleSubmit = async () => {
        const parsedLevel = parseInt(newBufferLevel);
        if (isNaN(parsedLevel) || parsedLevel < 0) return;

        setIsLoading(true);

        try {
            const result = await handleServerAction(
                () =>
                    updateDrugBufferLevel(
                        drugCard.drugId,
                        drugCard.type,
                        drugCard.unitConcentrationId,
                        parsedLevel
                    ),
                {
                    loadingMessage: "Updating buffer level...",
                    position: "bottom-right",
                }
            );

            if (result && result.success) {
                // Update the component state
                drugCard.bufferAmount = parsedLevel;
                setIsOpen(false);
            }
        } catch (error) {
            console.error("Failed to update buffer level:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Determine status and styles
    const getStyles = () => {
        if (drugCard.remainingQuantity === 0) {
            return {
                headerBg: "bg-gray-300",
                statusText: "Out of Stock",
                badgeColor: "gray" as keyof BasicColorType,
            };
        } else if (drugCard.remainingQuantity <= bufferAmount) {
            return {
                headerBg: "bg-red-100",
                statusText: "Low Stock",
                badgeColor: "red" as keyof BasicColorType,
            };
        } else {
            return {
                headerBg: "bg-emerald-100",
                statusText: "In Stock",
                badgeColor: "emerald" as keyof BasicColorType,
            };
        }
    };

    const styles = getStyles();

    const maxRef = Math.max(drugCard.fullAmount, bufferAmount);
    const stockPercentage = ((drugCard.remainingQuantity / maxRef) * 100).toFixed(
        2
    );

    return (
        <Card className="border border-gray-200 shadow-sm rounded-lg overflow-hidden">
            <CardHeader className={`px-4 py-3 ${styles.headerBg}`}>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-base font-semibold text-gray-800">
                        {drugCard.drugName} - {drugCard.type} ({drugCard.unitConcentrationValue}/unit)
                    </CardTitle>
                    <CustomBadge
                        text={styles.statusText}
                        className="ml-2"
                        color={styles.badgeColor}
                        inverse
                    />
                </div>
            </CardHeader>

            <CardContent className="px-4 py-3 grid grid-cols-2 gap-4 text-gray-700">
                <div>
          <span className="text-sm font-medium text-gray-500">
            Available / Stocked
          </span>
                    <p className="text-lg font-semibold">
                        {drugCard.remainingQuantity} / {drugCard.fullAmount}
                    </p>
                </div>
                <div>
          <span className="text-sm font-medium uppercase text-gray-500">
            Buffer Level
          </span>
                    <p className="text-lg font-semibold">{bufferAmount}</p>
                </div>

                {/* Enhanced Stock Level Bar */}
                <div className="col-span-2">
                    <div className="flex justify-between items-center mb-1 text-xs text-gray-500">
                        <span>Stock Level</span>
                        <span>{stockPercentage}%</span>
                    </div>

                    {/* Stock bar container with relative positioning */}
                    <div className="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden">
                        {/* Progress bar */}
                        <div
                            className={`h-4 rounded-full transition-all duration-300 ${
                                drugCard.remainingQuantity === 0
                                    ? "bg-gray-400"
                                    : drugCard.remainingQuantity < bufferAmount
                                        ? "bg-red-500"
                                        : "bg-emerald-500"
                            }`}
                            style={{width: `${stockPercentage}%`}}
                        >
                            {/* Buffer level indicator inside the progress bar */}
                            {bufferAmount > 0 && drugCard.fullAmount > 0 && (
                                <div
                                    className="absolute top-0 bottom-0 w-1 bg-black"
                                    style={{
                                        left: `${Math.min(100, (bufferAmount / maxRef) * 100)}%`,
                                        height: "100%",
                                    }}
                                ></div>
                            )}
                        </div>
                    </div>

                    {/* Buffer status indicator */}
                    <div className="flex items-center mt-2">
                        {drugCard.remainingQuantity < bufferAmount ? (
                            <div className="flex items-center text-red-600">
                                <ChevronDown/>
                                <span className="text-xs">
                  {(bufferAmount - drugCard.remainingQuantity).toFixed(2)} units below buffer
                </span>
                            </div>
                        ) : (
                            <div className="flex items-center text-green-600">
                                <ChevronUp/>
                                <span className="text-xs">
                  {(drugCard.remainingQuantity - bufferAmount).toFixed(2)} units above buffer
                </span>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>

            <CardFooter className="px-4 py-3">
                <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                    <AlertDialogTrigger asChild>
                        <Button
                            className="w-full"
                            onClick={() => {
                                setNewBufferLevel(bufferAmount.toString());
                            }}
                        >
                            Adjust Buffer
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Adjust Buffer Level</AlertDialogTitle>
                            <AlertDialogDescription>
                                Set the minimum stock threshold for {drugCard.drugName} -{" "}
                                {drugCard.type} ({drugCard.unitConcentrationValue}/unit). You will receive
                                alerts when available amount falls below this level.
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <div className="py-4">
                            <Input
                                type="number"
                                min="0"
                                value={newBufferLevel}
                                onChange={(e) => setNewBufferLevel(e.target.value)}
                                placeholder="Enter new buffer level"
                                className="w-full"
                            />
                        </div>

                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setIsOpen(false)}>
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={handleSubmit} disabled={isLoading}>
                                {isLoading ? "Saving..." : "Save Changes"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        </Card>
    );
}
