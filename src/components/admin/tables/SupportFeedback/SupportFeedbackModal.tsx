'use client';

import { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  ModalClose,
} from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Download, MessageSquarePlus, AlertCircle, FileText } from 'lucide-react';
import { formatDate } from '@/lib/utils/date';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { toast } from '@/components/ui/toaster';
import { StatusBadge } from '@/components/shared/StatusBadge'; 
import type { SupportFeedbackRequestDetails } from './SupportFeedbackTable';

// --- Helper Components ---

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <div className="text-sm font-semibold text-gray-800 break-words">
        {value || 'N/A'}
      </div>
    </div>
  );
}

function FileDisplay({ label, fileName }: { label: string; fileName?: string }) {
  return (
    <div>
      <Label className="text-xs font-medium text-gray-700 truncate mb-1 block" title={label}>{label}</Label>
      <div className={`flex items-center justify-between p-3 pl-4 border rounded-lg transition-colors bg-gray-50`}>
        {fileName ? (
           <>
             <div className="flex items-center gap-2 overflow-hidden">
                <FileText className="h-4 w-4 text-blue-500 shrink-0" />
                <span className="text-sm font-medium truncate text-gray-800" title={fileName}>
                    {fileName}
                </span>
             </div>
             <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-500 hover:text-dost-title ml-2 shrink-0">
                 <Download className="h-4 w-4" />
             </Button>
           </>
        ) : (
           <span className="text-sm text-gray-400 italic">No attachment provided</span>
        )}
      </div>
    </div>
  );
}

const PREBUILT_RESPONSES = [
  {
    key: 'more_info',
    text: 'Please provide more details regarding your concern so we can assist you better.',
    short: 'Request Details',
  },
  {
    key: 'screenshot',
    text: 'Please upload a screenshot of the error you are encountering.',
    short: 'Request Screenshot',
  },
  {
    key: 'refer_faq',
    text: 'Please refer to the FAQs section regarding this policy.',
    short: 'Refer to FAQ',
  },
  {
    key: 'noted_fixed',
    text: 'We have noted your concern and applied the necessary corrections. Please check your profile again.',
    short: 'Correction Applied',
  },
];

interface SupportFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: SupportFeedbackRequestDetails; 
  onUpdate: () => void; 
}

