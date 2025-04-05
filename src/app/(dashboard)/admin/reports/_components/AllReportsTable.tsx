import React from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {getFilteredReports} from "@/app/lib/actions/reports";
import {CustomBadge, RandomColorBadge} from "@/app/(dashboard)/_components/CustomBadge";
import EditReport from "@/app/(dashboard)/admin/reports/_components/EditReport";
import {DeleteReport} from "@/app/(dashboard)/admin/reports/_components/DeleteReport";

const AllReportsTable = async ({query}: {
    query: string,
}) => {
    const reports = await getFilteredReports(query);

    if (!reports || reports.length === 0) {
        return <Card className={'text-center'}>
            <CardHeader>
                <CardTitle>No Reports</CardTitle>
            </CardHeader>
        </Card>
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
            {reports.map((report) => (
                <Card key={report.id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                            <CardTitle
                                className="text-lg font-bold text-gray-800 flex items-center gap-2 justify-between">
                                <div className={'flex items-center gap-2'}>
                                    {report.name} <CustomBadge text={'# ' + report.id.toString()} color={'gray'}/>
                                </div>
                            </CardTitle>
                            <div className={'flex gap-2'}>
                                <EditReport ID={report.id}/>
                                <DeleteReport reportID={report.id}/>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {report.description && (
                            <p className="text-gray-600 mb-4 text-sm line-clamp-2">{report.description}</p>
                        )}

                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-gray-700">Parameters</h3>
                            <div className="flex flex-wrap gap-2">
                                {report.parameters.map((param) => (
                                    <RandomColorBadge text={`${param.name} (${param.units})`} key={param.id}/>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default AllReportsTable;