'use client';

import React, {ReactNode} from 'react';
import {Button} from "@/components/ui/button";
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
import {editProfile} from "@/app/lib/actions/account";

export interface EditUserProfileFormData {
    name: string;
    email: string;
    id: number;
    image: string | null;
    telephone: string;
    gender: Gender;
}

const EditProfileDialog = ({initial, trigger}: { initial: EditUserProfileFormData, trigger: ReactNode }) => {
    const form = useForm<EditUserProfileFormData>({
        defaultValues: {
            ...initial,
        },
    });
    const [error, setError] = React.useState<string | null>(null);
    const [open, setOpen] = React.useState(false);

    const resetForm = () => {
        form.reset();
        form.clearErrors();
        setError(null);
    };

    const validateForm = (data: EditUserProfileFormData) => {
        if (!data.name) {
            form.setError('name', {type: 'required', message: 'Name is required'});
            return false;
        }

        if (!data.email) {
            form.setError('email', {type: 'required', message: 'Email is required'});
            return false;
        }

        if (!data.telephone) {
            form.setError('telephone', {type: 'required', message: 'Telephone is required'});
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
    }

    const onSubmit = async (data: EditUserProfileFormData) => {
        if (!validateForm(data)) {
            return;
        }

        const result = await handleServerAction(() => editProfile(data), {
            loadingMessage: 'Updating profile...',
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
                    <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                {error && <div className="text-red-500">{error}</div>}
                <Form {...form}>
                    <form className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Name <span className="text-red-500">*</span>
                                    </FormLabel>
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
                    </form>
                    <DialogFooter>
                        <div className={`flex items-center justify-between gap-2 w-full`}>
                            <Button variant={'ghost'} onClick={resetForm}
                                    className={`text-primary-500 underline hover:text-primary-700`}>
                                Reset
                            </Button>
                            <div className={`flex items-center gap-2`}>
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

export default EditProfileDialog;