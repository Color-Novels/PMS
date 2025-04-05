import { Metadata } from "next";
import { ReferralLetterView } from "../../_components/ReferralLetterView";

export const metadata: Metadata = {
  title: "PMS - Referral Letters",
  description: "View and manage patient referral letters",
};

export default async function ReferralLettersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const awaitedParams = await params;
  const patientId = parseInt(awaitedParams.id);

  return (
    <div className="container mx-auto py-6">
      <ReferralLetterView patientId={patientId} />
    </div>
  );
}