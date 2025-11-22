'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, BookOpen, FileText, CheckCircle2, Download, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThesisAllowanceModal } from './ThesisAllowanceModal';
import { ThesisOptionSelector } from './ThesisOptionSelector';
import { RecentThesisSubmissions, type ThesisRequest } from './RecentThesisSubmissions';
import { Separator } from '@/components/ui/separator';
import type { ThesisPercentage, SubmissionStatus } from '@/types/services';

// Mock data with file info for preview
const MOCK_HISTORY: ThesisRequest[] = [
  // Uncomment to test "90% Submitted" state
  /*
  {
    id: 1,
    percentage: 90,
    status: 'Approved',
    dateSubmitted: new Date().toISOString(),
    // Mock file data for the modal
    abstractFile: { name: 'My_Thesis_Abstract.pdf', url: '#' },
    approvalFile: { name: 'Signed_Approval_Sheet.pdf', url: '#' }
  }
  */
];

export function ThesisAllowancePanel() {
  const [selectedPercentage, setSelectedPercentage] = useState<ThesisPercentage | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [history, setHistory] = useState<ThesisRequest[]>(MOCK_HISTORY);

  // --- LOCKING & SELECTION LOGIC ---
  const { request90, request100, request10 } = useMemo(() => {
    return {
        request90: history.find(h => h.percentage === 90 && h.status !== 'Rejected'),
        request10: history.find(h => h.percentage === 10 && h.status !== 'Rejected'),
        request100: history.find(h => h.percentage === 100 && h.status !== 'Rejected'),
    };
  }, [history]);

  // Logic:
  // 1. If 100% is submitted, 90% and 10% are locked (cannot take partial path).
  // 2. If 90% is submitted, 100% is locked (cannot take full path).
  // 3. 10% is locked until 90% is submitted.
  
  const is90Disabled = !!request100; 
  const is100Disabled = !!request90; 
  const is10Disabled = !request90 || !!request100; 

  const handleSelectOption = (percentage: ThesisPercentage) => {
    // Check if we already have a request for this percentage
    const existing = history.find(h => h.percentage === percentage && h.status !== 'Rejected');
    
    setSelectedPercentage(percentage);
    setSelectedRequest(existing || null); // Pass existing request if found
    setIsModalOpen(true);
  };

  const handleViewRequest = (request: any) => {
    setSelectedPercentage(request.percentage);
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedPercentage(null);
      setSelectedRequest(null);
    }, 300);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl text-center font-bold text-dost-title mb-4">
        Thesis Allowance
      </h2>

      <Card className="bg-dost-title/5 border-dost-title/20">
        <CardHeader className="pb-3">
          <CardTitle className="font-bold text-dost-title flex items-center gap-2 text-lg">
            <AlertCircle className="h-5 w-5" />
            Guidelines & Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-gray-700">
          <p className="text-justify">
            This portal serves as the official channel for uploading necessary documents for processing the <strong>90%, 10%, and 100%</strong> release of the thesis allowance. Kindly ensure that all submissions are complete and accurate to avoid delays in evaluation.
          </p>

          {/* Requirements Layout */}
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 90% Release */}
                <div className="bg-white/60 p-5 rounded-xl border border-blue-100 flex flex-col h-full shadow-sm hover:border-blue-200 transition-colors">
                  <h4 className="font-bold text-dost-title mb-3 flex items-center gap-2 text-base">
                      <FileText className="h-5 w-5 text-blue-600" />
                      For 90% (₱9,000) - Partial
                  </h4>
                  <ul className="space-y-3 list-disc list-inside text-gray-700 flex-grow mb-4">
                      <li className="pl-1">
                        <span className="font-semibold text-gray-900">One-Page Abstract:</span> Include Title, Rationale, Objectives, and Methodology.
                      </li>
                      <li className="pl-1">
                        <span className="font-semibold text-gray-900">Approval Sheet:</span> Signed by Thesis Adviser and school officials.
                      </li>
                  </ul>
                  <div className="mt-auto pt-3 border-t border-blue-100/50">
                      <Button variant="outline" size="sm" asChild className="w-full bg-white hover:bg-blue-50 text-dost-title border-blue-200">
                          <a href="/templates/thesis/Abstract_Template.docx" download target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 mr-2" />
                          Download Abstract Template
                          </a>
                      </Button>
                  </div>
                </div>

                {/* 10% Release */}
                <div className="bg-white/60 p-5 rounded-xl border border-blue-100 flex flex-col h-full shadow-sm hover:border-blue-200 transition-colors">
                  <h4 className="font-bold text-dost-title mb-3 flex items-center gap-2 text-base">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      For 10% (₱1,000) - Final
                  </h4>
                  <ul className="space-y-3 list-disc list-inside text-gray-700 flex-grow mb-4">
                      <li className="pl-1">
                        <span className="font-semibold text-gray-900">Final Thesis Manuscript:</span> Submit the complete manuscript in PDF Format.
                      </li>
                      <li className="pl-1">
                        <span className="font-semibold text-gray-900">Signatures:</span> Must include valid signatures from school authorities.
                      </li>
                  </ul>
                </div>
            </div>

            {/* 100% Release */}
            <div className="bg-white/60 p-5 rounded-xl border border-blue-100 shadow-sm hover:border-blue-200 transition-colors">
                 <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-full shrink-0">
                        <CheckCircle2 className="h-6 w-6 text-dost-title" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-bold text-dost-title text-base">To Receive the FULL 100% (₱10,000)</h4>
                        <p className="text-gray-700 text-sm leading-relaxed">
                            You may submit <strong>ALL</strong> requirements listed above (Abstract, Approval Sheet, and Final Manuscript) simultaneously to process the full amount in a single transaction.
                        </p>
                    </div>
                 </div>
            </div>
          </div>

          <Separator className="bg-blue-200" />

          <div className="text-xs text-gray-700 italic max-w-3xl">
              <strong>Note:</strong> Processing of financial assistance is subject to the availability of funds for the purpose and to pertinent government accounting and auditing rules.
          </div>
        </CardContent>
      </Card>

      {/* Selection Grid */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800 ml-1">
          Select Release Type
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ThesisOptionSelector
            title="90% Partial Release"
            description="Submit Abstract & Approval Sheet"
            amount="₱9,000"
            icon={FileText}
            onClick={() => handleSelectOption(90)}
            disabled={is90Disabled}
          />
          <ThesisOptionSelector
            title="10% Final Release"
            description="Submit Final Manuscript"
            amount="₱1,000"
            icon={BookOpen}
            onClick={() => handleSelectOption(10)}
            disabled={is10Disabled}
          />
          <ThesisOptionSelector
            title="100% Full Release"
            description="Submit All Requirements"
            amount="₱10,000"
            icon={CheckCircle2}
            onClick={() => handleSelectOption(100)}
            disabled={is100Disabled}
          />
        </div>
      </div>

      <div className="mt-8">
         <RecentThesisSubmissions 
            onViewDetails={handleViewRequest} 
            requests={history} 
         />
      </div>

      {(selectedPercentage || selectedRequest) && (
        <ThesisAllowanceModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          percentage={selectedPercentage!}
          existingRequest={selectedRequest}
        />
      )}
    </div>
  );
}