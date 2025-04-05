import React, {useState, useRef, useEffect} from "react";
import {ChevronDown} from "lucide-react";
import {DrugConcentrationDataSuggestion} from "@/app/lib/definitions";


interface CustomConcentrationSelectProps {
    value: number;
    onValueChange: (value: number) => void;
    concentrations: DrugConcentrationDataSuggestion[];
    className?: string;
}

const CustomConcentrationSelect: React.FC<CustomConcentrationSelectProps> = ({
                                                                                 value,
                                                                                 onValueChange,
                                                                                 concentrations,
                                                                                 className = "",
                                                                             }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (id: number) => {
        onValueChange(id);
        setIsOpen(false);
    };

    const selectedLabel = concentrations.find((c) => c.id === value)?.concentration || "Select Concentration";

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex h-8 w-full items-center justify-between rounded-md border border-input bg-card p-1 shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                    isOpen ? "ring-2 ring-primary" : ""
                } ${className}`}
            >
                <div className={`flex items-center gap-2`}>
                    <span className={`text-sm ${value ? "text-black" : "text-gray-500"}`}>{selectedLabel}</span>
                </div>
                <ChevronDown className={`h-4 w-4 opacity-50 transition-transform ${isOpen ? "rotate-180" : ""}`}/>
            </button>

            {isOpen && (
                <div
                    className="absolute z-50 w-full mt-1 rounded-md border bg-popover shadow-md animate-in fade-in-0 zoom-in-95 overflow-y-auto max-h-52">
                    <div className="p-1">
                        {concentrations.map((concentration) => (
                            <button
                                key={concentration.id}
                                onClick={() => handleSelect(concentration.id)}
                                className="w-full text-left px-3 py-1 text-sm hover:bg-accent hover:text-accent-foreground"
                            >
                                {concentration.concentration} mg/unit
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomConcentrationSelect;
