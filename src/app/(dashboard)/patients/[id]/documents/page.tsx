import { Metadata } from "next";
import { MedicalCertificatesView } from "../_components/MedicalCertificatesView";
import { USSReferralView } from "../_components/USSReferralView";
import { ReferralLetterView } from "../_components/ReferralLetterView";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, FileHeart, FileSpreadsheet } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PMS - Patient Documents",
  description: "View and manage patient medical certificates and referrals",
};

export default async function DocumentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const awaitedParams = await params;
  const patientId = parseInt(awaitedParams.id);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Patient Documents</h1>
      
      {/* Document Type Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Link href={`/patients/${patientId}/documents/medical-certificates`} passHref>
          <Card className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <FileHeart className="h-5 w-5 text-primary" />
                Medical Certificates
              </CardTitle>
              <CardDescription>
                Generate and manage medical certificates
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground">
                Create work/school absence documentation for patients
              </p>
            </CardContent>
            <CardFooter className="bg-muted/50 text-xs text-muted-foreground pt-2 pb-2">
              View all medical certificates
            </CardFooter>
          </Card>
        </Link>

        <Link href={`/patients/${patientId}/documents/uss-referrals`} passHref>
          <Card className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                USS Referrals
              </CardTitle>
              <CardDescription>
                Manage ultrasound scan referrals
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground">
                Create and track ultrasound referrals for diagnostic imaging
              </p>
            </CardContent>
            <CardFooter className="bg-muted/50 text-xs text-muted-foreground pt-2 pb-2">
              View all USS referrals
            </CardFooter>
          </Card>
        </Link>

        <Link href={`/patients/${patientId}/documents/referral-letters`} passHref>
          <Card className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Referral Letters
              </CardTitle>
              <CardDescription>
                Manage specialist referral letters
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground">
                Create referrals to specialists and other healthcare providers
              </p>
            </CardContent>
            <CardFooter className="bg-muted/50 text-xs text-muted-foreground pt-2 pb-2">
              View all referral letters
            </CardFooter>
          </Card>
        </Link>
      </div>

      {/* Document Lists - Optional for homepage preview */}
      <div className="space-y-12">
        <MedicalCertificatesView patientId={patientId} previewMode={true} />
        <USSReferralView patientId={patientId} previewMode={true} />
        <ReferralLetterView patientId={patientId} previewMode={true} />
      </div>
    </div>
  );
}