'use client';

import React from 'react';
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {
    Dialog,
    DialogContent, DialogFooter,
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
import {Gender} from "@prisma/client";
import {validateEmail, validateMobile, handleServerAction} from "@/app/lib/utils";
import CustomGenderSelect from "@/app/(dashboard)/patients/_components/CustomGenderSelect";
import {addUser} from "@/app/lib/actions/account";

export interface AddUserFormData {
    name: string;
    email: string;
    telephone: string;
    gender: Gender;
    image: string | null;
    password: string;
    confirmPassword: string;
}

const AddUserDialog = () => {
    const form = useForm<AddUserFormData>({
        defaultValues: {
            name: "",
            email: "",
            telephone: "",
            gender: 'FEMALE',
            image: null,
            password: "",
            confirmPassword: "",
        },
    });

    const [error, setError] = React.useState<string | null>(null);
    const [open, setOpen] = React.useState(false);

    const resetForm = () => {
        form.reset();
        form.clearErrors();
        setError(null);
    };

    const validateForm = (data: AddUserFormData) => {
        if (!data.name) {
            form.setError("name", {type: "required", message: "Name is required"});
            return false;
        }

        if (!data.email) {
            form.setError("email", {type: "required", message: "Email is required"});
            return false;
        }

        if (!data.telephone) {
            form.setError("telephone", {type: "required", message: "Telephone is required"});
            return false;
        }

        if (!data.gender) {
            form.setError("gender", {type: "required", message: "Gender is required"});
            return false;
        }

        if (!data.password) {
            form.setError("password", {type: "required", message: "Password is required"});
            return false;
        }

        if (data.password.length < 6) {
            form.setError("password", {type: "manual", message: "Password must be at least 8 characters"});
            return false;
        }

        if (!data.confirmPassword) {
            form.setError("confirmPassword", {type: "required", message: "Please confirm your password"});
            return false;
        }

        if (data.password !== data.confirmPassword) {
            form.setError("confirmPassword", {type: "manual", message: "Passwords do not match"});
            return false;
        }

        const emailError = validateEmail(data.email);
        if (emailError) {
            form.setError("email", {type: "manual", message: emailError});
            return false;
        }

        const mobileError = validateMobile(data.telephone);
        if (mobileError) {
            form.setError("telephone", {type: "manual", message: mobileError});
            return false;
        }

        return true;
    };

    const onSubmit = async (data: AddUserFormData) => {
        if (!validateForm(data)) {
            return;
        }

        const result = await handleServerAction(() => addUser({formData: data}), {
            loadingMessage: "Adding user...",
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
                <Button variant="default">
                    <Plus/> Add Staff
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add User</DialogTitle>
                </DialogHeader>
                {error && <div className="text-red-500">{error}</div>}
                <Form {...form}>
                    <form className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input type="email" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="telephone"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Telephone <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input type="tel" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="gender"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Gender <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <CustomGenderSelect value={field.value} onValueChange={field.onChange}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Password <span className="text-red-500">*</span></FormLabel>
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
                                    <FormLabel>Confirm Password <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </form>
                    <DialogFooter>
                        <div className="flex items-center justify-between gap-2 w-full">
                            <Button variant="ghost" onClick={resetForm}
                                    className="text-primary-500 underline hover:text-primary-700">
                                Reset
                            </Button>
                            <div className="flex items-center gap-2">
                                <DialogTrigger asChild>
                                    <Button type="button">Cancel</Button>
                                </DialogTrigger>
                                <Button onClick={form.handleSubmit(onSubmit)}>Save</Button>
                            </div>
                        </div>
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddUserDialog;
