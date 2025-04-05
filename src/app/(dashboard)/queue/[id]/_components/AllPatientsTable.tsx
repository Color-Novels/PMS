"use client";

import React from "react";
import {
    Table,
    TableHead,
    TableHeader,
    TableRow,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import {useState, useEffect, useCallback} from "react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {verifySession} from "@/app/lib/sessions";
import {calcAge} from "@/app/lib/utils";
import {
    RemoveFromQueue,
    IssueMedicine,
    PrescribeMedicine,
} from "@/app/(dashboard)/queue/[id]/_components/TableButtons";
import {CustomBadge} from "@/app/(dashboard)/_components/CustomBadge";
import AddPatientButton from "@/app/(dashboard)/queue/[id]/_components/AddPatinetButton";
import {formatDistanceToNow} from "date-fns";
import {queuePatients} from "@/app/lib/actions/queue";
import {RefreshCw} from "lucide-react";

type Patients = Awaited<ReturnType<typeof queuePatients>>;

// Main Table Component
export default function AllPatientsTable({id}: { id: number }) {
    const [patients, setPatients] = useState<Patients | []>([]);
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const session = await verifySession();
            setRole(session.role);
            const data = await queuePatients(id);
            setPatients(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }, [id]); // Only recreates if `id` changes

    const handleManualRefresh = () => {
        fetchData().then();
    };

    useEffect(() => {
        fetchData().then(); // Fetch initial data

        const interval = setInterval(fetchData, 60000); // Refetch every 1 minute
        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [fetchData]); // useEffect now depends on a stable function

    const getStatus = (status: string) => {
        switch (status) {
            case "COMPLETED":
                return <CustomBadge text="COMPLETED" color="green"/>;
            case "PENDING":
                return <CustomBadge text="PENDING" color="yellow"/>;
            case "PRESCRIBED":
                return <CustomBadge text="PRESCRIBED" color="blue"/>;
            default:
                return <CustomBadge text="UNKNOWN" color="gray"/>;
        }
    };

    const filteredPatients = patients.filter((patient) => {
        if (role === "DOCTOR") {
            return patient.status === "PENDING";
        } else if (role === "NURSE") {
            return patient.status !== "COMPLETED";
        } else {
            return false;
        }
    });

    const completedPatients = patients.filter((patient) => {
        if (role === "DOCTOR") {
            return patient.status !== "PENDING";
        } else if (role === "NURSE") {
            return patient.status === "COMPLETED";
        } else {
            return false;
        }
    });

    const getSex = (sex: string) => {
        switch (sex) {
            case "MALE":
                return <CustomBadge text="M" color="blue"/>;
            case "FEMALE":
                return <CustomBadge text="F" color="pink"/>;
            default:
                return <CustomBadge text="UNKNOWN" color="gray"/>;
        }
    };

    return (
        <div className="flex flex-col gap-5">
            <div className={"flex justify-between items-center mt-5 w-full"}>
                <div className="flex items-center gap-3">
                    {loading ? (
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                            Loading patient data...
                        </div>
                    ) : (
                        <>
                            <div className="text-sm text-gray-500">
                                Last updated at {new Date().toLocaleTimeString()}
                            </div>
                        </>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleManualRefresh}
                        disabled={loading}
                        className="flex items-center gap-1"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}/>
                        Refresh
                    </Button>
                </div>
                <AddPatientButton id={id} refetch={fetchData}/>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Token #</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Sex</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Arrived</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredPatients.map((patient) => (
                        <TableRow key={patient.id}>
                            <TableCell className="font-medium">
                                {patient.token}
                            </TableCell>
                            <TableCell>{getStatus(patient.status)}</TableCell>
                            <TableCell>
                                <Link
                                    href={`/patients/${patient.patientId}`}
                                    className="text-blue-800 hover:underline"
                                >
                                    {patient.patient.name}
                                </Link>
                            </TableCell>
                            <TableCell>
                                {getSex(patient.patient.gender)}
                            </TableCell>
                            {patient.patient.birthDate ? (
                                <TableCell>
                                    {calcAge(
                                        new Date(patient.patient.birthDate)
                                    )}
                                </TableCell>
                            ) : (
                                <TableCell>Unknown</TableCell>
                            )}
                            <TableCell>
                                {formatDistanceToNow(new Date(patient.time), {addSuffix: true})}
                            </TableCell>
                            <TableCell className="flex justify-start items-center gap-2">
                                {role === "DOCTOR" &&
                                    patient.status === "PENDING" && (
                                        <PrescribeMedicine
                                            id={patient.patientId}
                                        />
                                    )}
                                {role === "NURSE" &&
                                    patient.status === "PRESCRIBED" && (
                                        <IssueMedicine id={patient.patientId}/>
                                    )}
                                <RemoveFromQueue
                                    queueId={id}
                                    token={patient.token}
                                    refetch={fetchData}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                    {filteredPatients.length > 0 && (
                        <TableRow className="bg-gray-100 text-gray-800 font-medium">
                            <TableCell colSpan={7} className="text-center">
                                Total Completed Patients: {completedPatients.length}
                            </TableCell>
                        </TableRow>
                    )}
                    {completedPatients.map((patient) => (
                        <TableRow key={patient.id}>
                            <TableCell className="font-medium">
                                {patient.token}
                            </TableCell>
                            <TableCell>{getStatus(patient.status)}</TableCell>
                            <TableCell>
                                <Link
                                    href={`/patients/${patient.patientId}`}
                                    className="text-blue-800 hover:underline"
                                >
                                    {patient.patient.name}
                                </Link>
                            </TableCell>
                            <TableCell>
                                {getSex(patient.patient.gender)}
                            </TableCell>
                            {patient.patient.birthDate ? (
                                <TableCell>
                                    {calcAge(
                                        new Date(patient.patient.birthDate)
                                    )}
                                </TableCell>
                            ) : (
                                <TableCell>Unknown</TableCell>
                            )}
                            <TableCell>
                                {new Date(patient.time).toLocaleTimeString()}
                            </TableCell>
                            <TableCell className="flex justify-start items-center gap-2">
                                <Button asChild variant="default" size="sm">
                                    <Link
                                        href={`/patients/${patient.patientId}`}
                                    >
                                        View Profile
                                    </Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {!loading && filteredPatients.length === 0 && completedPatients.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                No patients in queue
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}