import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { PiHospitalFill } from "react-icons/pi";

interface SupplierPricingProps {
  supplierName: string;
  batches: {
    batchId: number;
    batchNumber: string;
    brandName: string;
    concentration: number;
    retailPrice: number;
    totalPrice: number;
    remainingQuantity: number;
    expiryDate: string;
  }[];
}

// Helper function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function SupplierPricingTable({
  supplierName,
  batches,
}: SupplierPricingProps) {
  return (
    <Card className="mb-4 rounded-lg shadow-sm overflow-hidden border border-gray-200">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-200">
        <div className="flex items-center">
          <PiHospitalFill className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">
            {supplierName}
          </h3>
          <Badge className="ml-3 bg-blue-100 text-blue-700 hover:bg-blue-200">
            {batches.length} {batches.length === 1 ? "batch" : "batches"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-medium text-amber-700">
                  Batch Number
                </TableHead>
                <TableHead className="font-medium text-purple-700">
                  Brand
                </TableHead>
                <TableHead className="font-medium text-blue-700">
                  Concentration
                </TableHead>
                <TableHead className="font-medium text-red-700">
                  Retail Price
                </TableHead>
                <TableHead className="font-medium text-teal-700">
                  Total Price
                </TableHead>
                <TableHead className="font-medium text-cyan-700">
                  Stock
                </TableHead>
                <TableHead
                  className="font-medium text-rose-600
"
                >
                  Expiry
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches.map((batch) => (
                <TableRow
                  key={batch.batchId}
                  className="hover:bg-blue-50 transition-colors duration-150"
                >
                  <TableCell className="font-medium">
                    {batch.batchNumber}
                  </TableCell>
                  <TableCell className="flex items-center">
                    {batch.brandName}
                  </TableCell>
                  <TableCell>{batch.concentration} mg</TableCell>
                  <TableCell>
                    <span className="font-medium text-gray-900">
                      Rs. {batch.retailPrice.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-900">
                      Rs. {batch.totalPrice.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        batch.remainingQuantity > 20
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : batch.remainingQuantity > 0
                          ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                      }
                    >
                      {batch.remainingQuantity}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex items-center text-gray-700">
                    <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                    {formatDate(batch.expiryDate)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
