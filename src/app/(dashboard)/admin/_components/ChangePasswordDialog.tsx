'use client';

import React, {ReactNode, useState} from 'react';
import {Button} from "@/components/ui/button";
import {
    Dialog, DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {useForm} from "react-hook-form";
import {handleServerAction} from "@/app/lib/utils";

import {changePassword} from "@/app/lib/actions/account";

export interface ChangePasswordFormData {
    currentPassword: string;
    userID: number;
    newPassword: string;
    confirmPassword: string;
}

const ChangePasswordDialog = ({userID, currentPw, trigger}: {
    userID: number,
    currentPw: boolean,
    trigger: ReactNode
}) => {
    const form = useForm<ChangePasswordFormData>({
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            userID: userID,
            confirmPassword: '',
        },
    });
    const [error, setError] = useState<null | string>(null);
    const [open, setOpen] = useState(false);

    const onSubmit = async (data: ChangePasswordFormData) => {
        setError(null);
        if (data.newPassword !== data.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        // Check password length
        if (data.newPassword.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        const result = await handleServerAction(() => changePassword(data), {
            loadingMessage: 'Changing password...',
        });

        if (result.success) {
            setOpen(false);
        } else {
            setError(result.message);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                </DialogHeader>

                {error && (
                    <div className="p-4 bg-red-100 text-red-700 rounded-md mb-4">
                        {error}
                    </div>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        {currentPw && (
                            <FormField
                                control={form.control}
                                name="currentPassword"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Current Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Confirm New Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end gap-3">
                            <DialogClose asChild>
                                <Button type="button" variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Update Password</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default ChangePasswordDialog;