'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import React, { useEffect, useState } from 'react';
import { getIssuedPatients } from '@/app/lib/actions';
import { useRouter } from 'next/navigation';

interface IssuedPatientsTableProps {
  batchId: number;
}

interface IssuedPatient {
  id: number;
  issuedDate: string;
  patientId: number;
  patientName: string;
  prescriptionId: number;
  issuedAmount: number;
}

const IssuedPatientsTable: React.FC<IssuedPatientsTableProps> = ({ batchId }) => {
  const [issuedPatients, setIssuedPatients] = useState<IssuedPatient[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchIssuedPatients = async () => {
      const data = await getIssuedPatients(batchId);
      setIssuedPatients(data);
    };
    fetchIssuedPatients();
  }, [batchId]);

  return (
    <Card className="shadow-lg border border-gray-200 dark:border-gray-800 rounded-xl">
      <CardHeader className="bg-gray-100 dark:bg-gray-900 rounded-t-xl p-4">
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">Issued Patients</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="relative w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
          <Table className="w-full border-collapse">
            <TableHeader className="bg-gray-50 dark:bg-gray-800">
              <TableRow>
                <TableHead className="p-4 text-left text-gray-700 dark:text-gray-300">Patient Name</TableHead>
                <TableHead className="p-4 text-left text-gray-700 dark:text-gray-300">Issued Amount</TableHead>
                <TableHead className="p-4 text-left text-gray-700 dark:text-gray-300">Issued Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {issuedPatients.length > 0 ? (
                issuedPatients.map((patient) => (
                  <TableRow
                    key={patient.id}
                    className="border-b hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer"
                    onClick={() => router.push(`/patients/${patient.patientId}/prescriptions/${patient.prescriptionId}`)}
                  >
                    <TableCell className="p-4 text-gray-900 dark:text-white font-medium">{patient.patientName}</TableCell>
                    <TableCell className="p-4 text-gray-700 dark:text-gray-300">{patient.issuedAmount}</TableCell>
                    <TableCell className="p-4 text-gray-600 dark:text-gray-400">{patient.issuedDate}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="p-4 text-center text-gray-500 dark:text-gray-400">
                    No issued patients found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default IssuedPatientsTable;
