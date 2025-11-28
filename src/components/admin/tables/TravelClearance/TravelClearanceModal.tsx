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
import { Download, MessageSquarePlus, AlertTriangle } from 'lucide-react';
import { formatDate } from '@/lib/utils/date';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { toast } from '@/components/ui/toaster';
import { StatusBadge } from '@/components/shared/StatusBadge'; 
import type { TravelRequestDetails } from './TravelClearanceTable';

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

function FileDisplay({
  label,
  fileName,
  needsResubmit = false,
}: {
  label: string;
  fileName?: string;
  needsResubmit?: boolean;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <Label className="text-xs font-medium text-gray-700 truncate" title={label}>{label}</Label>
        {needsResubmit && (
          <span className="text-[10px] font-bold text-red-600 flex-shrink-0 ml-2">To Resubmit</span>
        )}
      </div>
      <div className={`flex items-center justify-between p-2 pl-3 border rounded-lg h-12 transition-colors ${needsResubmit ? 'bg-red-50 border-red-200' : 'bg-gray-50'}`}>
        {fileName ? (
           <>
             <span className={`text-sm font-medium truncate flex-1 mr-2 ${needsResubmit ? 'text-red-700' : 'text-gray-800'}`} title={fileName}>
               {fileName}
             </span>
             <div className="flex items-center gap-1 flex-shrink-0">
               <Button variant="ghost" size="sm" className="w-6 h-6 p-0 text-gray-500 hover:text-dost-title" title="View">
               </Button>
               <Button variant="ghost" size="sm" className="w-6 h-6 p-0 text-gray-500 hover:text-dost-title" title="Download">
                 <Download className="h-3.5 w-3.5" />
               </Button>
             </div>
           </>
        ) : (
           <span className="text-sm text-gray-400 italic">Not Uploaded</span>
        )}
      </div>
    </div>
  );
}

const PREBUILT_COMMENTS = [
  {
    key: 'missing_docs',
    text: 'Please upload all required documents.',
    short: 'Missing Docs',
  },
  {
    key: 'invalid_letter',
    text: 'The Request Letter to the Director is missing key details (dates or destination).',
    short: 'Invalid Letter',
  },
  {
    key: 'notarized_deed',
    text: 'The Deed of Undertaking must be notarized.',
    short: 'Notarize Deed',
  },
  {
    key: 'comaker_id',
    text: 'Please attach a valid ID for the Co-maker.',
    short: 'Co-maker ID',
  },
];

interface TravelClearanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: TravelRequestDetails; 
  onUpdate: () => void; 
}

