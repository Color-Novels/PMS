import React from "react";
import { getDrugModelsWithBufferLevel } from "@/app/lib/actions";
import { SingleDrugBufferCard } from "@/app/(dashboard)/inventory/_components/DrugModelCard";
import BufferTopBar from "@/app/(dashboard)/inventory/_components/BufferTopBar";

export default async function BufferLevelPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Extract query parameters
  const awaitedSearchParams = await searchParams;

  const query =
    typeof awaitedSearchParams.query === "string"
      ? awaitedSearchParams.query
      : undefined;
  const selection =
    typeof awaitedSearchParams.selection === "string"
      ? awaitedSearchParams.selection
      : "buffered";

  // Get drugs with filtering and sorting
  const drugs = await getDrugModelsWithBufferLevel(query, selection);

  // Create a flattened array of individual drug cards
  const drugCards = drugs.flatMap((drug) => {
    // Map each buffer level to its own card data
    return drug.bufferLevels.map((bufferLevel) => {
      return {
        id: drug.id,
        name: drug.name,
        fullAmount: drug.fullAmount,
        availableAmount: drug.availableAmount,
        type: bufferLevel.type,
        concentration: bufferLevel.unitConcentration.concentration,
        bufferAmount: bufferLevel.bufferAmount,
        // Create a unique key for each card
        uniqueKey: `${drug.id}-${bufferLevel.type}-${bufferLevel.unitConcentration.concentration}`,
      };
    });
  });

  return (
    <div className="flex flex-col overflow-hidden h-full">
      <BufferTopBar />
      <div className="flex flex-col flex-1 h-full p-4 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6 text-primary-700">
          Drug Buffer Levels
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drugCards.map((drugCard) => (
            <SingleDrugBufferCard
              key={drugCard.uniqueKey}
              drugCard={drugCard}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
