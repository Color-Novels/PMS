// // components/drugs/drug-card.tsx
// import { Drug } from "../lib/types";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
//
// interface DrugCardProps {
//   drug: Drug;
// }
//
// export function DrugCard({ drug }: DrugCardProps) {
//   const isExpired = new Date(drug.expiryDate) < new Date();
//   const isExpiringSoon =
//     new Date(drug.expiryDate) < new Date(new Date().setMonth(new Date().getMonth() + 3)) &&
//     !isExpired;
//
//   const statusColor: Record<string, string> = {
//     available: "bg-green-100 text-green-800",
//     completed: "bg-blue-100 text-blue-800",
//     expired: "bg-red-100 text-red-800",
//     disposed: "bg-gray-100 text-gray-800",
//     "quality failed": "bg-amber-100 text-amber-800",
//   };
//
//   return (
//     <Card>
//       <CardHeader className="pb-2">
//         <div className="flex justify-between items-start">
//           <div>
//             <CardTitle className="text-lg">{drug.name}</CardTitle>
//             <p className="text-sm text-gray-500">{drug.brand}</p>
//           </div>
//           <Badge className={statusColor[drug.batchStatus.toLowerCase()]}>
//             {drug.batchStatus}
//           </Badge>
//         </div>
//       </CardHeader>
//       <CardContent>
//         <div className="grid grid-cols-2 gap-2 text-sm">
//           <div className="flex flex-col">
//             <span className="text-gray-500">Supplier</span>
//             <span>{drug.supplier}</span>
//           </div>
//           <div className="flex flex-col">
//             <span className="text-gray-500">Batch</span>
//             <span>{drug.batchNumber}</span>
//           </div>
//           <div className="flex flex-col">
//             <span className="text-gray-500">Stock Date</span>
//             <span>{new Date(drug.stockDate).toLocaleDateString()}</span>
//           </div>
//           <div className="flex flex-col">
//             <span className={`text-gray-500 ${isExpired ? 'text-red-500' : isExpiringSoon ? 'text-amber-500' : ''}`}>
//               Expiry Date
//             </span>
//             <span className={isExpired ? 'text-red-500 font-medium' : isExpiringSoon ? 'text-amber-500 font-medium' : ''}>
//               {new Date(drug.expiryDate).toLocaleDateString()}
//             </span>
//           </div>
//           <div className="flex flex-col">
//             <span className="text-gray-500">Type</span>
//             <span>{drug.drugModel}</span>
//           </div>
//           <div className="flex flex-col">
//             <span className="text-gray-500">Concentration</span>
//             <span>{drug.unitConcentration}</span>
//           </div>
//         </div>
//         <div className="mt-3">
//           <div className="flex justify-between mb-1 text-sm">
//             <span>Stock: {drug.remainingAmount}/{drug.fullAmount}</span>
//             <span>{Math.round((drug.remainingAmount / drug.fullAmount) * 100)}%</span>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-2">
//             <div
//               className="bg-blue-500 h-2 rounded-full"
//               style={{ width: `${(drug.remainingAmount / drug.fullAmount) * 100}%` }}
//             />
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }