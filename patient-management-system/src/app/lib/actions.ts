'use server';

import { prisma } from "./prisma";
import { verifySession } from "./sessions";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function changePassword({ currentPassword, newPassword, confirmPassword }: { currentPassword: string, newPassword: string, confirmPassword: string }) {

    const session = await verifySession();

    const user = await prisma.user.findUnique({
        where: { id: session.id }
    });

    if (!session || !user) {
        throw new Error("Unauthorized");
    }

    if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match");
    }

    if (!bcrypt.compareSync(currentPassword, user.password)) {
        throw new Error("Current password is incorrect");
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    await prisma.user.update({
        where: { id: session.id },
        data: { password: hashedPassword }
    });

    return { success: true };
}

// For admin changing nurse passwords
export async function changeUserPassword({
  nurseId,
  newPassword,
  confirmPassword
}: {
  nurseId: number,  // Add nurse ID parameter
  newPassword: string,
  confirmPassword: string
}) {
  const session = await verifySession();

  //  Verify admin role
  const admin = await prisma.user.findUnique({ 
    where: { id: session.id },
    select: { role: true }
  });
  
  if (admin?.role !== 'DOCTOR') {
    throw new Error("Unauthorized: Only doctors can update passwords");
  }

  // Verify target user exists and is a nurse
  const nurse = await prisma.user.findUnique({
    where: { id: nurseId },
    select: { role: true }
  });

  if (!nurse) {
    throw new Error("User not found");
  }

  if (nurse.role !== 'NURSE') {
    throw new Error("Can only update nurse passwords");
  }


  if (newPassword !== confirmPassword) {
    throw new Error("Passwords do not match");
  }


  const hashedPassword = bcrypt.hashSync(newPassword, 10);
  
  await prisma.user.update({
    where: { id: nurseId },  // Use nurse ID here
    data: { password: hashedPassword }
  });

  return { success: true };
}

export async function addQueue() {
    const activeQueuesCount = await prisma.queue.count(
        {
            where: {
                status: 'IN_PROGRESS'
            }
        }
    )

    if (activeQueuesCount !== 0) {
        throw new Error('There is already an active queue')
    }

    await prisma.queue.create({
        data: {}
    })

    revalidatePath('/queue');
    return { status: 'success', message: 'Queue added successfully' }
}

export async function getQueues(offset: number, limit: number) {

    return prisma.queue.findMany({
        skip: offset,
        take: limit,
        orderBy: {
            id: 'desc'
        },
        include: {
            _count: {
                select: { entries: true }
            }
        }
    });
}

export async function getTotalQueueCount() {
    return prisma.queue.count();
}
