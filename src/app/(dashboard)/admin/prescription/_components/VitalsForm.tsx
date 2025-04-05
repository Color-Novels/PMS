import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {getAllVitals} from "@/app/lib/actions/prescriptions";
import AddVitalDialog from "@/app/(dashboard)/admin/prescription/_components/AddVitalDialog";
import {IconName} from "@/app/lib/iconMapping";
import DynamicIcon from "@/app/(dashboard)/_components/LazyDynamicIcon";
import EditVitalDialog from "@/app/(dashboard)/admin/prescription/_components/EditVitalDialog";
import {BasicColorType, CustomBadge} from "@/app/(dashboard)/_components/CustomBadge";
import DeleteVitalDialog from "@/app/(dashboard)/admin/prescription/_components/DeleteVital";
import {getTextColorClass} from "@/app/lib/utils";
import {Gender, VitalType} from "@prisma/client";
import {Skeleton} from "@/components/ui/skeleton";

const VitalsForm = async () => {
    const vitals = await getAllVitals();
    const getCustomTypeBadge = (type: VitalType) => {
        switch (type) {
            case 'TEXT':
                return <CustomBadge text={'Text'} color={'blue'}/>;
            case 'NUMBER':
                return <CustomBadge text={'Number'} color={'green'}/>;
            case 'DATE':
                return <CustomBadge text={'Date'} color={'red'}/>;
            default:
                return <CustomBadge text={'Unknown'} color={'gray'}/>;
        }
    };


    const getCustomGenderBadge = (gender: Gender | null) => {
        switch (gender) {
            case 'MALE':
                return <CustomBadge text={'Male'} color={'blue'}/>;
            case 'FEMALE':
                return <CustomBadge text={'Female'} color={'pink'}/>;
            default:
                return <CustomBadge text={'All'} color={'gray'}/>;
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vitals.map(vital => (
                <Card key={vital.id || vital.name} className="relative overflow-hidden">
                    {/* Background Icon */}
                    <div className="absolute right-0 bottom-0 opacity-5 transform translate-x-1/4 translate-y-1/4">
                        <DynamicIcon
                            icon={vital.icon as IconName}
                            className={`text-8xl`}
                        />
                    </div>

                    <CardHeader className="flex flex-row items-center justify-between p-4 relative z-10">
                        <div className="flex items-center gap-2">
                            <DynamicIcon icon={vital.icon as IconName}
                                         className={`text-2xl ${getTextColorClass(vital.color as keyof BasicColorType)}`}/>
                            <CardTitle className="text-lg">{vital.name}</CardTitle>
                        </div>
                        <div className={"flex gap-2"}>
                            <EditVitalDialog initialData={
                                {
                                    id: vital.id,
                                    color: vital.color as keyof BasicColorType,
                                    name: vital.name,
                                    icon: vital.icon as IconName,
                                    type: vital.type,
                                    forGender: vital.forGender,
                                    placeholder: vital.placeholder
                                }
                            }/>
                            <DeleteVitalDialog vitalId={vital.id}/>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 relative z-10">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <span className="font-semibold">Placeholder:</span> <span
                                className={'text-gray-500'}>{vital.placeholder}</span>
                            </div>
                            <div>
                                <span
                                    className="font-semibold">For Gender:</span> {getCustomGenderBadge(vital.forGender)}
                            </div>
                            <div>
                                <span
                                    className="font-semibold">Type:</span> {getCustomTypeBadge(vital.type)}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
            <AddVitalDialog/>
        </div>
    );
};

const VitalsFormSkeleton = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(5)].map((_, index) => (
                <Card key={index} className="overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between p-4">
                        <div className="flex items-center gap-2">
                            <Skeleton className="w-8 h-8 rounded-full"/>
                            <CardTitle className="text-lg">
                                <Skeleton className="w-24 h-6"/>
                            </CardTitle>
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="w-6 h-6"/>
                            <Skeleton className="w-6 h-6"/>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 ">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className={'flex items-center gap-2'}>
                                <Skeleton className={'w-12 h-6'}/>
                                <Skeleton className="w-full h-6"/>
                            </div>
                            <div className={'flex items-center gap-2'}>
                                <Skeleton className={'w-12 h-6'}/>
                                <Skeleton className="w-full h-6"/>
                            </div>
                            <div className={'flex items-center gap-2'}>
                                <Skeleton className={'w-12 h-6'}/>
                                <Skeleton className="w-full h-6"/>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export {VitalsFormSkeleton};

export default VitalsForm;