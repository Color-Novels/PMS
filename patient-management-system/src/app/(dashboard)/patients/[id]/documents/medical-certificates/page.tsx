import { Metadata } from "next";
import { MedicalCertificatesView } from "../../_components/MedicalCertificatesView";

export const metadata: Metadata = {
  title: "PMS - Medical Certificates",
  description: "View and manage patient medical certificates",
};

export default async function MedicalCertificatesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const awaitedParams = await params;
  const patientId = parseInt(awaitedParams.id);

  return (
    <div className="container mx-auto py-6">
      <MedicalCertificatesView patientId={patientId} />
    </div>
  );
}