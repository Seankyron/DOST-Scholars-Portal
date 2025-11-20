'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, FileText, Plane, Download } from 'lucide-react';
import { LeaveOfAbsenceModal } from './LeaveOfAbsenceModal';
import { ReasonSelector } from './ReasonSelector';
import { RecentLOARequests } from './RecentLOARequests';
import { downloadableFiles } from '@/config/downloadables';
import type { LOAReason } from '@/types';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

export function LeaveOfAbsencePanel() {
  const [selectedReason, setSelectedReason] = useState<LOAReason | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectReason = (reason: LOAReason) => {
    setSelectedReason(reason);
    setSelectedRequest(null);
    setIsModalOpen(true);
  };

  const handleViewRequest = (request: any) => {
    setSelectedReason(request.reason);
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedReason(null);
      setSelectedRequest(null);
    }, 300);
  };

  const loaFile = downloadableFiles['leave-of-absence']?.[0];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl text-center font-bold text-dost-title mb-4">
        Leave of Absence
      </h2>

      {/* Detailed Requirements Card */}
      <Card className="bg-dost-title/5 border-dost-title/20">
        <CardHeader className="pb-3">
          <CardTitle className="font-bold text-dost-title flex items-center gap-2 text-lg">
            <AlertCircle className="h-5 w-5" />
            Guidelines & Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-gray-700">
          <p className="text-justify">
            Scholars who wish to file a Leave of Absence (LOA) — whether for <strong>medical/personal reasons</strong> or participation in an <strong>exchange student program</strong> — must comply with the following documentary requirements. Kindly ensure that all forms are complete, scanned clearly, and submitted on time to avoid delays.
          </p>

          {/* Two Column Layout for Requirements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            
            {/* Column 1: Medical/Personal */}
            <div className="bg-white/60 p-4 rounded-lg border border-blue-100">
              <h4 className="font-bold text-dost-title mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                For Medical / Personal Reason
              </h4>
              <ul className="space-y-2 list-disc list-inside text-gray-700">
                <li>
                  <strong>Application Form for LOA:</strong> Please download and fill out the template below.
                </li>
                <li>
                  <strong>University Approval of LOA:</strong> Must indicate duration and reason/s. Must be signed by the authorized signatory.
                </li>
                <li>
                  <strong>Certification of Grades:</strong> For all semesters enrolled (from 1st Year, 1st Sem to latest).
                </li>
                <li>
                  <strong>Medical Certificate:</strong> Required only if the reason is due to a medical condition.
                </li>
                <li>Other supporting documents (if applicable).</li>
              </ul>
            </div>

            {/* Column 2: Exchange Student */}
            <div className="bg-white/60 p-4 rounded-lg border border-blue-100">
              <h4 className="font-bold text-dost-title mb-3 flex items-center gap-2">
                <Plane className="h-4 w-4" />
                For Exchange Student Program
              </h4>
              <ul className="space-y-2 list-disc list-inside text-gray-700">
                <li>
                  <strong>Application Form for LOA:</strong> Please download and fill out the template below.
                </li>
                <li>
                  <strong>Certification of Grades:</strong> For all semesters enrolled (from 1st Year, 1st Sem to latest).
                </li>
                <li>
                  <strong>Registration Form / Form 5:</strong> For the applicable semester under the Exchange Student Program as residency.
                </li>
                <li>
                  <strong>Proof of Admission:</strong> Any proof of admission or acceptance letter from the host university.
                </li>
              </ul>
            </div>
          </div>

          <Separator className="bg-blue-200" />

          {/* Footer Note & Download */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="text-xs text-gray-700 italic max-w-2xl">
              <strong>Note:</strong> A scholar may be allowed an official leave of absence for a maximum duration of <strong>one (1) academic year</strong>. The expiration date shall be immediately before the start of the ensuing semester. Extending the leave beyond one year will result to <strong>termination of the scholarship</strong>.
            </div>

            {loaFile && (
               <Button 
                 variant="outline" 
                 size="sm" 
                 asChild
                 className="bg-white hover:bg-blue-50 text-dost-title border-blue-200 shrink-0"
               >
                  <a href={loaFile.url} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4 mr-2" />
                    Download LOA Template
                  </a>
               </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Selection Grid */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800 ml-1">
          Select Application Type
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReasonSelector
            title="Medical / Personal Reason"
            description="Apply for leave due to health issues or personal matters."
            icon={FileText}
            onClick={() => handleSelectReason('Medical/Personal')}
          />
          <ReasonSelector
            title="Exchange Student Program"
            description="Apply for leave to participate in an exchange program."
            icon={Plane}
            onClick={() => handleSelectReason('Exchange Student Program')}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
         <RecentLOARequests onViewDetails={handleViewRequest} />
      </div>

      {/* Main Modal */}
      {(selectedReason || selectedRequest) && (
        <LeaveOfAbsenceModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          reason={selectedReason!}
          existingRequest={selectedRequest}
        />
      )}
    </div>
  );
}