export function SupportFeedbackModal({
  isOpen,
  onClose,
  request,
  onUpdate
}: SupportFeedbackModalProps) {
  const { scholarInfo, currentPlacement, submissionInfo, files } = request;
  
  // Local state
  const [currentStatus, setCurrentStatus] = useState(submissionInfo.status);
  const [adminResponse, setAdminResponse] = useState(submissionInfo.adminResponse || '');
  
  // Dialog States
  const [isResolveOpen, setIsResolveOpen] = useState(false);
  const [isRequestInfoOpen, setIsRequestInfoOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setCurrentStatus(submissionInfo.status);
    setAdminResponse(submissionInfo.adminResponse || '');
  }, [submissionInfo]);

  const isActionable = currentStatus === 'Pending' || currentStatus === 'Processing' || currentStatus === 'Resubmit';

  const handleAddResponse = (text: string) => {
    setAdminResponse((prev) => (prev.trim() === '' ? text : `${prev}\n\n${text}`));
  };

  // --- SMART LOGIC ---
  const responseLower = (adminResponse || '').toLowerCase();
  
  // Keywords indicating a need for scholar action (Resubmit/Info)
  const infoKeywords = ['provide', 'upload', 'screenshot', 'clarify', 'send', 'submit', 'missing', 'details', 'attach', 'need'];
  const looksLikeRequestInfo = infoKeywords.some(k => responseLower.includes(k));

  const handleAttemptResolve = () => {
    if (looksLikeRequestInfo) {
      toast.warning("Check Action", {
        description: "Your response seems to be asking for information. Consider using 'Request Info' if you need a reply from the scholar.",
        duration: 4000
      });
    }
    setIsResolveOpen(true);
  };

  // --- MOCK ACTIONS (Simulate Backend) ---
  const handleResolve = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Ticket Resolved', { description: `Ticket for ${scholarInfo.name} closed successfully.` });
    
    // In Scholar View, 'Approved' is typically used for Resolved tickets in BaseSubmission
    setCurrentStatus('Approved'); 
    onUpdate(); 
    setIsProcessing(false);
    setIsResolveOpen(false);
    onClose();
  };

  const handleRequestInfo = async () => {
    if (adminResponse.trim() === '') {
      toast.error('Response Required', { description: 'Please enter instructions before requesting info.' });
      return;
    }

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.warning('Info Requested', { 
      description: `Ticket returned to ${scholarInfo.name} for clarification.`,
      className: "bg-yellow-50 border-yellow-200", 
    });
    
    setCurrentStatus('Resubmit');
    onUpdate();
    setIsProcessing(false);
    setIsRequestInfoOpen(false);
    onClose();
  };

  const displayStatus = currentStatus === 'Approved' ? 'Resolved' : currentStatus;

  return (
    <>
      <Modal open={isOpen} onOpenChange={onClose}>
        <ModalContent size="4xl">
          <ModalHeader>
             <div className="flex items-center justify-between w-full pr-8">
                <div className="flex flex-col">
                   <ModalTitle>Support Ticket #{request.id}</ModalTitle>
                   <p className="text-sm text-gray-500 font-normal mt-1">{submissionInfo.category}</p>
                </div>  
             </div>
          </ModalHeader>

          <ModalBody className="max-h-[70vh] overflow-y-auto scrollbar-thin p-6 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              
              {/* LEFT COLUMN: Scholar & Ticket Content */}
              <div className="flex flex-col gap-6 h-full">
                
                {/* 1. Scholar Information */}
                <section className="bg-white border rounded-lg shadow-sm p-5 space-y-3">
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Scholar Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InfoItem label="Name" value={scholarInfo.name} />
                    <InfoItem label="SPAS ID" value={request.spas_id} />
                    <InfoItem label="Email" value={scholarInfo.email} />
                    <InfoItem label="Contact Number" value={scholarInfo.contactNumber} />
                  </div>
                </section>

                {/* 2. Issue Description (Card) */}
                <section className="bg-white border rounded-lg shadow-sm p-5 flex-1 flex flex-col">
                   <h2 className="text-lg font-semibold text-dost-title border-b pb-2 mb-3">
                    Ticket Details
                   </h2>
                   
                   {/* Message */}
                   <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-md flex-1 mb-4">
                      <Label className="text-xs text-yellow-700 uppercase font-bold mb-1 block">Description / Message</Label>
                      <p className="text-gray-800 text-sm whitespace-pre-wrap leading-relaxed">
                        {submissionInfo.description}
                      </p>
                   </div>
                   
                   {/* Attachment */}
                   <FileDisplay label="Attachment" fileName={files.attachment} />
                </section>
              </div>

              {/* RIGHT COLUMN: Context & Actions */}
              <div className="flex flex-col gap-6 h-full">
                
                {/* 3. Context & Status */}
                <section className="bg-white border rounded-lg shadow-sm p-5 space-y-3">
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Placement & Status
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InfoItem label="University" value={currentPlacement.university} />
                    <InfoItem label="Program" value={currentPlacement.program} />
                    <InfoItem label="Date Submitted" value={formatDate(submissionInfo.dateSubmitted)} />
                    <InfoItem label="Current Status" value={
                        <StatusBadge status={displayStatus} className="mt-1"/>
                    } />
                 </div>
                </section>

                {/* 4. Response Area */}
                <section className="bg-white border rounded-lg shadow-sm p-5 flex-1 flex flex-col">
                   <div className="space-y-2 flex-1 flex flex-col">
                      <Label htmlFor="admin-response" className="block text-sm font-medium text-gray-700">
                        Admin Response / Action
                      </Label>
                      {isActionable ? (
                        <>
                          <Textarea
                            id="admin-response"
                            placeholder="Type your response to the scholar here..."
                            className="min-h-[120px] flex-1"
                            value={adminResponse}
                            onChange={(e) => setAdminResponse(e.target.value)}
                          />
                          
                          {/* Smart Warning Inline */}
                          {looksLikeRequestInfo && (
                            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-2 rounded text-xs mt-1 border border-amber-100">
                              <AlertCircle className="w-3 h-3" />
                              <span>Suggestion: Use "Request Info" since you are asking for details.</span>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {PREBUILT_RESPONSES.map((c) => (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                key={c.key}
                                onClick={() => handleAddResponse(c.text)}
                                className="text-xs h-auto py-1 px-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                              >
                                <MessageSquarePlus className="h-3 w-3 mr-1.5" />
                                {c.short}
                              </Button>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="p-4 bg-gray-50 border rounded-md min-h-[100px] text-sm text-gray-600 whitespace-pre-wrap">
                          {adminResponse || <span className="text-gray-400 italic">No response provided.</span>}
                        </div>
                      )}
                    </div>
                </section>
              </div>
            </div>

          </ModalBody>

          <ModalFooter>
            <ModalClose asChild>
              <Button type="button" variant="outline" disabled={isProcessing}>
                {isActionable ? 'Cancel' : 'Close'}
              </Button>
            </ModalClose>
            {isActionable && (
              <>
                <Button
                  type="button"
                  variant="primary"
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  onClick={() => setIsRequestInfoOpen(true)}
                  disabled={isProcessing}
                >
                  REQUEST INFO
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleAttemptResolve}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Resolving...' : 'RESOLVE TICKET'}
                </Button>
              </>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={isResolveOpen}
        onClose={() => setIsResolveOpen(false)}
        onConfirm={handleResolve}
        title="Resolve Ticket"
        description={`Are you sure you want to mark this ticket as RESOLVED? This will notify ${scholarInfo.name}.`}
        variant="info"
        confirmText="Yes, Resolve"
      />
      
      <ConfirmDialog
        isOpen={isRequestInfoOpen}
        onClose={() => setIsRequestInfoOpen(false)}
        onConfirm={handleRequestInfo}
        title="Request Information"
        description={`This will return the ticket to ${scholarInfo.name} for clarification. Are you sure?`}
        variant="warning"
        confirmText="Yes, Request Info"
      />
    </>
  );    
}