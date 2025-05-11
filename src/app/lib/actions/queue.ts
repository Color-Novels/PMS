'use server'

import {myError} from "@/app/lib/definitions";
import {prisma} from "@/app/lib/prisma";
import {revalidatePath} from "next/cache";
import {SearchType} from "@/app/(dashboard)/queue/[id]/_components/CustomSearchSelect";
import {verifySession} from "@/app/lib/sessions";
import {pusher} from "@/app/lib/pusher";
import {Queue} from "@prisma/client";


export async function stopQueue(id: string | null): Promise<myError> {
    try {
        if (!id) {
            return {success: false, message: "Queue ID not provided"};
        }

        const numberId = parseInt(id);

        const queue = await prisma.queue.findUnique({
            where: {
                id: numberId,
            },
        });

        if (!queue) {
            return {success: false, message: "Queue not found"};
        }

        if (queue.status === "COMPLETED") {
            return {success: false, message: "Queue is already stopped"};
        }

        const UncompletedQueueEntries = await prisma.queueEntry.findMany({
            where: {
                queueId: numberId,
                status: {
                    not: "COMPLETED",
                },
            },
        });

        if (UncompletedQueueEntries.length > 0) {
            return {success: false, message: "Queue has uncompleted entries"};
        }

        await prisma.queue.update({
            where: {
                id: numberId,
            },
            data: {
                status: "COMPLETED",
            },
        });
        await triggerQueueUpdate();
        return {success: true, message: "Queue stopped successfully"};
    } catch (e) {
        console.error(e);
        return {
            success: false,
            message: "An error occurred while stopping queue",
        };
    }
}

export async function getQueueStatus(id: number) {
    return prisma.queue.findUnique({
        where: {
            id,
        },
        select: {
            status: true,
        },
    });
}

export async function getQueueStatusesCount(id: number) {
    try {
        const result = await prisma.queueEntry.groupBy({
            by: ["status"],
            where: {
                queueId: id,
            },
            _count: {
                status: true,
            },
        });

        const statuses = {
            PENDING: 0,
            PRESCRIBED: 0,
            COMPLETED: 0,
        };

        result.forEach((item) => {
            statuses[item.status] = item._count.status;
        });

        return statuses;
    } catch (e) {
        console.error(e);
        throw new Error("An error occurred while getting queue statuses count");
    }
}

export async function getActiveQueuePatients() {
    try {
        const session = await verifySession();
        return await prisma.queueEntry.findMany({
            where: {
                queue: {
                    status: 'IN_PROGRESS'
                },
                status: session.role === "DOCTOR" ? "PENDING" : 'PRESCRIBED',
            },
            select: {
                token: true,
                id: true,
                status: true,
                patientId: true,
                time: true,
                patient: {
                    select: {
                        name: true,
                        birthDate: true,
                        gender: true,
                    }
                },
            },
            orderBy: {
                token: "asc",
            },
        });
    } catch (e) {
        console.error(e);
        throw new Error("An error occurred while getting active queue patients");
    }
}

export async function queuePatients(id: number) {
    try {
        return await prisma.queueEntry.findMany({
            where: {
                queueId: id,
            },
            select: {
                token: true,
                id: true,
                status: true,
                patientId: true,
                time: true,
                patient: {
                    select: {
                        name: true,
                        birthDate: true,
                        gender: true,
                    }
                },
            },
            orderBy: {
                token: "asc",
            },
        });
    } catch (e) {
        console.error(e);
        throw new Error("An error occurred while getting queue patients");
    }
}

export async function removePatientFromQueue(
    queueId: number,
    token: number
): Promise<myError> {
    try {
        await prisma.queueEntry.delete({
            where: {
                queueId_token: {
                    queueId,
                    token,
                },
            },
        });

        revalidatePath(`/queue/${queueId}`);
        await triggerQueueUpdate();
        return {success: true, message: "Patient removed successfully"};
    } catch (e) {
        console.error(e);
        return {
            success: false,
            message: "An error occurred while removing patient from queue",
        };
    }
}

