import React, {Suspense, useState} from "react";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import type {BasicColorType} from "@/app/(dashboard)/_components/CustomBadge";
import CustomColorPicker from "@/app/(dashboard)/admin/prescription/_components/CustomColorPicker";
import {ScrollArea} from "@/components/ui/scroll-area";
import {getTextColorClass} from "@/app/lib/utils";
import iconMapping, {IconName} from "@/app/lib/iconMapping";
import DynamicIcon from "@/app/(dashboard)/_components/DynamicIcon";

interface IconSelectorDialogProps {
    buttonClassName?: string;
    children?: React.ReactNode;
    onSelect: (icon: IconName, color: keyof BasicColorType) => void;
    selectedIconP?: IconName;
    selectedColorP?: keyof BasicColorType;
}

const IconSelectorDialog: React.FC<IconSelectorDialogProps> = ({
                                                                   buttonClassName,
                                                                   children,
                                                                   onSelect,
                                                                   selectedIconP,
                                                                   selectedColorP
                                                               }) => {
    const [searchTerm, setSearchTerm] = useState(selectedIconP || "");
    const [selectedIcon, setSelectedIcon] = useState<IconName | null>(selectedIconP || null);
    const [selectedColor, setSelectedColor] = useState<keyof BasicColorType>(selectedColorP || "red");
    const [open, setOpen] = useState(false);

    const handleIconSelect = (icon: IconName) => {
        setSelectedIcon(icon);
        onSelect(icon, selectedColor);
        setOpen(false); // Close the dialog after selection
    };

    const handleColorSelect = (color: keyof BasicColorType) => {
        setSelectedColor(color);
        if (selectedIcon) {
            onSelect(selectedIcon, color);
        }
    };

    const filteredIcons = Object.keys(iconMapping).filter((icon) => icon.toLowerCase().includes(searchTerm.toLowerCase()))

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className={buttonClassName}>{children || "Select an icon"}</div>
            </DialogTrigger>
            <DialogContent
                className="lg:max-w-lg overflow-y-auto max-h-screen"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <DialogTitle>Select an icon</DialogTitle>
                <Input
                    type="text"
                    placeholder="Search icons..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {/* Color Picker */}
                <div className="mt-4">
                    <p className="mb-2 text-sm font-medium">Select Color:</p>
                    <CustomColorPicker selectedColor={selectedColor} onSelectColor={handleColorSelect}/>
                </div>

                <ScrollArea className="max-h-52 mt-4">
                    <div className="grid grid-cols-8 gap-4 p-2">
                        {filteredIcons.map((icon) => (
                            <div
                                key={icon}
                                onClick={() => handleIconSelect(icon)}
                                className={`cursor-pointer p-1 rounded-md flex items-center justify-center ${
                                    selectedIcon === icon ? "bg-gray-200 ring-2 ring-primary" : ""
                                }`}
                            >
                                <Suspense fallback={<div>Loading...</div>}>
                                    <DynamicIcon
                                        icon={icon}
                                        className={`text-2xl ${getTextColorClass(selectedColor)}`}
                                    />
                                </Suspense>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                <DialogClose asChild>
                    <Button variant="outline" className="mt-4">Cancel</Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
};

export default IconSelectorDialog;