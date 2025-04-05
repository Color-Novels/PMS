import React, { Suspense } from 'react';
import {
    Table,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { LoadingRows } from "@/app/(dashboard)/queue/_components/Loading";
import TableContents from "@/app/(dashboard)/queue/_components/TableContents";

// Main Table Component
export default function QueueTable({ currentPage, size }: { currentPage: number, size: number }) {
    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Queue #</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Patients</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <Suspense key={currentPage} fallback={<LoadingRows rows={size} cols={5} />}>
                    <TableContents currentPage={currentPage} size={size} />
                </Suspense>
            </Table>
        </div>
    );
}