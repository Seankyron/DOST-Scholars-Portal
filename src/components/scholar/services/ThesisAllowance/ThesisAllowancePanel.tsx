'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, BookOpen, FileText, CheckCircle2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThesisAllowanceModal } from './ThesisAllowanceModal';
import { ThesisOptionSelector } from './ThesisOptionSelector';
import { RecentThesisSubmissions } from './RecentThesisSubmissions'; // Assuming you adapt this to use real data or keep mock
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/toaster';
import { ThesisRequest } from './RecentThesisSubmissions';
import { useCurrentThesis } from '@/hooks/scholar/Thesis Allowance/useCurrentThesis'; // Update path as needed

// Types
export type ThesisPercentage = '90%' | '10%' | '100%';

export function ThesisAllowancePanel() {
  const [selectedPercentage, setSelectedPercentage] = useState<ThesisPercentage | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Fetch Data for all 3 types to determine logic
  // Note: We are assuming the user is logged in and the hook handles sessionStorage internally as per your file.
  const { data: data90, loading: l90 } = useCurrentThesis('90%');
  const { data: data10, loading: l10 } = useCurrentThesis('10%');
  const { data: data100, loading: l100 } = useCurrentThesis('100%');

  console.log("Hello")

  // 2. Logic: Define Locks based on Data Existence
  const is100Submitted = !!data100;
  const is90Submitted = !!data90;
  
  // Logic 1 & 2: Hard Locks (Visual Disable)
  // If 100% is submitted -> Disable 90% (and 10% visually, though we handle 10% logic specifically below)
  const is90Disabled = is100Submitted;
  
  // If 90% is submitted -> Disable 100%
  const is100Disabled = is90Submitted; 

  // Logic 3: Soft Lock for 10% (Handled in click handler)
  // We do not pass 'disabled' prop to 10% selector so it remains clickable

  const handleSelectOption = (percentage: ThesisPercentage) => {
    // --- 10% RESTRICTION LOGIC ---
    if (percentage === '10%') {
      // If 100% was somehow submitted (edge case), block it
      if (data100) {
        toast.error("You have already applied for the 100% Full Release.");
        return;
      }
      if (!data90) {
        toast.error("You must submit the 90% Partial Release requirements first.");
        return;
      }
      if (data90.status !== 'Approved') {
        toast.error("Your 90% application must be Approved before applying for the final 10%.");
        return;
      }
    }

    // --- 90% & 100% RESTRICTION LOGIC (Redundant safety check) ---
    if (percentage === '90%' && is90Disabled) {
      toast.error("You have already applied for the 100% Full Release.");
      return;
    };
    if (percentage === '100%' && is100Disabled) {
     toast.error("You have already applied for the Partial Release.");
     return; 
    };

    // Determine if we are editing an existing request
    let existing = null;
    if (percentage === '90%') existing = data90;
    if (percentage === '10%') existing = data10;
    if (percentage === '100%') existing = data100;

    console.log("Existing: ", existing)
    
    setSelectedPercentage(percentage);
    setSelectedRequest(existing); 
    setIsModalOpen(true);
  };

  const handleViewRequest = (request: any) => {
    // Helper to open modal from the Recent Submissions list
    // You might need to map your DB request object to the percentage type here
    const pctStr = request.type; // "90%" -> "90"
    
    console.log("Selected type: ", request.type);
    setSelectedPercentage(pctStr);
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

  // Consolidate history for the Recent List
  // Filtering out nulls
  const history = useMemo(() => {
    const formatted: ThesisRequest[] = [];

    // Helper to map DB data to UI Request type
    const mapToRequest = (data: any, percentage: number, label: string): ThesisRequest => ({
      ...data,
      type: label,                  // Fixes missing 'type'
      percentage: percentage,       // Fixes missing 'percentage' (needed for your locking logic)
      dateSubmitted: data.created_at // Fixes missing 'dateSubmitted' (maps from created_at)
    });

    if (data100) formatted.push(mapToRequest(data100, 100, '100% Full Release'));
    if (data90) formatted.push(mapToRequest(data90, 90, '90% Partial Release'));
    if (data10) formatted.push(mapToRequest(data10, 10, '10% Final Release'));

    // Sort by most recent
    return formatted.sort((a, b) => 
      new Date(b.dateSubmitted).getTime() - new Date(a.dateSubmitted).getTime()
    );
  }, [data100, data90, data10]);

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
           {/* ... (Keep existing text content identical) ... */}
           
           {/* Requirements Layout (Keep existing layout) */}
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
                        <span className="font-semibold text-gray-900">One-Page Abstract:</span> Title, Rationale, Objectives, Methodology.
                      </li>
                      <li className="pl-1">
                        <span className="font-semibold text-gray-900">Approval Sheet:</span> Signed by Adviser and officials.
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
                        <span className="font-semibold text-gray-900">Final Thesis Manuscript:</span> Complete PDF.
                      </li>
                      <li className="pl-1">
                        <span className="font-semibold text-gray-900">Signatures:</span> Valid school authorities.
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
                            Submit <strong>ALL</strong> requirements above simultaneously.
                        </p>
                    </div>
                 </div>
            </div>
          </div>

          <Separator className="bg-blue-200" />
          <div className="text-xs text-gray-700 italic max-w-4xl">
              <strong>Note:</strong> Processing is subject to funds availability.
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
            description={data90 ? `Status: ${data90.status}` : "Submit Abstract & Approval Sheet"}
            amount="₱9,000"
            icon={FileText}
            onClick={() => handleSelectOption('90%')}
            disabled={false} 
          />
          <ThesisOptionSelector
            title="10% Final Release"
            description={data10 ? `Status: ${data10.status}` : "Submit Final Manuscript"}
            amount="₱1,000"
            icon={BookOpen}
            onClick={() => handleSelectOption('10%')}
            disabled={false} // NEVER visually disable 10%, handle logic in onClick
          />
          <ThesisOptionSelector
            title="100% Full Release"
            description={data100 ? `Status: ${data100.status}` : "Submit All Requirements"}
            amount="₱10,000"
            icon={CheckCircle2}
            onClick={() => handleSelectOption('100%')}
            disabled={false}
          />
        </div>
      </div>

      <div className="mt-8">
         <RecentThesisSubmissions 
            onViewDetails={handleViewRequest} // Passing real data now
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