import { AiOutlineIdcard, AiOutlinePhone } from "react-icons/ai";
import Link from "next/link";
import { calcAge, getInitials } from "@/app/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Patient } from "@prisma/client";
import AddToActiveQueueButton from "@/app/(dashboard)/patients/_components/AddToActiveQueueButton";
import { Card } from "@/components/ui/card";
import {getActiveQueue} from "@/app/lib/actions/queue";

export default async function PatientsList({
  patients,
}: {
  patients: Patient[];
}) {
  const getAvatarColor = (gender: string) => {
    if (gender === "MALE") return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    if (gender === "FEMALE")
      return "bg-pink-100 text-pink-800 hover:bg-pink-200";
    return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  };

  const activeQueue = await getActiveQueue();

  return (
    <div className="flex flex-col gap-4">
      {patients.length > 0 ? (
        patients.map((patient) => (
          <Card
            key={patient.id}
            className="flex items-center justify-between p-5 hover:bg-gray-50 hover:shadow-md transition-all duration-300"
          >
            {/* Clickable area for navigation */}
            <Link
              href={`/patients/${patient.id}`}
              className="flex-1 flex justify-between items-center pr-6"
            >
              {/* Patient Name */}
              <div
                className={`flex items-center gap-4 font-semibold text-md flex-1 ${
                  patient.gender === "MALE"
                    ? "text-primary-600"
                    : "text-pink-600"
                }`}
              >
                <Avatar className="size-10 flex-shrink-0 shadow font-bold">
                  <AvatarFallback
                    className={`text-sm ${getAvatarColor(patient.gender)}`}
                  >
                    {getInitials(patient.name)}
                  </AvatarFallback>
                </Avatar>
                <span>
                  {patient.name}
                  {patient.birthDate && ` - ${calcAge(patient.birthDate)} yrs`}
                </span>
              </div>

              {/* NIC */}
              <div className="flex items-center gap-3 text-gray-700 text-sm justify-center flex-1">
                <AiOutlineIdcard className="w-5 h-5 text-gray-500" />
                <span className="font-medium tracking-wide">{patient.NIC}</span>
              </div>

              {/* Telephone */}
              <div className="flex items-center gap-3 text-gray-700 text-sm justify-end flex-1">
                <AiOutlinePhone className="w-5 h-5 text-gray-500" />
                <span className="font-medium tracking-wide">
                  {patient.telephone}
                </span>
              </div>
            </Link>

            {/* Add to Active Queue Button */}
            {activeQueue && (
              <div className="ml-6">
                <AddToActiveQueueButton
                  patientID={patient.id}
                  queue={activeQueue}
                />
              </div>
            )}
          </Card>
        ))
      ) : (
        <p className="text-gray-500">No patients found.</p>
      )}
    </div>
  );
}
