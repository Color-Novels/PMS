import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MedicalCertificateExport } from "./MedicalCertificateExport";
import { MedicalCertificateList } from "./MedicalCertificateList";
import { FilePlus, ChevronLeft } from "lucide-react";
import Link from "next/link";

interface MedicalCertificatesViewProps {
  patientId: number;
  previewMode?: boolean;
}

export function MedicalCertificatesView({ 
  patientId, 
  previewMode = false 
}: MedicalCertificatesViewProps) {
  return (
    <Card className="shadow-sm border-t-4 border-t-primary">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              {!previewMode && (
                <Link href={`/patients/${patientId}/documents`}>
                  <Button variant="ghost" size="sm" className="rounded-full p-0 w-8 h-8">
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                </Link>
              )}
              Medical Certificates
            </CardTitle>
            {!previewMode && (
              <p className="text-sm text-muted-foreground">
                Create and manage medical certificates for work or school absence
              </p>
            )}
          </div>
          
          <div className="flex gap-2">
            {!previewMode && (
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <FilePlus className="h-4 w-4" />
                New
              </Button>
            )}
            <MedicalCertificateExport patientId={patientId} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <MedicalCertificateList 
          patientId={patientId} 
          limit={previewMode ? 3 : undefined} 
        />
        
      </CardContent>
    </Card>
  );
}