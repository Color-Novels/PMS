'use server';

import {prisma} from "@/app/lib/prisma";
import {ReportForm} from "@/app/(dashboard)/admin/reports/_components/EditReport";
import {myConfirmation, myError} from "@/app/lib/definitions";
import {revalidatePath} from "next/cache";
import {Prisma} from "@prisma/client";
import {verifySession} from "@/app/lib/sessions";
import {redirect} from "next/navigation";

export async function getFilteredReports(query: string) {
    return prisma.reportType.findMany({
        where: {
            name: {
                contains: query,
                mode: "insensitive",
            },
        },
        orderBy: {id: "asc"},
        include: {
            parameters: true,
        },
    });
}

export async function getTotalReportTemplateCount() {
    return prisma.reportType.count();
}

export async function addReportType(reportForm: ReportForm): Promise<myError> {
    try {
        if (((await verifySession()).role !== 'DOCTOR')) redirect('/unauthorized');
        if (reportForm.parameters.length === 0) {
            return {
                success: false,
                message: "At least one parameter is required",
            };
        }

        await prisma.reportType.create({
            data: {
                name: reportForm.name,
                description: reportForm.description,
                parameters: {
                    create: reportForm.parameters,
                },
            },
        });

        revalidatePath('/reports');
        return {success: true, message: 'Report type added successfully'};
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === 'P2002') {
                return {success: false, message: 'Report type name must be unique'};
            }
            if (e.code === 'P2003') {
                return {success: false, message: 'Invalid parameter reference (foreign key constraint failed)'};
            }
        }
        console.error(e);

        return {success: false, message: 'An unexpected error occurred while adding report type'};
    }
}

export async function getReportType(reportId: number) {
    return prisma.reportType.findUnique({
        where: {
            id: reportId,
        },
        include: {
            parameters: true,
        },
    });
}

export async function editReportType(
    reportForm: ReportForm,
    reportId: number
): Promise<myError> {
    try {
        if (((await verifySession()).role !== 'DOCTOR')) redirect('/unauthorized');
        return await prisma.$transaction(async (tx) => {
            const report = await tx.reportType.findUnique({
                where: {id: reportId},
                include: {parameters: true}
            });

            if (!report) {
                return {success: false, message: 'Report type not found'};
            }

            const newParams = reportForm.parameters.filter(
                (param) => param.isNew
            );
            const oldParams = reportForm.parameters.filter(
                (param) => !param.isNew
            );

            for (const params of report.parameters) {
                if (newParams.find((param) => param.name === params.name)) {
                    return {
                        success: false,
                        message: 'Cannot add an existing parameter. Do not remove and add the same parameter'
                    };
                }
            }

            // Delete removed parameters
            const deletedParams = report.parameters.filter(
                (param) => !oldParams.find((p) => p.id === param.id)
            );

            for (const param of deletedParams) {
                const reportValues = await tx.reportValue.findMany({
                    where: {reportParameterId: param.id}
                });

                if (reportValues.length > 0) {
                    return {
                        success: false,
                        message: `Parameter ${param.name} is in use by ${reportValues.length} reports. If you want to delete this parameter, please delete the whole report template`
                    };
                }

                await tx.reportParameter.delete({
                    where: {id: param.id}
                });
            }

            // Update existing parameters
            for (const param of oldParams) {
                await tx.reportParameter.update({
                    where: {id: param.id},
                    data: {
                        name: param.name,
                        units: param.units,
                    },
                });
            }

            // Add new parameters
            for (const param of newParams) {
                await tx.reportParameter.create({
                    data: {
                        name: param.name,
                        units: param.units,
                        reportTypeId: reportId,
                    },
                });
            }

            // Update the report type itself
            await tx.reportType.update({
                where: {id: reportId},
                data: {
                    name: reportForm.name,
                    description: reportForm.description,
                },
            });

            revalidatePath('/admin/reports');
            return {success: true, message: 'Report type updated successfully'};
        });
    } catch (e) {
        if (e instanceof Error) {
            return {
                success: false,
                message: e.message,
            };
        }
        return {
            success: false,
            message: "An uncaught error occurred while updating report type",
        };
    }
}

export const safeDeleteReportType = async (reportId: number): Promise<myError | myConfirmation> => {
    try {
        if (((await verifySession()).role !== 'DOCTOR')) redirect('/unauthorized');
        const report = await prisma.patientReport.findMany({
            where: {
                reportTypeId: reportId,
            },
        })

        if (report.length > 0) {
            return {
                confirmationRequired: true,
                message: `This report type is in use by ${report.length} reports. Are you sure you want to delete with all associated data?`,
            }
        }


        await prisma.reportType.delete({
            where: {
                id: reportId,
            },
        });
        revalidatePath('/admin/reports');
        return {success: true, message: 'Report type deleted successfully'}
    } catch (e) {
        console.error(e);
        return {success: false, message: 'An error occurred while deleting report type'}
    }
};

export async function deleteReportType(reportId: number): Promise<myError> {
    try {
        if (((await verifySession()).role !== 'DOCTOR')) redirect('/unauthorized');
        await prisma.reportType.delete({
            where: {
                id: reportId,
            },
        });
        revalidatePath('/admin/reports');
        return {success: true, message: 'Report type deleted successfully'};
    } catch (e) {
        console.error(e);
        return {success: false, message: 'An error occurred while deleting report type'};
    }
}


