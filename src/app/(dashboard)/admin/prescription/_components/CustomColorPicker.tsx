import React from "react";
import type { BasicColorType } from "@/app/(dashboard)/_components/CustomBadge";
import { cn } from "@/lib/utils";

export const iconColors: BasicColorType = {
    slate: "slate",
    gray: "gray",
    zinc: "zinc",
    neutral: "neutral",
    stone: "stone",
    red: "red",
    orange: "orange",
    amber: "amber",
    yellow: "yellow",
    lime: "lime",
    green: "green",
    emerald: "emerald",
    teal: "teal",
    cyan: "cyan",
    sky: "sky",
    blue: "blue",
    indigo: "indigo",
    fuchsia: "fuchsia",
    pink: "pink",
    purple: "purple",
    rose: "rose",
    violet: "violet",
};

interface CustomColorPickerProps {
    selectedColor: keyof BasicColorType;
    onSelectColor: (color: keyof BasicColorType) => void;
}

const CustomColorPicker: React.FC<CustomColorPickerProps> = ({
                                                                 selectedColor,
                                                                 onSelectColor,
                                                             }) => {
    return (
        <div className="flex flex-wrap gap-2 p-2">
            {Object.keys(iconColors).map((color) => (
                <button
                    key={color}
                    onClick={() => onSelectColor(color as keyof BasicColorType)}
                    className={cn(
                        "w-8 h-8 rounded-lg cursor-pointer transition-all",
                        {
                            "bg-slate-500 hover:bg-slate-600": color === "slate",
                            "bg-gray-500 hover:bg-gray-600": color === "gray",
                            "bg-zinc-500 hover:bg-zinc-600": color === "zinc",
                            "bg-neutral-500 hover:bg-neutral-600": color === "neutral",
                            "bg-stone-500 hover:bg-stone-600": color === "stone",
                            "bg-red-500 hover:bg-red-600": color === "red",
                            "bg-orange-500 hover:bg-orange-600": color === "orange",
                            "bg-amber-500 hover:bg-amber-600": color === "amber",
                            "bg-yellow-500 hover:bg-yellow-600": color === "yellow",
                            "bg-lime-500 hover:bg-lime-600": color === "lime",
                            "bg-green-500 hover:bg-green-600": color === "green",
                            "bg-emerald-500 hover:bg-emerald-600": color === "emerald",
                            "bg-teal-500 hover:bg-teal-600": color === "teal",
                            "bg-cyan-500 hover:bg-cyan-600": color === "cyan",
                            "bg-sky-500 hover:bg-sky-600": color === "sky",
                            "bg-blue-500 hover:bg-blue-600": color === "blue",
                            "bg-indigo-500 hover:bg-indigo-600": color === "indigo",
                            "bg-violet-500 hover:bg-violet-600": color === "violet",
                            "bg-purple-500 hover:bg-purple-600": color === "purple",
                            "bg-fuchsia-500 hover:bg-fuchsia-600": color === "fuchsia",
                            "bg-pink-500 hover:bg-pink-600": color === "pink",
                            "bg-rose-500 hover:bg-rose-600": color === "rose",
                        },
                        selectedColor === color && "ring-2 ring-offset-2"
                    )}
                />
            ))}
        </div>
    );
};

export default CustomColorPicker;