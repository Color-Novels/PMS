'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { USSReferral } from '@/app/lib/definitions';
import { deleteUSSReferral } from '../documents/lib/actions';
import { CustomBadge } from "@/app/(dashboard)/_components/CustomBadge";

interface USSReferralCardProps {
  referral: USSReferral;
  action: () => void;
}

export function USSReferralCard({ referral, action }: USSReferralCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteUSSReferral(referral.id);
      setIsDeleteDialogOpen(false);
      action();
    } catch (error) {
      console.error('Failed to delete referral:', error);
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
              USS Referral
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
                {format(new Date(referral.reportDate), 'MMM dd, yyyy')}
              </span>
              <CustomBadge text={referral.USS_type} color="blue" className="text-sm"/>
            </div>
            <p className="text-sm font-medium text-gray-700 truncate">
              {referral.presentingComplaint}
            </p>
            <p className="text-xs text-gray-500">
              Referred to {referral.radiologist}
            </p>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>USS Referral Details</DialogTitle>
            <DialogDescription>
              Created on {format(new Date(referral.time), 'PPP')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Patient Name</h4>
                <p className="text-base">{referral.nameOfThePatient}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Age</h4>
                <p className="text-base">{referral.ageOfThePatient} years</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Presenting Complaint</h4>
              <p className="text-base whitespace-pre-line">{referral.presentingComplaint}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Duration</h4>
              <p className="text-base">{referral.duration}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">On Examination</h4>
              <p className="text-base whitespace-pre-line">{referral.onExamination}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">PSHx/PMHx</h4>
              <p className="text-base whitespace-pre-line">{referral.pshx_pmhx}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">USS Type</h4>
                <CustomBadge text={referral.USS_type} color="blue" className="text-sm"/>

              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Radiologist</h4>
                <p className="text-base">{referral.radiologist}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Report Date</h4>
              <p className="text-base">{format(new Date(referral.reportDate), 'PPP')}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete USS Referral</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this USS referral? This action cannot be undone.
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