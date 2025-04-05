// app/(dashboard)/inventory/_components/SupplierSuggestionBox.tsx

import React from "react";
import { SupplierSuggestion } from "@/app/lib/definitions";

interface SupplierSuggestionBoxProps {
  suggestions: SupplierSuggestion[];
  visible: boolean;
  onSelect: (suggestion: SupplierSuggestion) => void;
}

export function SupplierSuggestionBox({
  suggestions,
  visible,
  onSelect,
}: SupplierSuggestionBoxProps) {
  if (!visible || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
      <ul className="py-1">
        {suggestions.map((suggestion) => (
          <li
            key={suggestion.id}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => onSelect(suggestion)}
          >
            <div className="font-medium">{suggestion.name}</div>
            {suggestion.contact && (
              <div className="text-xs text-gray-500">{suggestion.contact}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
