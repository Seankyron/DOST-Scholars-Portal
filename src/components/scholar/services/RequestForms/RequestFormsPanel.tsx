'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, FileBadge, Stamp, Scroll, FileOutput, ShieldCheck, HelpCircle } from 'lucide-react';
import { RequestOptionSelector } from './RequestOptionSelector';
import { RecentRequests } from './RecentRequests';
import { RequestFormsModal } from './RequestFormsModal';
import type { RequestFormType } from '@/types/services';
import { Separator } from '@/components/ui/separator';

export function RequestFormsPanel() {
  const [selectedType, setSelectedType] = useState<RequestFormType | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 1. State to control refreshing
  const [refreshKey, setRefreshKey] = useState(0);

  // 2. Function to increment key (forcing reload)
  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleSelectType = (type: RequestFormType) => {
    setSelectedType(type);
    setSelectedRequest(null);
    setIsModalOpen(true);
  };

  const handleViewRequest = (request: any) => {
    setSelectedType(request.type);
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedType(null);
      setSelectedRequest(null);
    }, 300);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl text-center font-bold text-dost-title mb-4">
        Request Forms
      </h2>

      {/* 1. Guidelines (Consistent with other panels) */}
      <Card className="bg-dost-title/5 border-dost-title/20">
        <CardHeader className="pb-3">
          <CardTitle className="font-bold text-dost-title flex items-center gap-2 text-lg">
            <AlertCircle className="h-5 w-5" />
            General Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-700">
          <p className="text-justify">
            The <strong>Request Forms System</strong> allows DOST scholars to digitally submit and track formal requests for documents, certifications, and endorsements.
          </p>
          <div className="bg-white/60 p-4 rounded-lg border border-blue-100">
             <p className="font-semibold mb-2 text-dost-title">Processing Times:</p>
             <ul className="list-disc list-inside space-y-1 ml-1">
                <li><strong>Certifications & Moral Character:</strong> 3-5 working days</li>
                <li><strong>Letters of Endorsement:</strong> 3-5 working days</li>
                <li><strong>Financial Breakdown:</strong> 5-7 working days</li>
             </ul>
          </div>
          <Separator className="bg-blue-200" />
          <div className="text-xs text-gray-700 italic max-w-4xl">
             <strong>Note:</strong> Approved documents will be sent to your registered email address or made available for download in this portal.
          </div>
        </CardContent>
      </Card>

      {/* 2. Selection Grid (Consistent Design) */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800 ml-1">
          Type of Form to be Requested
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <RequestOptionSelector 
            title="Certificate of Scholarship" 
            description="Proof of active scholarship for Visa, Bank, or School purposes." 
            icon={FileBadge}
            onClick={() => handleSelectType('Certificate of Scholarship')}
          />
          <RequestOptionSelector 
            title="Letter of Endorsement" 
            description="Endorsement for OJT, Thesis data gathering, or Research." 
            icon={Stamp}
            onClick={() => handleSelectType('Letter of Endorsement')}
          />
          <RequestOptionSelector 
            title="Certificate of Grades" 
            description="Copy of grades as submitted to and verified by DOST-SEI." 
            icon={Scroll}
            onClick={() => handleSelectType('Certificate of Grades')}
          />
          <RequestOptionSelector 
            title="Good Moral Character" 
            description="Certification of no pending obligations or violations." 
            icon={ShieldCheck}
            onClick={() => handleSelectType('Certificate of Good Moral')}
          />
          <RequestOptionSelector 
            title="Financial Breakdown" 
            description="Detailed report of total allowances received to date." 
            icon={FileOutput}
            onClick={() => handleSelectType('Financial Breakdown')}
          />
          <RequestOptionSelector 
            title="Others" 
            description="For requests not listed above." 
            icon={HelpCircle}
            onClick={() => handleSelectType('Other')}
          />
        </div>
      </div>

      {/* 3. Recent Activity */}
      <div className="mt-8">
         <RecentRequests 
            onViewDetails={handleViewRequest} 
            refreshTrigger={refreshKey}
         />
      </div>

      {/* 4. Modal */}
      {(selectedType || selectedRequest) && (
        <RequestFormsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          type={selectedType!}
          existingRequest={selectedRequest}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}