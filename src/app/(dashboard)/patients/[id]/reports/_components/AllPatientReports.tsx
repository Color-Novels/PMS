import React from 'react';
import {Card, CardHeader, CardTitle, CardContent} from '@/components/ui/card';
import {formatDistanceToNow} from 'date-fns';
import {getPatientReports} from "@/app/lib/actions/reports";
import {CustomBadge} from "@/app/(dashboard)/_components/CustomBadge";
import {DeleteReport} from "@/app/(dashboard)/patients/[id]/reports/_components/DeleteReporAlert";
import {PatientParameterChartDialog} from "@/app/(dashboard)/patients/[id]/reports/_components/PatientParameterChart";

const AllPatientReports = async ({currentPage, query, range, id}: {
    currentPage: number;
    query: string;
    range: string;
    id: number;
}) => {
    const reports = await getPatientReports(query, range, id, currentPage);

    if (!reports || reports.length === 0) {
        return <Card className={'text-center'}>
            <CardHeader>
                <CardTitle>No Reports</CardTitle>
            </CardHeader>
        </Card>
    }

    return (
        <div className="flex flex-col gap-4">
            {reports.map((report) => (
                <Card key={report.id} className="w-full overflow-hidden border-l-4 border-l-primary-500">
                    <CardHeader className={'pb-2'}>
                        <CardTitle className="flex justify-between items-center">
                            <CardTitle className="text-lg font-semibold text-gray-900">
                                {report.reportType.name}
                            </CardTitle>
                            <div className="flex gap-2 items-center">
                            <span
                                className="text-sm text-muted-foreground">{formatDistanceToNow(new Date(report.time), {addSuffix: true})}</span>
                                <DeleteReport id={report.id} patientId={id}/>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-2">
                            {report.parameters.map((param) => (
                                <div key={param.reportParameter.name} className="flex justify-start items-center gap-4">
                                <span className="text-muted-foreground text-sm">
                                    {param.reportParameter.name}
                                    {param.reportParameter.units ? ` (${param.reportParameter.units})` : ''} :
                                </span>
                                    {param.attention ?
                                        <CustomBadge text={param.value} color={'red'}/>
                                        : <span className="font-semibold text-sm">{param.value}</span>}
                                    <PatientParameterChartDialog patientId={id} parameterId={param.reportParameter.id}/>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default AllPatientReports;