export async function getPatientReportPages(
    query: string,
    range: string,
    id: number
) {
    let dateFilter = {};

    if (range !== "ALL") {
        const months = parseInt(range.replace("M", ""), 10);
        const fromDate = new Date();
        fromDate.setMonth(fromDate.getMonth() - months);

        dateFilter = {time: {gte: fromDate}};
    }

    return prisma.patientReport.count({
        where: {
            patientId: id,
            reportType: {
                name: {contains: query},
            },
            ...dateFilter,
        },
    });
}

const PAGE_SIZE = 10;

export async function getPatientReports(
    query: string,
    range: string,
    PatientId: number,
    page: number
) {
    try {
        if (((await verifySession()).role !== 'DOCTOR')) redirect('/unauthorized');

        let dateFilter = {};

        if (range !== "ALL") {
            const months = parseInt(range.replace("M", ""), 10);
            const fromDate = new Date();
            fromDate.setMonth(fromDate.getMonth() - months);

            dateFilter = {time: {gte: fromDate}};
        }

        return prisma.patientReport.findMany({
            where: {
                patientId: PatientId,
                reportType: {
                    name: {contains: query, mode: 'insensitive'},
                },
                ...dateFilter,
            },
            take: PAGE_SIZE,
            skip: (page - 1) * PAGE_SIZE,
            orderBy: {time: "desc"},
            include: {
                reportType: true,
                parameters: {
                    select: {
                        value: true,
                        attention: true,
                        reportParameter: {
                            select: {
                                name: true,
                                units: true,
                                id: true,
                            },
                        },
                    },
                },
            },
        });
    } catch (e) {
        console.error(e);
        return [];
    }
}

export async function getAllReportCount(id: number) {
    return prisma.patientReport.count({
        where: {
            patientId: id,
        },
    });
}

export const searchReportTypes = async (query: string) => {
    return prisma.reportType.findMany({
        where: {
            name: {
                startsWith: query,
                mode: "insensitive",
            },
        },
        select: {
            name: true,
            id: true,
        },
        take: 10,
    });
};

export const getReportParams = async (id: number) => {
    return prisma.reportParameter.findMany({
        where: {
            reportTypeId: id,
        },
        select: {
            id: true,
            name: true,
            units: true,
        },
    });
};

export async function addPatientReport({patientID, reportTypeID, params}: {
    patientID: number,
    reportTypeID: number,
    params: Record<number, { value: string, attention: boolean }>
}): Promise<myError> {
    try {
        if (((await verifySession()).role !== 'DOCTOR')) redirect('/unauthorized');

        const reportType = await prisma.reportType.findUnique({
            where: {id: reportTypeID}
        });

        if (!reportType) {
            return {success: false, message: 'Report type not found'};
        }

        // check if all params have empty values
        if (Object.values(params).every((param) => param.value === '')) {
            return {success: false, message: 'Please fill at least one parameter'};
        }

        await prisma.patientReport.create({
            data: {
                patientId: patientID,
                reportTypeId: reportTypeID,
                parameters: {
                    create: Object.entries(params).map(([key, param]) => ({
                        reportParameterId: parseInt(key, 10),
                        value: param.value,
                        attention: param.attention,
                    })),
                },
            },
        });

        revalidatePath(`/patients/${patientID}/reports`);
        return {success: true, message: 'Report added successfully'};
    } catch (e) {
        console.error(e);
        return {success: false, message: 'An error occurred while adding report'};
    }
}

export async function deletePatientReport(
    reportId: number,
    patientID: number
): Promise<myError> {
    try {

        if (((await verifySession()).role !== 'DOCTOR')) redirect('/unauthorized');

        await prisma.patientReport.delete({
            where: {
                id: reportId,
            },
        });

        revalidatePath(`/patients/${patientID}/reports`);
        return {success: true, message: 'Report deleted successfully'};
    } catch (e) {
        console.error(e);
        return {success: false, message: 'An error occurred while deleting report'};
    }
}


export async function getPatientParameterData(patientId: number, parameterId: number) {
    try {
        if (((await verifySession()).role !== 'DOCTOR')) redirect('/unauthorized');
        // First, get the parameter details to check if it exists
        const parameter = await prisma.reportParameter.findUnique({
            where: {
                id: parameterId
            },
            select: {
                name: true,
                units: true
            }
        })

        if (!parameter) {
            throw new Error("Parameter not found")
        }

        // Then find all reports for this patient
        const patientReports = await prisma.patientReport.findMany({
            where: {
                patientId,
            },
            include: {
                parameters: {
                    where: {
                        reportParameterId: parameterId
                    },
                },
                patient: {
                    select: {
                        name: true,
                    },
                }
            },
            orderBy: {
                time: "asc",
            },
        })

        // Extract parameter values with timestamps
        const parameterData = patientReports.flatMap(report =>
            report.parameters.map(param => ({
                time: report.time,
                value: param.value,
                attention: param.attention
            }))
        )

        const patientName = patientReports[0]?.patient.name || "Unknown Patient"

        return {
            data: parameterData,
            parameterName: parameter.name,
            patientName,
            units: parameter.units || undefined
        }
    } catch (error) {
        console.error("Error fetching patient parameter data:", error)
        throw new Error("Failed to fetch patient parameter data")
    }
}