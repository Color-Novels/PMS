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
import { Badge } from '@/components/ui/badge';
import { ReferralLetter } from '@/app/lib/definitions';
import { deleteReferralLetter } from '../documents/lib/actions';
import { CustomBadge } from "@/app/(dashboard)/_components/CustomBadge";

interface ReferralLetterCardProps {
  letter: ReferralLetter;
  action: () => void;
}

export function ReferralLetterCard({ letter, action }: ReferralLetterCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteReferralLetter(letter.id);
      setIsDeleteDialogOpen(false);
      action();
    } catch (error) {
      console.error('Failed to delete referral letter:', error);
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
              Referral Letter
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
                {format(new Date(letter.reportDate), 'MMM dd, yyyy')}
              </span>
              <CustomBadge 
                text={letter.consultant_speciality} 
                color="purple"
                className="text-sm"
              />
            </div>
            <p className="text-sm font-medium text-gray-700 truncate">
              To: {letter.consultant_name}
            </p>
            <p className="text-xs text-gray-500">
              {letter.condition1 || 'No conditions specified'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Referral Letter Details</DialogTitle>
            <DialogDescription>
              Created on {format(new Date(letter.time), 'PPP')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Patient Name</h4>
                <p className="text-base">{letter.nameOfThePatient}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Age</h4>
                <p className="text-base">{letter.ageOfThePatient} years</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Consultant</h4>
                <p className="text-base">{letter.consultant_name}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Speciality</h4>
                <Badge variant="outline" className="text-purple-600">
                  {letter.consultant_speciality}
                </Badge>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Conditions</h4>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                {letter.condition1 && <li className="text-base">{letter.condition1}</li>}
                {letter.condition2 && <li className="text-base">{letter.condition2}</li>}
                {letter.condition3 && <li className="text-base">{letter.condition3}</li>}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Investigations</h4>
              <p className="text-base whitespace-pre-line">{letter.investigations || 'None specified'}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Report Date</h4>
              <p className="text-base">{format(new Date(letter.reportDate), 'PPP')}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Referral Letter</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this referral letter? This action cannot be undone.
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