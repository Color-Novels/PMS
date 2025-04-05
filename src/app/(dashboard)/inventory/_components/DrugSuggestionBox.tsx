import { DrugModelSuggestion } from "@/app/lib/definitions";
import React from "react";

interface DrugSuggestionBoxProps {
  suggestions: DrugModelSuggestion[];
  onSelect: (suggestion: DrugModelSuggestion) => void;
  visible: boolean;
}

export function DrugSuggestionBox({
  suggestions,
  onSelect,
  visible,
}: DrugSuggestionBoxProps) {
  if (!visible || suggestions.length === 0) return null;

  return (
    <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg">
      {suggestions.map((suggestion) => (
        <div
          key={suggestion.id}
          className="p-2 cursor-pointer hover:bg-gray-100"
          onClick={() => onSelect(suggestion)}
        >
          <div className="font-medium">{suggestion.name}</div>
        </div>
      ))}
    </div>
  );
}
