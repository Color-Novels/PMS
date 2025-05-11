"use client";

import React, {useState, useEffect} from "react";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {Checkbox} from "@/components/ui/checkbox";
import {Plus} from "lucide-react";
import {
    FaUser, FaIdCard, FaPhone, FaCalendarAlt, FaMapMarkerAlt,
    FaRuler, FaWeight
} from "react-icons/fa";
import {motion, AnimatePresence} from "framer-motion";
import {PatientFormData} from "@/app/lib/definitions";
import {handleServerAction} from "@/app/lib/utils";
import {addPatient} from "@/app/lib/actions";
import IconedInput from "@/app/(dashboard)/_components/IconedInput";
import CustomGenderSelect from "@/app/(dashboard)/patients/_components/CustomGenderSelect";
import {Label} from "@/components/ui/label";
import {Queue} from "@prisma/client";
import {getActiveQueue} from "@/app/lib/actions/queue";
import {addPatientToQueue} from "@/app/lib/actions/queue";
import {calcAge} from "@/app/lib/utils";

type Gender = "" | "MALE" | "FEMALE";

interface AddPatientFormProps {
    text?: string;
    queueId?: number;
    onSuccess?: () => void;
}

export default function AddPatientForm({
                                           text,
                                           onSuccess
                                       }: AddPatientFormProps) {
    const [open, setOpen] = useState(false);
    const [useAge, setUseAge] = useState(false);
    const [age, setAge] = useState("");
    const [formData, setFormData] = useState<PatientFormData>({
        name: "",
        NIC: "",
        telephone: "",
        birthDate: "",
        address: "",
        height: "",
        weight: "",
        gender: "",
    });
    const [queue, setQueue] = useState<Queue | null>(null)
    const [addToQueue, setAddToQueue] = useState(false);


    const resetForm = () => {
        setFormData({
            name: "",
            NIC: "",
            telephone: "",
            birthDate: "",
            address: "",
            height: "",
            weight: "",
            gender: "",
        });
        setAge("");
        setUseAge(false);
        setAddToQueue(false);
    }

    // Update birthDate when age changes
    useEffect(() => {
        if (useAge && age) {
            const currentYear = new Date().getFullYear();
            const birthYear = currentYear - parseInt(age);
            // Set to January 1st of the calculated year
            const calculatedBirthDate = `${birthYear}-01-01`;
            setFormData(prev => ({
                ...prev,
                birthDate: calculatedBirthDate
            }));
        }
    }, [age, useAge]);

    // Update age when birthDate changes
    useEffect(() => {
        if (formData.birthDate && !useAge) {
            try {
                const dobDate = new Date(formData.birthDate);
                if (!isNaN(dobDate.getTime())) {
                    const calculatedAge = calcAge(dobDate).toString();
                    setAge(calculatedAge);
                }
            } catch (e) {
                console.error("Error calculating age from birthDate:", e);
            }
        }
    }, [formData.birthDate, useAge]);

    // Fetch the active queue when the component mounts
    useEffect(() => {
        const fetchQueue = async () => {
            const activeQueue = await getActiveQueue();
            setQueue(activeQueue);
        };
        fetchQueue().then();
    }, []);

    const parseNIC = (nic: string) => {
        // Return early if NIC is not valid
        if (!nic || nic.length < 10) return null;

        let year: string;
        let monthDateCode: number;
        let gender: Gender = "";

        // New NIC format (12 digits): YYYYMMMDDDXXC
        if (nic.length === 12 && /^\d+$/.test(nic)) {
            year = nic.substring(0, 4);
            monthDateCode = parseInt(nic.substring(4, 7));

            // If monthDateCode >= 500, it's female, and we need to subtract 500
            if (monthDateCode >= 500) {
                monthDateCode -= 500;
                gender = "FEMALE";
            } else {
                gender = "MALE";
            }
        }
        // Old NIC format (9 digits + V/X): YYMMMDDDXV/X
        else if (nic.length === 10 && /^\d{9}[VvXx]$/.test(nic)) {
            // Get the year (19XX for old NICs)
            year = "19" + nic.substring(0, 2);
            monthDateCode = parseInt(nic.substring(2, 5));

            // If monthDateCode >= 500, it's female, and we need to subtract 500
            if (monthDateCode >= 500) {
                monthDateCode -= 500;
                gender = "FEMALE";
            } else {
                gender = "MALE";
            }
        } else {
            return null;
        }

        // Convert the monthDateCode to actual month and day
        // Sri Lankan NIC format: first 30 days are Jan, next 31 days are Feb, etc.
        const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        let month = 0;
        let day = monthDateCode;

        // Find the correct month and day
        while (day > daysInMonth[month]) {
            day -= daysInMonth[month];
            month++;
            if (month >= 12) break; // Safety check
        }

        // JavaScript months are 0-indexed, so month is already correct
        try {
            // Format date as YYYY-MM-DD for input type="date"
            const formattedMonth = (month + 1).toString().padStart(2, '0');
            const formattedDay = day.toString().padStart(2, '0');
            const formattedDate = `${year}-${formattedMonth}-${formattedDay}`;

            return {
                birthDate: formattedDate,
                gender: gender
            };
        } catch (e) {
            console.error("Error parsing NIC:", e);
            return null;
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});

        // If NIC field is changed, try to extract birthdate and gender
        if (name === "NIC") {
            const nicInfo = parseNIC(value);
            if (nicInfo) {
                setFormData(prev => ({
                    ...prev,
                    [name]: value,
                    birthDate: nicInfo.birthDate,
                    gender: nicInfo.gender
                }));
            }
        }
    };

    const handleGenderChange = (value: Gender) => {
        setFormData({...formData, gender: value});
    };

    const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Only allow numbers and empty string
        if (value === "" || /^\d+$/.test(value)) {
            setAge(value);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await handleServerAction(() => addPatient({formData}), {
            loadingMessage: "Adding Patient..."
        });

        if (result.success && result.data) {
            const newPatientId = result.data;

            // If addToQueue is true, add patient to queue
            if (addToQueue && queue) {
                const result = await handleServerAction(() => addPatientToQueue({
                    queueId: queue.id,
                    patientId: newPatientId
                }), {
                    loadingMessage: "Adding Patient to Queue..."
                });
                if (result.success) {
                    setOpen(false);
                    resetForm();
                    if (onSuccess) {
                        onSuccess();
                    }
                }
            } else {
                setOpen(false);
                resetForm();
                if (onSuccess) {
                    onSuccess();
                }
            }
        }
    }

    const handleCancel = () => {
        setFormData({
            name: "",
            NIC: "",
            telephone: "",
            birthDate: "",
            address: "",
            height: "",
            weight: "",
            gender: "",
        });
        setAge("");
        setUseAge(false);
        setOpen(false);
    };

    // Function to toggle between age and birthdate modes
    const toggleAgeMode = (useAgeMode: boolean) => {
        setUseAge(useAgeMode);

        if (useAgeMode && formData.birthDate) {
            // When switching to age mode, ensure age is calculated from birthDate
            try {
                const dobDate = new Date(formData.birthDate);
                if (!isNaN(dobDate.getTime())) {
                    const calculatedAge = calcAge(dobDate).toString();
                    setAge(calculatedAge);
                }
            } catch (e) {
                console.error("Error calculating age from birthDate:", e);
            }
        } else if (!useAgeMode && age) {
            // When switching to birthdate mode, ensure birthdate is calculated from age
            const currentYear = new Date().getFullYear();
            const birthYear = currentYear - parseInt(age);
            const calculatedBirthDate = `${birthYear}-01-01`;
            setFormData(prev => ({
                ...prev,
                birthDate: calculatedBirthDate
            }));
        }
    };

    // Animation variants
    const titleVariants = {
        initial: {
            opacity: 0,
            y: 0,
        },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            y: 0,
            transition: {
                duration: 0.2,
                ease: "easeIn"
            }
        }
    };

    const buttonVariants = {
        initial: {scale: 1},
        hover: {
            scale: 1.02,
            transition: {duration: 0.2}
        },
        tap: {scale: 0.98}
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <motion.div
                    variants={buttonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                >
                    <Button className="flex items-center space-x-2">
                        <Plus className="w-5 h-5"/>
                        <span>
                            {text
                                ? text
                                : "Add Patient"}
                        </span>
                    </Button>
                </motion.div>
            </DialogTrigger>

            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                        <Plus className="w-6 h-6 mr-2 text-green-600"/>
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={addToQueue && queue ? 'queue' : 'normal'}
                                variants={titleVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                            >
                                {addToQueue && queue
                                    ? `Add Patient & Add to Queue #${queue.id}`
                                    : "Add Patient"}
                            </motion.span>
                        </AnimatePresence>
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <IconedInput icon={<FaUser/>} name="name" value={formData.name} onChange={handleChange}
                                     placeholder="Full Name *" required={true}/>
                        <IconedInput icon={<FaIdCard/>} name="NIC" value={formData.NIC} onChange={handleChange}
                                     placeholder="NIC"/>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <IconedInput icon={<FaMapMarkerAlt/>} name="address" value={formData.address}
                                     onChange={handleChange} placeholder="Address"/>
                        <div className="flex flex-col space-y-2">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium">Date of Birth</Label>
                                <div className="flex items-center space-x-1 rounded-md bg-muted p-1">
                                    <motion.div
                                        whileHover={{scale: 1.02}}
                                        whileTap={{scale: 0.98}}
                                    >
                                        <Button
                                            variant={!useAge ? "default" : "ghost"}
                                            size="sm"
                                            type="button"
                                            onClick={() => toggleAgeMode(false)}
                                            className={`px-3 py-1 text-xs ${!useAge ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                                        >
                                            <FaCalendarAlt className="mr-1 h-3 w-3"/>
                                            Birthday
                                        </Button>
                                    </motion.div>
                                    <motion.div
                                        whileHover={{scale: 1.02}}
                                        whileTap={{scale: 0.98}}
                                    >
                                        <Button
                                            variant={useAge ? "default" : "ghost"}
                                            size="sm"
                                            type="button"
                                            onClick={() => toggleAgeMode(true)}
                                            className={`px-3 py-1 text-xs ${useAge ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                                        >
                                            <FaUser className="mr-1 h-3 w-3"/>
                                            Age
                                        </Button>
                                    </motion.div>
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                {useAge ? (
                                    <motion.div
                                        key="age-input"
                                        initial={{opacity: 0, y: 10}}
                                        animate={{opacity: 1, y: 0}}
                                        exit={{opacity: 0, y: -10}}
                                        transition={{duration: 0.3}}
                                        className="relative"
                                    >
                                        <IconedInput
                                            icon={<FaCalendarAlt/>}
                                            name="age"
                                            type="number"
                                            value={age}
                                            onChange={handleAgeChange}
                                            placeholder="Enter age in years"
                                            required={!formData.birthDate}
                                        />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="date-input"
                                        initial={{opacity: 0, y: 10}}
                                        animate={{opacity: 1, y: 0}}
                                        exit={{opacity: 0, y: -10}}
                                        transition={{duration: 0.3}}
                                    >
                                        <IconedInput
                                            icon={<FaCalendarAlt/>}
                                            name="birthDate"
                                            type="date"
                                            value={formData.birthDate}
                                            onChange={handleChange}
                                            required={!age}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <IconedInput
                        icon={<FaPhone/>}
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleChange}
                        placeholder="Telephone"
                        required={false}
                    />

                    <div className="grid grid-cols-3 gap-6">
                        <IconedInput icon={<FaRuler/>} name="height" type="number" value={formData.height}
                                     onChange={handleChange} placeholder="Height (cm)"/>
                        <IconedInput icon={<FaWeight/>} name="weight" type="number" value={formData.weight}
                                     onChange={handleChange} placeholder="Weight (kg)"/>
                        <CustomGenderSelect value={formData.gender} onValueChange={handleGenderChange}/>
                    </div>

                    {/* Checkbox for Add to active queue - simplified with larger checkbox */}
                    {queue && (
                        <div
                            className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors duration-200">
                            <Checkbox
                                id="add-to-queue"
                                checked={addToQueue}
                                onCheckedChange={(checked) => {
                                    setAddToQueue(checked === true);
                                }}
                                className="h-5 w-5" // Made checkbox larger
                            />
                            <Label
                                htmlFor="add-to-queue"
                                className="text-sm cursor-pointer select-none font-medium"
                            >
                                Add to active queue #{queue.id}
                            </Label>
                        </div>
                    )}

                    <DialogFooter>
                        <motion.div
                            whileHover={{scale: 1.02}}
                            whileTap={{scale: 0.98}}
                        >
                            <Button variant="outline" type="button" onClick={handleCancel}>
                                Cancel
                            </Button>
                        </motion.div>

                        <motion.div
                            whileHover={{scale: 1.02}}
                            whileTap={{scale: 0.98}}
                        >
                            <AnimatePresence mode="wait">
                                <Button
                                    type="submit"
                                    key={addToQueue && queue ? 'queue-button' : 'add-button'}
                                    className="relative overflow-hidden"
                                >
                                    <motion.span
                                        key={addToQueue && queue ? 'queue-text' : 'normal-text'}
                                        variants={titleVariants}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                        className="block"
                                    >
                                        {addToQueue && queue
                                            ? `Add Patient & Add to Queue #${queue.id}`
                                            : "Add Patient"}
                                    </motion.span>
                                </Button>
                            </AnimatePresence>
                        </motion.div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}