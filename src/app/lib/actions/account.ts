'use server'

import {AddUserFormData} from "@/app/(dashboard)/admin/staff/_components/AddUserDialog";
import {myError} from "@/app/lib/definitions";
import {validateEmail, validateMobile} from "@/app/lib/utils";
import {verifySession} from "@/app/lib/sessions";
import {Role} from "@prisma/client";
// import bcrypt from "bcryptjs";
import {prisma} from "@/app/lib/prisma";
import {revalidatePath} from "next/cache";
import {ChangePasswordFormData} from "@/app/(dashboard)/admin/_components/ChangePasswordDialog";
import {EditUserProfileFormData} from "@/app/(dashboard)/admin/_components/EditProfileDialog";

export async function changePassword({
                                         // currentPassword,
                                         newPassword,
                                         confirmPassword,
                                         userID,
                                     }: ChangePasswordFormData): Promise<myError> {
    try {
        if (newPassword !== confirmPassword) {
            return {success: false, message: "Passwords do not match"};
        }

        const session = await verifySession(); // Get current user session

        // Fetch target user
        const user = await prisma.user.findUnique({
            where: {id: userID},
        });

        if (!user) {
            return {success: false, message: "User not found"};
        }

        // Doctor (Super User) - can change anyone’s password without providing current password
        if (session.role === Role.DOCTOR) {
            // Check if the doctor is changing their own password
            if (session.id === userID) {
                // Doctor changing own password, requires currentPassword
                // if (!bcrypt.compareSync(currentPassword, user.password)) {
                //     return {
                //         success: false,
                //         message: "Current password is incorrect",
                //     };
                // }
                return {
                    success: false,
                    message: "Current password is incorrect",
                };
            }
        } else {
            // Non-doctors can only change their own password and must provide current password
            if (session.id !== userID) {
                return {
                    success: false,
                    message:
                        "You do not have permission to change this user's password",
                };
            }
            // if (!bcrypt.compareSync(currentPassword, user.password)) {
            //     return {
            //         success: false,
            //         message: "Current password is incorrect",
            //     };
            // }
            return {
                success: false,
                message: "Current password is incorrect",
            };
        }

        // Hash and update password
        // const hashedPassword = bcrypt.hashSync(newPassword, 10);

        const hashedPassword = 'bbbb';

        await prisma.user.update({
            where: {id: userID},
            data: {password: hashedPassword},
        });

        return {success: true, message: "Password changed successfully"};
    } catch (e) {
        if (e instanceof Error) {
            console.error(e.message);
        }
        return {
            success: false,
            message: "An error occurred while changing password",
        };
    }
}

export async function getUser(id: number) {
    const session = await verifySession();

    if (session.role !== Role.DOCTOR && session.id !== id) {
        throw new Error("You do not have permission to view this user");
    }

    return prisma.user.findUnique({
        where: {id},
        select: {
            name: true,
            email: true,
            mobile: true,
            role: true,
            image: true,
            gender: true,
        },
    });
}

export async function deleteUser(id: number): Promise<myError> {
    try {
        const session = await verifySession();

        if (session.id === id) {
            return {
                success: false,
                message: "You cannot delete your own account",
            };
        }

        if (session.role !== Role.DOCTOR) {
            return {
                success: false,
                message: "You do not have permission to delete users",
            };
        }

        await prisma.user.delete({
            where: {id},
        });

        revalidatePath("/admin/staff");
        revalidatePath("/admin/profile");
        return {success: true, message: "User deleted successfully"};
    } catch (e) {
        if (e instanceof Error) {
            console.error(e.message);
        }
        return {
            success: false,
            message: "An error occurred while deleting user",
        };
    }
}

export async function editProfile(formData: EditUserProfileFormData) {
    try {
        if (
            !formData.name ||
            !formData.email ||
            !formData.telephone ||
            !formData.gender
        ) {
            return {success: false, message: "Please fill all fields"};
        }

        if (validateEmail(formData.email)) {
            return {success: false, message: "Invalid email address"};
        }

        if (validateMobile(formData.telephone)) {
            return {success: false, message: "Invalid telephone number"};
        }

        const session = await verifySession();

        if (!(session.role === Role.DOCTOR)) {
            if (session.id !== formData.id) {
                return {
                    success: false,
                    message: "You do not have permission to edit this profile",
                };
            }
        }

        await prisma.user.update({
            where: {id: formData.id},
            data: {
                name: formData.name,
                email: formData.email,
                mobile: formData.telephone,
                image: formData.image,
                gender: formData.gender,
            },
        });

        revalidatePath("/admin/staff");
        revalidatePath("/admin/profile");

        if (session.id === formData.id) {
            revalidatePath("/");
        }

        return {success: true, message: "Profile updated successfully"};
    } catch (e) {
        if (e instanceof Error) {
            console.error(e.message);
        }
        return {
            success: false,
            message: "An error occurred while updating profile",
        };
    }
}

export async function addUser({
                                  formData,
                              }: {
    formData: AddUserFormData;
}): Promise<myError> {
    try {
        if (
            !formData.name ||
            !formData.email ||
            !formData.telephone ||
            !formData.gender
        ) {
            return {success: false, message: "Please fill all fields"};
        }

        if (validateEmail(formData.email)) {
            return {success: false, message: "Invalid email address"};
        }

        if (validateMobile(formData.telephone)) {
            return {success: false, message: "Invalid telephone number"};
        }

        if (!formData.password) {
            return {success: false, message: "Password is required"};
        }

        if (formData.password.length < 8) {
            return {
                success: false,
                message: "Password must be at least 8 characters",
            };
        }

        if (!(formData.password === formData.confirmPassword)) {
            return {success: false, message: "Passwords do not match"};
        }

        const session = await verifySession();

        if (session.role !== Role.DOCTOR) {
            return {
                success: false,
                message: "You do not have permission to add staff",
            };
        }

        // const hashedPassword = bcrypt.hashSync(formData.password, 10);
        const hashedPassword = 'aaaa';

        await prisma.user.create({
            data: {
                name: formData.name,
                gender: formData.gender,
                role: Role.NURSE,
                email: formData.email,
                mobile: formData.telephone,
                password: hashedPassword,
            },
        });

        revalidatePath("/admin/staff");
        return {success: true, message: "Staff added successfully"};
    } catch (e) {
        if (e instanceof Error) {
            console.error(e.message);
        }
        return {
            success: false,
            message: "An error occurred while adding staff",
        };
    }
}