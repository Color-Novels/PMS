import React, {useState, useRef, useEffect} from "react";
import {ChevronDown, Check} from "lucide-react";
import {DrugType} from "@prisma/client";
import {FaPills, FaCapsules, FaWineBottle, FaEyeDropper, FaAssistiveListeningSystems, FaSprayCan} from 'react-icons/fa';
import {GiNoseFront, GiLiquidSoap, GiSyringe, GiMedicinePills, GiPowder} from 'react-icons/gi';
import {CgPill, CgSmileMouthOpen} from 'react-icons/cg';
import {BsPatchCheck, BsCupStraw} from 'react-icons/bs';
import {BiSolidFlask} from 'react-icons/bi';
import {TbBottle} from 'react-icons/tb';


interface Option {
    value: DrugType;
    label: string;
    icon: React.ReactNode;
}

interface CustomDrugTypeSelectProps {
    value: DrugType;
    onValueChange: (value: DrugType) => void;
    className?: string;
}

const CustomDrugTypeSelect: React.FC<CustomDrugTypeSelectProps> = ({
                                                                       value,
                                                                       onValueChange,
                                                                       className = "",
                                                                   }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const options: Option[] = [
        {
            value: "TABLET",
            label: "Tablet",
            icon: <FaPills className="w-4 h-4 text-green-600"/>,
        },
        {
            value: "CAPSULE",
            label: "Capsule",
            icon: <FaCapsules className="w-4 h-4 text-yellow-600"/>,
        },
        {
            value: "SYRUP",
            label: "Syrup",
            icon: <FaWineBottle className="w-4 h-4 text-blue-600"/>,
        },
        {
            value: "EYE_DROP",
            label: "Eye Drop",
            icon: <FaEyeDropper className="w-4 h-4 text-cyan-600"/>,
        },
        {
            value: "EAR_DROP",
            label: "Ear Drop",
            icon: <FaAssistiveListeningSystems className="w-4 h-4 text-purple-600"/>,
        },
        {
            value: "NASAL_DROP",
            label: "Nasal Drop",
            icon: <GiNoseFront className="w-4 h-4 text-pink-600"/>,
        },
        {
            value: "CREAM",
            label: "Cream",
            icon: <GiLiquidSoap className="w-4 h-4 text-orange-600"/>,
        },
        {
            value: "OINTMENT",
            label: "Ointment",
            icon: <GiLiquidSoap className="w-4 h-4 text-amber-600"/>,
        },
        {
            value: "GEL",
            label: "Gel",
            icon: <GiLiquidSoap className="w-4 h-4 text-blue-400"/>,
        },
        {
            value: "LOTION",
            label: "Lotion",
            icon: <GiLiquidSoap className="w-4 h-4 text-teal-600"/>,
        },
        {
            value: "INJECTION",
            label: "Injection",
            icon: <GiSyringe className="w-4 h-4 text-red-600"/>,
        },
        {
            value: "INHALER",
            label: "Inhaler",
            icon: <GiNoseFront className="w-4 h-4 text-blue-500"/>,
        },
        {
            value: "SPRAY",
            label: "Spray",
            icon: <FaSprayCan className="w-4 h-4 text-indigo-600"/>,
        },
        {
            value: "LOZENGE",
            label: "Lozenge",
            icon: <GiMedicinePills className="w-4 h-4 text-pink-500"/>,
        },
        {
            value: "SUPPOSITORY",
            label: "Suppository",
            icon: <CgPill className="w-4 h-4 text-gray-600"/>,
        },
        {
            value: "PATCH",
            label: "Patch",
            icon: <BsPatchCheck className="w-4 h-4 text-emerald-600"/>,
        },
        {
            value: "POWDER",
            label: "Powder",
            icon: <GiPowder className="w-4 h-4 text-gray-500"/>,
        },
        {
            value: "SOLUTION",
            label: "Solution",
            icon: <BiSolidFlask className="w-4 h-4 text-blue-300"/>,
        },
        {
            value: "SUSPENSION",
            label: "Suspension",
            icon: <TbBottle className="w-4 h-4 text-violet-500"/>,
        },
        {
            value: "GARGLE",
            label: "Gargle",
            icon: <BsCupStraw className="w-4 h-4 text-cyan-500"/>,
        },
        {
            value: "MOUTHWASH",
            label: "Mouthwash",
            icon: <CgSmileMouthOpen className="w-4 h-4 text-teal-500"/>,
        }
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (option: Option) => {
        onValueChange(option.value);
        setIsOpen(false);
    };

    const selected = options.find((opt) => opt.value === value);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex h-8 w-full items-center justify-between rounded-md border border-input bg-card px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                    isOpen ? "ring-2 ring-primary" : ""
                } ${className}`}
            >
                <span className="flex items-center gap-2">
                    {selected ? (
                        <>
                            {selected.icon}
                            <span>{selected.label}</span>
                        </>
                    ) : (
                        <span className="text-gray-500">Select Drug Type</span>
                    )}
                </span>
                <ChevronDown className={`h-4 w-4 opacity-50 transition-transform ${isOpen ? "rotate-180" : ""}`}/>
            </button>

            {isOpen && (
                <div
                    className="absolute z-50 w-full mt-1 rounded-md border bg-popover shadow-md animate-in fade-in-0 zoom-in-95 max-h-[15rem] overflow-y-auto">
                    <div className="p-1">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleSelect(option)}
                                className={`relative flex w-full items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground ${
                                    value === option.value ? "bg-accent" : ""
                                }`}
                            >
                                <div className="flex gap-2 items-center">
                                    {option.icon}
                                    <span>{option.label}</span>
                                </div>
                                {value === option.value && (
                                    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                                        <Check className="h-4 w-4"/>
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomDrugTypeSelect;
