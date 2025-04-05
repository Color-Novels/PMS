import BatchDetailComponent from '@/app/(dashboard)/inventory/available-stocks/_components/BatchDetail';

export default async function BatchDetail({ params }: { params: Promise<{ batchId: string }> }) {
    const awaitedParams = await params; // Await params
    return <BatchDetailComponent batchId={awaitedParams.batchId} />;
}