export async function searchPatients(query: string, searchBy: SearchType) {
    if (!query) return [];
    return prisma.patient.findMany({
        where: {
            [searchBy]: {
                contains: query,
                mode: "insensitive",
            },
        },
        take: 10, // Limit results
    });
}

export async function addPatientToQueue({
                                            queueId,
                                            patientId
                                        }: {
                                            queueId: number;
                                            patientId: number;

                                        }
): Promise<myError> {
    try {
        const queue = await prisma.queue.findUnique({
            where: {
                id: queueId,
            },
        });

        if (!queue) {
            return {success: false, message: "Queue not found"};
        }

        const patient = await prisma.patient.findUnique({
            where: {
                id: patientId,
            },
        });

        if (!patient) {
            return {success: false, message: "Patient not found"};
        }

        if (queue.status === "COMPLETED") {
            return {success: false, message: "Queue is stopped"};
        }

        const lastToken = await prisma.queueEntry.findFirst({
            where: {
                queueId,
            },
            orderBy: {
                token: "desc",
            },
        });

        const token = lastToken ? lastToken.token + 1 : 1;

        await prisma.queueEntry.create({
            data: {
                queueId,
                patientId,
                token,
            },
        });

        await triggerQueueUpdate();
        revalidatePath(`/queue/${queueId}`);
        return {
            success: true,
            message: "Patient added to queue successfully",
        };
    } catch (e) {
        console.error(e);
        return {
            success: false,
            message: "An error occurred while adding patient to queue",
        };
    }
}

export async function getActiveQueue(): Promise<Queue | null> {
    try {
        return await prisma.queue.findFirst({
            where: {
                status: "IN_PROGRESS",
            },
        });
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function addQueue(): Promise<myError> {
    try {
        const activeQueuesCount = await prisma.queue.count({
            where: {
                status: "IN_PROGRESS",
            },
        });

        if (activeQueuesCount !== 0) {
            return {
                success: false,
                message: "There is already an active queue",
            };
        }

        await prisma.queue.create({
            data: {},
        });
        await triggerQueueUpdate();
        revalidatePath("/queues");
        return {success: true, message: "Queue created successfully"};
    } catch (e) {
        console.error(e);
        return {
            success: false,
            message: "An error occurred while creating queue",
        };
    }
}

export async function getQueues(offset: number, limit: number) {
    return prisma.queue.findMany({
        skip: offset,
        take: limit,
        orderBy: {
            id: "desc",
        },
        include: {
            _count: {
                select: {entries: true},
            },
        },
    });
}

export async function getQueue(queueId: number) {
    return prisma.queue.findUnique({
        where: {
            id: queueId,
        },
    });
}

export async function getTotalQueueCount() {
    return prisma.queue.count();
}

export async function getPendingPatientsCount() {
    const result = await prisma.queueEntry.findMany({
        where: {
            status: {
                not: 'COMPLETED'
            },
        },
    });

    return result.reduce(
        (acc, {status}) => {
            if (status === 'PENDING') {
                acc.pending++;
            } else if (status === 'PRESCRIBED') {
                acc.prescribed++;
            }
            return acc;
        },
        {prescribed: 0, pending: 0}
    );
}


export async function triggerQueueUpdate() {
    const result = await prisma.queueEntry.findMany({
        where: {
            status: {
                not: 'COMPLETED'
            }
        },
    });

    const countData = result.reduce(
        (acc, {status}) => {
            if (status === 'PENDING') {
                acc.pending++;
            } else if (status === 'PRESCRIBED') {
                acc.prescribed++;
            }
            return acc;
        },
        {prescribed: 0, pending: 0}
    );
    // Trigger a Pusher event with the new counts
    await pusher.trigger(`thoduwawa-medical-center`, 'queue-updated', countData);
}