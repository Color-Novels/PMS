'use client';

import React, {useEffect, useState} from 'react';
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {useDebounce} from "@/hooks/useDebounce";
import {addPatientToQueue, searchPatients} from "@/app/lib/actions";
import {QueueStatus, type Patient} from "@prisma/client";
import {calcAge, handleServerAction} from "@/app/lib/utils";
import {TableCell, Table, TableHead, TableHeader, TableRow, TableBody} from "@/components/ui/table";
import {CustomBadge} from "@/app/(dashboard)/_components/CustomBadge";
import Link from "next/link";
import {getQueueStatus} from "@/app/lib/actions";
import CustomSearchSelect, {SearchType} from "@/app/(dashboard)/queue/[id]/_components/CustomSearchSelect";

// Search by types
const AddPatientButton = ({id, refetch}: { id: number; refetch: () => void }) => {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchBy, setSearchBy] = useState<SearchType>("name");
    const [results, setResults] = useState<Patient[]>([]);
    const [error, setError] = useState<string | null>(null);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);

    const isNumber = (value: string) => {
        return /^\d+$/.test(value);
    }

    useEffect(() => {
        const fetchStatus = async () => {
            return await getQueueStatus(id);
        };
        fetchStatus().then((status) => {
            setQueueStatus(status?.status || null);
        });
    }, [id]);

    useEffect(() => {
        if (searchBy === "NIC") {
            if (debouncedSearchTerm.length !== 10 && debouncedSearchTerm.length !== 12) {
                setError("NIC should be 10 or 12 characters long");
                return;
            }
        }

        if (searchBy === "telephone") {
            if (!isNumber(debouncedSearchTerm)) {
                setError("Telephone should be a number");
                return;
            }

            if (debouncedSearchTerm.length !== 10) {
                setError("Telephone should be 10 characters long");
                return;
            }
        }

        if (searchBy === "name") {
            if (debouncedSearchTerm.length < 3) {
                setError("Name should be at least 3 characters long");
                return;
            }
        }

        setError(null);

        const fetchData = async () => {
            const data = await searchPatients(debouncedSearchTerm, searchBy);
            setResults(data);
        }

        fetchData().then(() => {
        });
    }, [debouncedSearchTerm, searchBy]);

    const getSex = (sex: string) => {
        switch (sex) {
            case 'MALE':
                return <CustomBadge text={'M'} color={'blue'}/>;
            case 'FEMALE':
                return <CustomBadge text={'F'} color={'pink'}/>;
            default:
                return <CustomBadge text={'UNKNOWN'} color={'gray'}/>;
        }
    }

    const handleAddToQueue = async (patientId: number) => {
        const result = await handleServerAction(
            () => addPatientToQueue(id, patientId),
            {
                loadingMessage: 'Adding Patient to Queue...'
            }
        );

        if (result.success) {
            setOpen(false);
            refetch();
        }
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen} modal={true}>
                <DialogTrigger asChild>
                    <Button
                        disabled={queueStatus !== 'IN_PROGRESS'}
                        className='text-white font-bold disabled:bg-gray-500'
                        onClick={() => setOpen(true)}
                    >
                        Add Patient
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl max-h-screen flex flex-col justify-start">
                    <DialogHeader>
                        <DialogTitle>Search Patient</DialogTitle>
                    </DialogHeader>
                    {/* Radio Group for Search By Options */}
                    <div className={'flex gap-2'}>
                        <CustomSearchSelect
                            value={searchBy}
                            onValueChange={setSearchBy}
                            setError={setError}
                            setSearchTerm={setSearchTerm}
                            placeholder="Search by"
                        />

                        {/* Search Input */}
                        <Input
                            placeholder={`Search by ${searchBy.charAt(0).toUpperCase() + searchBy.slice(1)}`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/*Error message*/}
                    {error && <p className="text-red-500">{error}</p>}

                    {/* Search Results */}
                    {results.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>SEX</TableHead>
                                    <TableHead>Age</TableHead>
                                    <TableHead>Telephone</TableHead>
                                    <TableHead>NIC</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {results.map((patient) => (
                                    <TableRow
                                        key={patient.id}
                                        className="cursor-pointer hover:bg-gray-50"
                                    >
                                        <TableCell>{patient.name}</TableCell>
                                        <TableCell>{getSex(patient.gender)}</TableCell>
                                        <TableCell>{patient.birthDate ? calcAge(new Date(patient.birthDate)) : "N/A"}</TableCell>
                                        <TableCell>{patient.telephone}</TableCell>
                                        <TableCell>{patient.NIC || "N/A"}</TableCell>
                                        <TableCell>
                                            <Button onClick={() => handleAddToQueue(patient.id)}>
                                                Add to Queue
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        searchTerm && <p className="p-2 text-gray-500">No results found</p>
                    )}
                    {results.length > 9 && (
                        <Link
                            href={`/patients?query=${encodeURIComponent(searchTerm)}&filter=${encodeURIComponent(searchBy)}`}
                            className={'text-blue-500 underline'}>
                            Show More...
                        </Link>
                    )}
                    <div className="flex justify-start mt-4">
                        <Link href={`/patients?model=true`}>
                            <Button>
                                Add New Patient
                            </Button>
                        </Link>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AddPatientButton;
