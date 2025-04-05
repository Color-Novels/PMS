import {Suspense} from "react";
import CardWrapper from "@/app/(dashboard)/queue/[id]/_components/CardWrapper";
import {CardSet} from "@/app/(dashboard)/queue/[id]/_components/Skeletons";
import AllPatientsTable from "@/app/(dashboard)/queue/[id]/_components/AllPatientsTable";


export const metadata = {
    title: "Queue - Patient Management System",
    description: "per queue page",
};

export default async function page({
                                       params,
                                   }: {
    params: Promise<{ id: string }>;
}) {
    const id = parseInt((await params).id);

    // Set metadata
    metadata.title = `Queue ${id} - Patient Management System`;
    metadata.description = `Queue ${id} page`;

    return (
        <div
            className={
                "flex flex-col flex-1 h-full p-4 overflow-y-auto items-center"
            }
        >
            <div className={"w-4/5"}>
                <div>
                    <Suspense fallback={<CardSet number={3}/>}>
                        <CardWrapper id={id}/>
                    </Suspense>
                </div>
                <div className={"mt-5"}>
                    <AllPatientsTable id={id}/>
                </div>
            </div>
        </div>
    );
}
