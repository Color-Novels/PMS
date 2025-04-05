import React from 'react';
import {Card} from "@/components/ui/card";
import {formatDistanceToNow} from 'date-fns';
import {queuePatients} from "@/app/lib/actions/queue";
import {Gender, VisitStatus} from "@prisma/client";
import {calcAge} from "@/app/lib/utils";
import {redirect} from "next/navigation";
import {FaMedkit, FaTablets} from "react-icons/fa";
import Link from "next/link";

type Patients = Awaited<ReturnType<typeof queuePatients>>;

// Component to display the list of pending patients
const PatientList = ({patients, closeSheet}: { patients: Patients, closeSheet: () => void }) => {
    // Function to get text color based on gender
    const getGenderColor = (gender: Gender) => {
        switch (gender) {
            case 'MALE':
                return 'text-blue-600';
            case 'FEMALE':
                return 'text-pink-600';
            default:
                return 'text-gray-600';
        }
    };

    const getTokenBgColor = (status: VisitStatus) => {
        switch (status) {
            case 'PENDING':
                return 'bg-amber-300';
            case 'PRESCRIBED':
                return 'bg-blue-300';
            case 'COMPLETED':
                return 'bg-green-300';
            default:
                return 'bg-gray-300';
        }
    }

    return (
        <div className="space-y-2">
            {patients.map((entry) => (
                <Card key={entry.id} className="p-3 hover:bg-gray-50">
                    <div className={'flex justify-between'}>
                        <div className="flex items-center space-x-2">
                            <div
                                className={`text-sm font-semibold rounded-full w-6 h-6 flex items-center justify-center ${getTokenBgColor(entry.status)}`}>
                                {entry.token}
                            </div>
                            <div>
                                <div className="flex flex-row items-center space-x-2">
                                    <Link
                                        href={`/patients/${entry.patientId}`}
                                        className={`font-medium text-sm ${getGenderColor(entry.patient.gender)} truncate max-w-32 hover:underline`}>
                                        {entry.patient.name}
                                    </Link>
                                    <span className="text-xs text-gray-500">
                                    {entry.patient.birthDate && `${calcAge(entry.patient.birthDate)} yrs`}
                                 </span>
                                </div>
                                <div className="text-xs text-gray-500">
                                    {formatDistanceToNow(new Date(entry.time))}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            {entry.status === 'PENDING' && (
                                <button
                                    onClick={() => {
                                        closeSheet();
                                        redirect(`/patients/${entry.patientId}/prescriptions/add`);
                                    }}
                                    className="p-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                                >
                                    <FaMedkit/>
                                </button>
                            )}
                            {entry.status === 'PRESCRIBED' && (
                                <button
                                    onClick={() => {
                                        closeSheet();
                                        redirect(`/patients/${entry.patientId}/prescriptions`);
                                    }}
                                    className="p-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
                                >
                                    <FaTablets/>
                                </button>
                            )}
                        </div>

                    </div>
                </Card>
            ))}
        </div>
    );
};

export default PatientList;