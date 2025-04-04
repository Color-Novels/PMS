"use client";

import {usePathname} from "next/navigation";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {FileText, Pill, BriefcaseMedical, FileUser, Clock} from "lucide-react";
import Link from "next/link";

const PatientTabs = ({
                         patientId,
                         role
                     }: {
    patientId: number
    role: string
}) => {
    const pathname = usePathname();
    const links = role === "DOCTOR" ? DoctorLinks : NurseLinks;

    // Determine the current active tab by checking which link value is in the pathname
    let currentTab = '';
    for (const link of links) {
        if (pathname.includes(link.value)) {
            currentTab = link.value;
            break;
        }
    }

    // If no match was found, default to the first tab
    if (!currentTab && links.length > 0) {
        currentTab = '';
    }

    return (
        <div className="mt-6 border-t pt-4 h-14">
            <Tabs value={currentTab} className="w-full h-full">
                <TabsList className="w-full overflow-x-auto">
                    {links.map((link, index) => (
                        <Link
                            key={index}
                            href={`/patients/${patientId}/${link.value}`}
                            className="w-full h-full"
                            passHref
                        >
                            <TabsTrigger
                                value={link.value}
                                className={`flex items-center gap-2 w-full ${
                                    currentTab === link.value ? 'active' : ''
                                }`}
                            >
                                <link.icon className="h-4 w-4"/>
                                <span className={'hidden sm:inline'}>{link.name}</span>
                            </TabsTrigger>
                        </Link>
                    ))}
                </TabsList>
            </Tabs>
        </div>
    );
};

export default PatientTabs;


const DoctorLinks = [
    {name: "Prescribe", value: "prescriptions/add", icon: BriefcaseMedical},
    {name: "Prescriptions", value: "prescriptions", icon: Pill},
    {name: "History", value: "history", icon: Clock},
    {name: "Reports", value: "reports", icon: FileText},
    // {name: "Notes", value: "notes", icon: ClipboardEdit},
    {name: "Documents", value: "documents", icon: FileUser}
]

const NurseLinks = [
    {name: "Prescriptions", value: "prescriptions", icon: FileText}
]