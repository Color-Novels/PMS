import React from "react";
import Link from "next/link";
import {searchPrescriptions} from "@/app/lib/actions/prescriptions";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {formatDistanceToNow} from "date-fns";
import {BasicColorType, CustomBadge} from "@/app/(dashboard)/_components/CustomBadge";
import {IconName} from "@/app/lib/iconMapping";
import DynamicIcon from "@/app/(dashboard)/_components/LazyDynamicIcon";
import {getTextColorClass} from "@/app/lib/utils";
import { Issue, PrescriptionVitals} from "@prisma/client";
import {feeTypes} from "@/app/(dashboard)/admin/fees/_components/FeeCards";

export interface PrescriptionVitalWithRelation extends PrescriptionVitals {
    vital: {
        color: string;
        icon: string;
        name: string;
    };
}

export interface PrescriptionIssueWithRelation extends Issue {
    drug: {
        name: string;
    };
}

const PrescriptionList = async ({currentPage, query, patientID, perPage, filter}: {
    currentPage: number;
    query: string;
    patientID: number;
    filter: string;
    perPage: number;
}) => {
    const skip = (currentPage - 1) * perPage;
    const prescriptions = await searchPrescriptions({
        patientID,
        query,
        filter: filter,
        take: perPage,
        skip,
    });

    return (
        <div className="grid grid-cols-1 gap-4">
            {prescriptions.length > 0 ? (
                prescriptions.map((prescription) => (
                    <Link
                        key={prescription.id}
                        href={`/patients/${patientID}/prescriptions/${prescription.id}`}
                    >
                        <Card className={`
                            cursor-pointer 
                            hover:shadow-md 
                            transition 
                            h-full
                            overflow-hidden
                            ${prescription.status === 'PENDING'
                            ? 'border-l-4 border-l-amber-500'
                            : 'border-l-4 border-l-green-500'
                        }
                        `}>
                            <CardHeader className={'pb-2'}>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <CardTitle
                                            className="text-lg font-semibold text-gray-900">{prescription.presentingSymptoms || "No Symptoms"}</CardTitle>
                                        <CustomBadge text={`#${prescription.id}`} color="blue"/>
                                        <CustomBadge text={prescription.status}
                                                     color={prescription.status === 'PENDING' ? "amber" : "green"}/>
                                    </div>
                                    <p className="text-gray-500 text-sm">{formatDistanceToNow(new Date(prescription.time), {addSuffix: true})}</p>
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2">
                                <p className="text-gray-500 text-sm">{prescription.details}</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {prescription.PrescriptionVitals && prescription.PrescriptionVitals.length > 0 &&
                                        (prescription.PrescriptionVitals as PrescriptionVitalWithRelation[]).map((vital) => (
                                            <div className="flex items-center gap-2 text-gray-700" key={vital.id}>
                                                <DynamicIcon
                                                    className={`text-lg ${getTextColorClass(vital.vital.color as keyof BasicColorType)}`}
                                                    icon={vital.vital.icon as IconName}/>
                                                <span className="font-medium">{vital.vital.name}</span>
                                                <span className="font-semibold">{vital.value}</span>
                                            </div>
                                        ))
                                    }
                                </div>

                                <div className="flex items-center flex-wrap gap-2">
                                    {prescription.issues && prescription.issues.length > 0 && (
                                        <>
                                            <span className="text-sm">Inventory Meds:</span>
                                            {(prescription.issues as PrescriptionIssueWithRelation[]).map((issue) => (
                                                issue.drug &&
                                                <CustomBadge key={issue.drug.name} text={issue.drug.name} color="rose"/>
                                            ))}
                                        </>
                                    )}
                                </div>
                                {prescription.OffRecordMeds.length > 0 && (
                                    <div className="flex items-center flex-wrap gap-2">
                                        <span className="text-sm">Off Record Meds:</span>
                                        {prescription.OffRecordMeds.map((med) => (
                                            <CustomBadge key={med.name} text={med.name} color="slate"/>
                                        ))}
                                    </div>
                                )}
                                {prescription.Charges.length > 0 && (
                                    <div className="flex items-center flex-wrap gap-2">
                                        <span className="text-sm">Procedures:</span>
                                        {prescription.Charges.filter((charge) => charge.type === 'PROCEDURE').map((charge) => (
                                            <CustomBadge key={charge.id} text={charge.name}
                                                         color="purple"/>
                                        ))}
                                    </div>
                                )}
                                {prescription.Charges.length > 0 && (
                                    <div className="flex items-center flex-wrap gap-2">
                                        <span className="text-sm">Charges:</span>
                                        <CustomBadge text={'Medicines'} color={feeTypes['MEDICINE'].color}/>
                                        {prescription.Charges.filter((charge) => charge.type !== 'PROCEDURE').map((charge) => (
                                            <CustomBadge
                                                key={charge.id}
                                                text={charge.name}
                                                color={feeTypes[charge.type].color}
                                            />
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </Link>
                ))
            ) : (
                <p className="text-gray-500">No prescriptions found.</p>
            )}
        </div>
    );
};

export default PrescriptionList;