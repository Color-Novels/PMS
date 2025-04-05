import React from "react";
import Dropdown from "@/app/(dashboard)/_components/Dropdown";
import { searchModels } from "@/app/lib/definitions";

function SortingDropdown({ selection }: { selection: string }) {
  const selectedSort = searchModels.filter(
    (search) => search.value === selection
  );

  return (
    <div>
      <Dropdown items={selectedSort[0]?.sortOptions} urlParameterName="sort" />
    </div>
  );
}

export default SortingDropdown;
