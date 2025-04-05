import { Calendar, Phone, MapPin, Ruler, Weight, CreditCard, LucideIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getPatientDetails } from "@/app/lib/actions";
import { notFound } from "next/navigation";
import { calcAge, getInitials } from "@/app/lib/utils";
import { CustomBadge } from "@/app/(dashboard)/_components/CustomBadge";
import EditPatientForm from "@/app/(dashboard)/patients/[id]/_components/EditPatientDataForm";

const PatientDetails = async ({ id }: { id: number }) => {
    const patient = await getPatientDetails(id);

    const formatDate = (date: Date | null) => {
        if (!date) return "Not provided";

        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short", // "Jan", "Feb", etc.
            day: "numeric",
        });
    };



    const getAvatarColor = (gender: string) => {
        if (gender === 'MALE') return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
        if (gender === 'FEMALE') return 'bg-pink-100 text-pink-800 hover:bg-pink-200';
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    };

    const DetailRow = ({ icon: Icon, label, value }: {
        icon: LucideIcon
        label: string,
        value: string | number | null
    }) => (
        <div className="flex items-center space-x-4 py-1.5">
            <Icon className="h-4 w-4 text-primary-500 flex-shrink-0" />
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">{label}:</span>
                    <span className="text-sm text-gray-900">{value || "Not provided"}</span>
                </div>
            </div>
        </div>
    );

    const getSex = (sex: string) => {
        switch (sex) {
            case 'MALE':
                return <CustomBadge text={sex} color={'blue'} />;
            case 'FEMALE':
                return <CustomBadge text={sex} color={'pink'} />;
            default:
                return <CustomBadge text={'UNKNOWN'} color={'gray'} />;
        }
    }

    if (!patient) return notFound();

    return (
        <div className="flex gap-4 items-center">
            <Avatar className="size-20 flex-shrink-0 shadow font-bold">
                <AvatarFallback className={`text-xl ${getAvatarColor(patient.gender)}`}>
                    {getInitials(patient.name)}
                </AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className={'flex gap-4 justify-between items-center mb-2.5'}>
                    <div className={'flex gap-2 items-center'}>
                        <h2 className="text-xl font-bold">{patient.name} {patient.birthDate ? `- ${calcAge(patient.birthDate)} yrs` : null}</h2>
                        <span>{getSex(patient.gender)}</span></div>
                    <EditPatientForm patientData={{
                        name: patient.name,
                        gender: patient.gender,
                        NIC: patient.NIC ? patient.NIC : '',
                        telephone: patient.telephone,
                        address: patient.address ? patient.address : '',
                        birthDate: patient.birthDate ? patient.birthDate.toISOString().split('T')[0] : '',
                        height: patient.height ? patient.height.toString() : '',
                        weight: patient.weight ? patient.weight.toString() : ''
                    }} id={id} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6">
                    <DetailRow
                        icon={Phone}
                        label="Telephone"
                        value={patient.telephone}
                    />
                    <DetailRow
                        icon={Calendar}
                        label="Birth Date"
                        value={formatDate(patient.birthDate)}
                    />
                    <DetailRow
                        icon={MapPin}
                        label="Address"
                        value={patient.address}
                    />
                    <DetailRow
                        icon={Ruler}
                        label="Height"
                        value={patient.height ? `${patient.height} cm` : null}
                    />
                    <DetailRow
                        icon={Weight}
                        label="Weight"
                        value={patient.weight ? `${patient.weight} kg` : null}
                    />
                    <DetailRow
                        icon={CreditCard}
                        label="NIC"
                        value={patient.NIC}
                    />
                </div>
            </div>
        </div>
    );
};

export default PatientDetails;