export function TravelClearanceModal({
  isOpen,
  onClose,
  request,
  onUpdate
}: TravelClearanceModalProps) {
  const { scholarInfo, placementInfo, submissionInfo, travelDetails, files, purpose } = request;
  
  // Local state for immediate UI updates
  const [currentStatus, setCurrentStatus] = useState(submissionInfo.status);
  const [adminComment, setAdminComment] = useState(submissionInfo.adminComment || '');
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isResubmitOpen, setIsResubmitOpen] = useState(false);

  // Sync state when props change
  useEffect(() => {
    setCurrentStatus(submissionInfo.status);
    setAdminComment(submissionInfo.adminComment || '');
  }, [submissionInfo.status, submissionInfo.adminComment]);

  // Determine if the modal is in "Action Mode" or "Read-Only Mode"
  const isActionable = currentStatus === 'Pending' || 'Resubmit-Pending';

  const handleAddComment = (commentText: string) => {
    setAdminComment((prev) => {
      if (prev.trim() === '') return commentText;
      return `${prev}\n- ${commentText}`;
    });
  };

  const comment = (adminComment || '').toLowerCase();

  // --- SMART RESUBMIT LOGIC ---
  const hasKeyword = (keywords: string[]) => {
    return keywords.some((keyword) => {
      const safeKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${safeKeyword}\\b`, 'i'); 
      return regex.test(comment);
    });
  };

  const mentionsBoth = hasKeyword(['all', 'everything', 'documents']);

  // Document-specific flags (Check keyword AND ensure status is not Approved)
  const checkResubmit = (keywords: string[]) => 
    (mentionsBoth || hasKeyword(keywords)) && currentStatus !== 'Approved';

  // Define specific checks for Travel Clearance documents
  const showRequestLetterResubmit = checkResubmit(['letter', 'request letter', 'intent']);
  const showRequestFormResubmit = checkResubmit(['form', 'request form', 'application']);
  const showGuaranteeResubmit = checkResubmit(['guarantee', 'employer']);
  const showDeedResubmit = checkResubmit(['deed', 'undertaking', 'notarized']);
  const showEmploymentResubmit = checkResubmit(['employment', 'itr', 'income', 'compensation']);
  const showIdResubmit = checkResubmit(['id', 'valid id', 'identification']);

  // General blocker: If any specific file needs resubmit OR generic error words are found
  const hasResubmitRequest = (
    showRequestLetterResubmit || 
    showRequestFormResubmit || 
    showGuaranteeResubmit || 
    showDeedResubmit || 
    showEmploymentResubmit || 
    showIdResubmit ||
    hasKeyword(['resubmit', 'wrong', 'invalid', 'incorrect', 'missing', 'blur', 'unclear', 'mismatch', 'error'])
  ) && currentStatus !== 'Approved';

  const handleAttemptApprove = () => {
    if (hasResubmitRequest) {
      toast.error("Action Blocked", {
        description: "You cannot approve this request while the comment indicates issues. Please edit the comment or request resubmission."
      });
      return;
    }
    setIsApproveOpen(true);
  };

  const handleApprove = async () => {
    // Simulate API call
    toast.success('Travel Clearance Approved', { description: `${scholarInfo.name} has been notified.` });
    setCurrentStatus('Approved');
    onUpdate();
    setIsApproveOpen(false);
    onClose();
  };

  const handleResubmit = async () => {
    if (adminComment.trim() === '') {
      toast.error('Comment Required', { description: 'Please provide a comment before requesting resubmission.' });
      return;
    }
    
    // Simulate API call
    toast.warning('Resubmission Requested', { 
        description: `${scholarInfo.name} has been notified.`,
        className: "bg-yellow-50 border-yellow-200", 
    });
    
    setCurrentStatus('Resubmit');
    onUpdate();
    setIsResubmitOpen(false);
    // Keep modal open or close depending on preference, usually close
    onClose();
  };
  
  return (
    <>
      <Modal open={isOpen} onOpenChange={onClose}>
        <ModalContent size="4xl">
          <ModalHeader>
             <div className="flex items-center justify-between w-full pr-8">
                <div className="flex flex-col">
                   <ModalTitle>Travel Clearance Request</ModalTitle>
                   <p className="text-sm text-gray-500 font-normal mt-1">{purpose}</p>
                </div>  
             </div>
          </ModalHeader>

          <ModalBody className="max-h-[75vh] overflow-y-auto scrollbar-thin p-6 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              
              {/* LEFT COLUMN */}
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

                {/* 2. Travel & Request Details */}
                <section className="bg-white border rounded-lg shadow-sm p-5 space-y-3 flex-1 flex flex-col">
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Travel Details
                  </h2>
                  <div className="space-y-3 flex-1">
                    <InfoItem label="Destination" value={travelDetails.destination} />
                    <div className="grid grid-cols-2 gap-2">
                        <InfoItem label="Departure" value={formatDate(travelDetails.departureDate)} />
                        <InfoItem label="Return" value={formatDate(travelDetails.arrivalDate)} />
                    </div>
                    <InfoItem label="Duration" value={travelDetails.duration} />
                    
                    <div className="pt-2 border-t mt-2 grid grid-cols-2 gap-3">
                        <InfoItem label="Date Submitted" value={formatDate(submissionInfo.dateSubmitted)} />
                        <InfoItem label="Current Status" value={
                           <StatusBadge status={currentStatus} className="mt-1"/>
                        } />
                    </div>

                    {submissionInfo.delayReason && (
                        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md mt-3">
                            <div className="flex items-center gap-2 text-yellow-700 font-semibold text-xs uppercase mb-1">
                                <AlertTriangle className="h-3 w-3" />
                                Late Submission Reason
                            </div>
                            <p className="text-sm text-gray-800 italic">"{submissionInfo.delayReason}"</p>
                        </div>
                    )}
                  </div>
                </section>
              </div>

              {/* RIGHT COLUMN */}
              <div className="flex flex-col gap-6 h-full">
                
                {/* 3. Placement Information */}
                <section className="bg-white border rounded-lg shadow-sm p-5 space-y-3">
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Placement Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InfoItem label="Scholarship Type" value={placementInfo.scholarshipType} />
                    <InfoItem label="Batch / Year Awarded" value={placementInfo.batch} />
                    <InfoItem label="School / University" value={placementInfo.university} />
                    <InfoItem label="Program / Course" value={placementInfo.program} />
                  </div>
                </section>

                {/* 4. Submitted Documents */}
                <section className="bg-white border rounded-lg shadow-sm p-5 space-y-3 flex-1">
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Submitted Documents
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FileDisplay
                        label="Request Letter"
                        fileName={files.requestLetter}
                        needsResubmit={showRequestLetterResubmit}
                    />
                    <FileDisplay
                        label="Request Form"
                        fileName={files.requestForm}
                        needsResubmit={showRequestFormResubmit}
                    />

                    {purpose === 'Official Business Travel' && (
                        <FileDisplay
                            label="Guarantee Letter"
                            fileName={files.guaranteeLetter}
                            needsResubmit={showGuaranteeResubmit}
                        />
                    )}

                    {purpose === 'Other' && (
                        <>
                           <FileDisplay
                              label="Deed of Undertaking"
                              fileName={files.deedOfUndertaking}
                              needsResubmit={showDeedResubmit}
                           />
                           <FileDisplay
                              label="Employment/ITR"
                              fileName={files.coMakerEmployment}
                              needsResubmit={showEmploymentResubmit}
                           />
                           <FileDisplay
                              label="Co-Maker's ID"
                              fileName={files.coMakerId}
                              needsResubmit={showIdResubmit}
                           />
                        </>
                    )}
                  </div>
                </section>
              </div>
            </div>

            {/* Comments & Actions */}
            <section className="bg-white border rounded-lg shadow-sm p-5">
               <div className="space-y-2">
                  <Label htmlFor="admin-comment" className="block text-sm font-medium text-gray-700">
                    Admin Comments
                  </Label>
                  
                  {isActionable ? (
                    <>
                      <Textarea
                        id="admin-comment"
                        placeholder="Add comments, instructions for resubmission, or reason for rejection..."
                        className="min-h-[80px]"
                        value={adminComment}
                        onChange={(e) => setAdminComment(e.target.value)}
                      />
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {PREBUILT_COMMENTS.map((c) => (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            key={c.key}
                            onClick={() => handleAddComment(c.text)}
                            className="text-xs h-auto py-1 px-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                          >
                            <MessageSquarePlus className="h-3 w-3 mr-1.5" />
                            {c.short}
                          </Button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="p-3 bg-gray-50 border rounded-md min-h-[60px] text-sm text-gray-600 whitespace-pre-line">
                      {adminComment || <span className="text-gray-400 italic">No comments provided.</span>}
                    </div>
                  )}
                </div>
            </section>

          </ModalBody>

          <ModalFooter>
            <ModalClose asChild>
              <Button type="button" variant="outline">
                {isActionable ? 'Cancel' : 'Close'}
              </Button>
            </ModalClose>
            
            {/* ACTION BUTTONS: Only visible if status is Pending */}
            {isActionable && (
              <>
                <Button
                  type="button"
                  variant="primary"
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => setIsResubmitOpen(true)}
                >
                  REQUEST RESUBMISSION
                </Button>
                
                <Button
                  type="button"
                  variant="primary"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleAttemptApprove}
                >
                  APPROVE
                </Button>
              </>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={isApproveOpen}
        onClose={() => setIsApproveOpen(false)}
        onConfirm={handleApprove}
        title="Approve Travel Clearance"
        description={`Are you sure you want to approve the travel request for ${scholarInfo.name}?`}
        variant="info"
        confirmText="Yes, approve"
      />
      
      <ConfirmDialog
        isOpen={isResubmitOpen}
        onClose={() => setIsResubmitOpen(false)}
        onConfirm={handleResubmit}
        title="Request Resubmission"
        description={`Are you sure you want to request resubmission from ${scholarInfo.name}? Ensure the comments are clear.`}
        variant="danger"
        confirmText="Yes, request resubmission"
      />
    </>
  );
}