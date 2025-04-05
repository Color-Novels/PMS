"use client";

import {AlertDialogFooter, AlertDialogHeader} from '@/components/ui/alert-dialog';
import {Button} from '@/components/ui/button';
import {AlertDialog, AlertDialogContent, AlertDialogTrigger} from '@/components/ui/alert-dialog';
import {useState} from 'react';
import {AlertDialogTitle} from '@radix-ui/react-alert-dialog';
import {AiOutlineCheck, AiOutlineClose} from 'react-icons/ai';
import {IoMdDoneAll} from 'react-icons/io';
import {FaTrashAlt} from 'react-icons/fa';
import {MdEventAvailable, MdSmsFailed} from 'react-icons/md';
import {handleConfirmationOfBatchStatusChange} from '@/app/lib/actions';
import {handleServerAction} from "@/app/lib/utils"; // Import useRouter

const BatchStatusChangeButtonBar = ({batchId}: { batchId: string }) => {
    const [action, setAction] = useState<"completed" | "disposed" | "quality_failed" | "available" | null>(null);
    const [completedOpen, setCompletedOpen] = useState(false);
    const [qualityFailedOpen, setQualityFailedOpen] = useState(false);
    const [availableOpen, setAvailableOpen] = useState(false);
    const [disposedOpen, setDisposedOpen] = useState(false);

    const handleConfirm = async () => {
        if (action) {
            await handleServerAction(() => handleConfirmationOfBatchStatusChange(Number(batchId), action), {loadingMessage: `Marking batch as ${action}...`}); // Call handleServerAction
        }
    };

    return (
        <div className="flex justify-center gap-4">
            <AlertDialog open={completedOpen} onOpenChange={setCompletedOpen}>
                <AlertDialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary-600" onClick={() => {
                        setCompletedOpen(true);
                        setAction("completed");
                    }}>
                        <IoMdDoneAll className="mr-2"/>
                        Mark as Completed
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to mark this batch as completed?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button variant="outline" onClick={() => setCompletedOpen(false)}>
                            <AiOutlineClose className="mr-2"/> Cancel
                        </Button>
                        <Button className="bg-primary hover:bg-primary-600" onClick={async () => {
                            await handleConfirm();
                            setCompletedOpen(false);
                        }}>
                            <AiOutlineCheck className="mr-2"/> Confirm
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={availableOpen} onOpenChange={setAvailableOpen}>
                <AlertDialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700" onClick={() => {
                        setAvailableOpen(true);
                        setAction("available");
                    }}>
                        <MdEventAvailable className="mr-2"/>
                        Revoke
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to revoke this batch?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button variant="outline" onClick={() => setAvailableOpen(false)}>
                            <AiOutlineClose className="mr-2"/> Cancel
                        </Button>
                        <Button className="bg-green-600 hover:bg-green-700" onClick={async () => {
                            await handleConfirm();
                            setAvailableOpen(false);
                        }}>
                            <AiOutlineCheck className="mr-2"/> Confirm
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>


            <AlertDialog open={qualityFailedOpen} onOpenChange={setQualityFailedOpen}>
                <AlertDialogTrigger asChild>
                    <Button className="bg-violet-500 hover:bg-violet-600" onClick={() => {
                        setQualityFailedOpen(true);
                        setAction("quality_failed");
                    }}>
                        <MdSmsFailed className="mr-2"/>
                        Quality Failed
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to mark this batch as quality failed?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button variant="outline" onClick={() => setQualityFailedOpen(false)}>
                            <AiOutlineClose className="mr-2"/> Cancel
                        </Button>
                        <Button className="bg-violet-500 hover:bg-violet-600" onClick={async () => {
                            await handleConfirm();
                            setQualityFailedOpen(false);
                        }}>
                            <AiOutlineCheck className="mr-2"/> Confirm
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={disposedOpen} onOpenChange={setDisposedOpen}>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" onClick={() => {
                        setDisposedOpen(true);
                        setAction("disposed");
                    }}>
                        <FaTrashAlt className="mr-2"/>
                        Dispose
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to dispose this batch?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button variant="outline" onClick={() => setDisposedOpen(false)}>
                            <AiOutlineClose className="mr-2"/> Cancel
                        </Button>
                        <Button variant="destructive" onClick={async () => {
                            await handleConfirm();
                            setDisposedOpen(false);
                        }}>
                            <AiOutlineCheck className="mr-2"/> Confirm
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default BatchStatusChangeButtonBar;
