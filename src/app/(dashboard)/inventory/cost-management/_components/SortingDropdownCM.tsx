// SortingDropdownCM.tsx
import Dropdown from "@/app/(dashboard)/_components/Dropdown";

export default function SortingDropdownCM({
  selection,
}: {
  selection: string;
}) {
  const sortOptions = [
    { label: "Alphabetically", value: "alphabetically" },
    { label: "Total Price (Highest)", value: "highest" },
    { label: "Total Price (Lowest)", value: "lowest" },
  ];

  if (selection === "batch") {
    sortOptions.push(
      { label: "Cost per Unit (Highest)", value: "unit-highest" },
      { label: "Cost per Unit (Lowest)", value: "unit-lowest" }
    );
  }

  return <Dropdown items={sortOptions} urlParameterName="sort" />;
}
