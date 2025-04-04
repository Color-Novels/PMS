'use client';

import {useState} from 'react';
import {format} from 'date-fns';
import {Trash2} from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {MedicalCertificate} from '@/app/lib/definitions';
import {deleteMedicalCertificate} from '../documents/lib/actions';
import {CustomBadge} from "@/app/(dashboard)/_components/CustomBadge";

interface MedicalCertificateCardProps {
    certificate: MedicalCertificate;
    action: () => void;
}

export function MedicalCertificateCard({certificate, action}: MedicalCertificateCardProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleDelete = async () => {
        try {
            await deleteMedicalCertificate(certificate.id);
            setIsDeleteDialogOpen(false);
            action();
        } catch (error) {
            console.error('Failed to delete certificate:', error);
        }
    };

    return (
        <>
            <Card
                className="hover:shadow-md transition-shadow duration-300 cursor-pointer"
                onClick={() => setIsOpen(true)}
            >
                <CardHeader className={'pb-2'}>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-lg font-semibold text-gray-900">
                            Medical Certificate
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsDeleteDialogOpen(true);
                            }}
                        >
                            <Trash2 className="h-4 w-4 text-red-500"/>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                                {format(new Date(certificate.dateOfSickness), 'MMM dd, yyyy')}
                            </span>
                            {/*<Badge*/}
                            {/*    variant={certificate.fitForDuty === 'FIT' ? 'default' : 'destructive'}*/}
                            {/*>*/}
                            {/*    {certificate.fitForDuty}*/}
                            {/*</Badge>*/}
                            <CustomBadge text={certificate.fitForDuty}
                                         color={certificate.fitForDuty === 'FIT' ? 'green' : 'red'}/>
                        </div>
                        <p className="text-sm font-medium text-gray-700 truncate">
                            {certificate.natureOfTheDisease}
                        </p>
                        <p className="text-xs text-gray-500">
                            {certificate.recommendedLeaveDays} days leave recommended
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Medical Certificate Details</DialogTitle>
                        <DialogDescription>
                            Issued on {format(new Date(certificate.time), 'PPP')}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">Patient Name</h4>
                                <p className="text-base">{certificate.nameOfThePatient}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">Age</h4>
                                <p className="text-base">{certificate.ageOfThePatient} years</p>
                            </div>
                            <div className="col-span-2">
                                <h4 className="text-sm font-medium text-gray-500">Address</h4>
                                <p className="text-base">{certificate.addressOfThePatient}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-sm font-medium text-gray-500">Medical Status</h4>
                            <div className="flex items-center space-x-2">
                                <Badge
                                    variant={certificate.fitForDuty === 'FIT' ? 'default' : 'destructive'}
                                    className="text-base"
                                >
                                    {certificate.fitForDuty}
                                </Badge>
                                <span className="text-sm text-gray-500">
                                    for duty from {format(new Date(certificate.dateOfSickness), 'PPP')}
                                </span>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-500">Nature of Disease/Condition</h4>
                            <p className="text-base">{certificate.natureOfTheDisease}</p>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-500">Leave Recommendation</h4>
                            <p className="text-base">{certificate.recommendedLeaveDays} days</p>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-500">Additional Recommendations</h4>
                            <p className="text-base whitespace-pre-line">{certificate.reccomendations}</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Medical Certificate</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this medical certificate? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}