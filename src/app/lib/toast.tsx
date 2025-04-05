import {myConfirmation, myError} from "@/app/lib/definitions";
import {toast} from "react-toastify";
import {ActionOptions, handleServerAction} from "@/app/lib/utils";
import {Button} from "@/components/ui/button";
import {CircleAlert, CircleCheck} from "lucide-react";


type ServerAction = () => Promise<myError>;
type ServerActionWithConfirmation = () => Promise<myError | myConfirmation>;
export const handleServerActionWithConfirmation = async (
    action: ServerActionWithConfirmation,
    confirmAction: ServerAction,
    options: ActionOptions = {}
): Promise<myError> => {
    const {
        loadingMessage = "Processing...",
        position = "bottom-right",
    } = options;

    const id = toast.loading(loadingMessage, {position, pauseOnFocusLoss: false});
    try {
        const result = await action();

        if ('confirmationRequired' in result) {
            // Return a new Promise that resolves when the user takes action
            return new Promise((resolve) => {
                toast.update(id, {
                    render: (
                        <div className={'flex flex-col gap-4'}>
                            <p>{result.message}</p>
                            <div className={'flex justify-end gap-2'}>
                                <Button
                                    onClick={() => {
                                        toast.dismiss(id);
                                        // Resolve with cancel result
                                        resolve({success: false, message: "Action cancelled"});
                                    }}
                                    variant={'outline'}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={async () => {
                                        toast.dismiss();
                                        resolve(handleServerAction(() => confirmAction(), options));
                                    }}
                                    variant={'destructive'}
                                    className={'bg-red-600 hover:bg-red-700 text-white'}
                                >
                                    Confirm
                                </Button>
                            </div>
                        </div>
                    ),
                    type: "error",
                    isLoading: false,
                    autoClose: false,
                    closeOnClick: false,
                });
            });
        } else {
            // Handle regular result (success or error)
            toast.update(id, {
                render: result.message || (result.success ? "Success!" : "An error occurred!"),
                type: result.success ? "success" : "error",
                isLoading: false,
                autoClose: 2000,
                icon: result.success ? <CircleCheck color={'green'}/> : <CircleAlert color={'red'}/>,
            });
            return result;
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred!";
        toast.update(id, {
            render: errorMessage,
            type: "error",
            isLoading: false,
            autoClose: 2000,
            icon: <CircleAlert color={'red'}/>,
        });
        return {success: false, message: errorMessage};
    }
};