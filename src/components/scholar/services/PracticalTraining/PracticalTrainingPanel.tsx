'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, FileText, Briefcase, Download, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PracticalTrainingModal } from './PracticalTrainingModal';
import { ActionSelector } from './ActionSelector'; 
import { RecentPTPRequests } from './RecentPTPRequests'; 

export type PTPTransactionType = 'Referral Letter' | 'Program Completion';

export function PracticalTrainingPanel() {
  const [selectedAction, setSelectedAction] = useState<PTPTransactionType | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectAction = (action: PTPTransactionType) => {
    setSelectedAction(action);
    setSelectedRequest(null);
    setIsModalOpen(true);
  };

  const handleViewRequest = (request: any) => {
    const type = request.trainingCompletion ? 'Program Completion' : 'Referral Letter';
    setSelectedAction(type);
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedAction(null);
      setSelectedRequest(null);
    }, 300);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl text-center font-bold text-dost-title mb-4">
        Practical Training Program
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
            This portal serves as the official channel for uploading necessary documents for processing the <strong>Practical Training Program</strong>. Kindly ensure that all submissions are complete and accurate to avoid delays in evaluation.
          </p>

          {/* Two Column Layout for Requirements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            
            {/* Column 1: Referral Letter */}
            <div className="bg-white/60 p-4 rounded-lg border border-blue-100 flex flex-col h-full">
              <h4 className="font-bold text-dost-title mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                For PTP Referral Letter
              </h4>
              <ul className="space-y-2 list-disc list-inside text-gray-700 flex-grow">
                <li>
                  <strong>Certified Complete Grades:</strong> From 1st semester, 1st year up to latest.
                </li>
                <li>
                  <strong>Accomplished Reply Slip:</strong> Must be signed and filled out correctly.
                </li>
              </ul>
              
              {/* Downloadable for Referral */}
              <div className="mt-4 pt-3 border-t border-blue-100">
                 <Button 
                   variant="outline" 
                   size="sm" 
                   asChild
                   className="w-full bg-white hover:bg-blue-50 text-dost-title border-blue-200"
                 >
                    <a href="/templates/ptp/Reply Slip_4A.pdf" download target="_blank" rel="noopener noreferrer">
                      <Download className="h-3 w-3 mr-2" />
                      Download Reply Slip
                    </a>
                 </Button>
              </div>
            </div>

            {/* Column 2: Program Completion */}
            <div className="bg-white/60 p-4 rounded-lg border border-blue-100 flex flex-col h-full">
              <h4 className="font-bold text-dost-title mb-3 flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                For PTP Program Completion
              </h4>
              <ul className="space-y-2 list-disc list-inside text-gray-700 flex-grow">
                <li>
                  <strong>Accomplished PTP Forms:</strong> Forms 126, 127, 128.
                </li>
                <li>
                  <strong>Daily Time Record (DTR):</strong> Signed by the supervisor.
                </li>
                <li>
                  <strong>Certificate of Completion:</strong> From the host company.
                </li>
              </ul>

              {/* Downloadables for Completion */}
              <div className="mt-4 pt-3 border-t border-blue-100 flex flex-col gap-2">
                 <Button 
                   variant="outline" 
                   size="sm" 
                   asChild
                   className="w-full bg-white hover:bg-blue-50 text-dost-title border-blue-200 justify-start"
                 >
                    <a href="/templates/ptp/Forms_126-128_PTP.pdf" download target="_blank" rel="noopener noreferrer">
                      <Download className="h-3 w-3 mr-2" />
                      Download PTP Forms (126-128)
                    </a>
                 </Button>
                 <Button 
                   variant="outline" 
                   size="sm" 
                   asChild
                   className="w-full bg-white hover:bg-blue-50 text-dost-title border-blue-200 justify-start"
                 >
                    <a href="/templates/ptp/DTR.pdf" download target="_blank" rel="noopener noreferrer">
                      <Download className="h-3 w-3 mr-2" />
                      Download DTR Template
                    </a>
                 </Button>
              </div>
            </div>
          </div>

          <Separator className="bg-blue-200" />

          {/* Eligibility Notes */}
          <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
             <h5 className="font-semibold text-dost-title text-xs uppercase mb-1 flex items-center gap-1">
                <Info className="h-3 w-3" /> Eligibility Notes
             </h5>
             <ul className="text-xs text-gray-700 space-y-1 list-disc list-inside">
                <li>PTP is <strong>optional</strong> if OJT is included in your regular semester curriculum.</li>
                <li>You may <strong>waive</strong> PTP if you are required to enroll in summer subjects.</li>
             </ul>
          </div>

          {/* Footer Note */}
          <div className="text-xs text-gray-700 italic max-w-4xl">
              <strong>Note:</strong> If your OJT is scheduled during midyear, also submit your <strong>Certified Complete Grades</strong> and <strong>Official Registration Form</strong> through the <strong>Grade Submission</strong> module.
          </div>
        </CardContent>
      </Card>

      {/* Selection Grid */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800 ml-1">
          Select Transaction
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ActionSelector
            title="Request Referral Letter"
            description="Submit grades and reply slip to get your endorsement."
            icon={FileText}
            onClick={() => handleSelectAction('Referral Letter')}
          />
          <ActionSelector
            title="Submit Completion Report"
            description="Upload signed forms and certificate of completion."
            icon={Briefcase}
            onClick={() => handleSelectAction('Program Completion')}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
         <RecentPTPRequests onViewDetails={handleViewRequest} />
      </div>

      {/* Main Modal */}
      {(selectedAction || selectedRequest) && (
        <PracticalTrainingModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          type={selectedAction!}
          existingRequest={selectedRequest}
        />
      )}
    </div>
  );
}