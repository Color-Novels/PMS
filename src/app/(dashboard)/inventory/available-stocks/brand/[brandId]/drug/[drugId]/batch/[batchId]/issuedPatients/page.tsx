import IssuedPatientsTable from '@/app/(dashboard)/inventory/_components/IssuedPatientsTable';

async function Page({ params }: { params: Promise<{ batchId: string }> }) {
  const batchId = parseInt((await params).batchId);

  return (
    <div className="container mx-auto p-4">
      <IssuedPatientsTable batchId={batchId} />
    </div>
  );
}

export default Page;
