import React, {useState, useRef, useEffect} from 'react';
import {CreditCard, Percent, Tag, FileText, ChevronDown} from 'lucide-react';
import {ChargeType} from "@prisma/client";

const CustomSelect = ({value, onChange}: { value: ChargeType, onChange: (vale: ChargeType) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement | null>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle option selection
    const handleSelect = (optionValue: ChargeType) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    // Get display text and icon based on value
    const getDisplayContent = () => {
        switch (value) {
            case 'FIXED':
                return {text: 'Fixed', icon: <CreditCard size={16} className="text-blue-600"/>};
            case 'PERCENTAGE':
                return {text: 'Percentage', icon: <Percent size={16} className="text-green-600"/>};
            case 'DISCOUNT':
                return {text: 'Discount', icon: <Tag size={16} className="text-amber-600"/>};
            case 'PROCEDURE':
                return {text: 'Procedure', icon: <FileText size={16} className="text-purple-600"/>};
            default:
                return {text: 'Select type', icon: null};
        }
    };

    const displayContent = getDisplayContent();

    return (
        <div className="relative w-full" ref={selectRef}>
            {/* Trigger button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between w-fit px-4 py-2.5 text-left bg-white border rounded-lg shadow-sm 
                    ${isOpen ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-300 hover:border-gray-400'} 
                    transition-all duration-200 ease-in-out focus:outline-none`}
            >
                <div className="flex items-center space-x-2">
                    {displayContent.icon}
                    <span className={`${!value ? 'text-gray-500' : 'font-medium text-gray-800'}`}>
                    {displayContent.text}
                    </span>
                </div>
                <ChevronDown
                    size={18}
                    className={`text-gray-500 transition-transform duration-200 ml-2 ${isOpen ? 'transform rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div
                    className="absolute z-10 w-fit mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 animate-fadeIn">
                    <div className="max-h-60 overflow-auto">
                        {/* Fixed Option */}
                        <div
                            onClick={() => handleSelect('FIXED')}
                            className={`flex items-center px-4 py-2.5 cursor-pointer
                         ${value === 'FIXED' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-800'}`}
                        >
                            <CreditCard size={16}
                                        className={`mr-2 ${value === 'FIXED' ? 'text-blue-600' : 'text-gray-500'}`}/>
                            <span className={value === 'FIXED' ? 'font-medium' : ''}>Fixed</span>
                        </div>

                        {/* Percentage Option */}
                        <div
                            onClick={() => handleSelect('PERCENTAGE')}
                            className={`flex items-center px-4 py-2.5 cursor-pointer
                         ${value === 'PERCENTAGE' ? 'bg-green-50 text-green-700' : 'hover:bg-gray-50 text-gray-800'}`}
                        >
                            <Percent size={16}
                                     className={`mr-2 ${value === 'PERCENTAGE' ? 'text-green-600' : 'text-gray-500'}`}/>
                            <span className={value === 'PERCENTAGE' ? 'font-medium' : ''}>Percentage</span>
                        </div>

                        {/* Discount Option */}
                        <div
                            onClick={() => handleSelect('DISCOUNT')}
                            className={`flex items-center px-4 py-2.5 cursor-pointer
                         ${value === 'DISCOUNT' ? 'bg-purple-50 text-purple-700' : 'hover:bg-gray-50 text-gray-800'}`}
                        >
                            <Tag size={16}
                                 className={`mr-2 ${value === 'DISCOUNT' ? 'text-purple-600' : 'text-gray-500'}`}/>
                            <span className={value === 'DISCOUNT' ? 'font-medium' : ''}>Discount</span>
                        </div>

                        {/* Procedure Option */}
                        <div
                            onClick={() => handleSelect('PROCEDURE')}
                            className={`flex items-center px-4 py-2.5 cursor-pointer
                         ${value === 'PROCEDURE' ? 'bg-amber-50 text-amber-700' : 'hover:bg-gray-50 text-gray-800'}`}
                        >
                            <FileText size={16}
                                      className={`mr-2 ${value === 'PROCEDURE' ? 'text-amber-600' : 'text-gray-500'}`}/>
                            <span className={value === 'PROCEDURE' ? 'font-medium' : ''}>Procedure</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomSelect;