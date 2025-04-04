import { Metadata } from "next";
import { USSReferralView } from "../../_components/USSReferralView";

export const metadata: Metadata = {
  title: "PMS - USS Referrals",
  description: "View and manage patient ultrasound scan referrals",
};

export default async function USSReferralsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const awaitedParams = await params;
  const patientId = parseInt(awaitedParams.id);

  return (
    <div className="container mx-auto py-6">
      <USSReferralView patientId={patientId} />
    </div>
  );
}