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
import { Download, MessageSquarePlus } from 'lucide-react';
import { formatDate } from '@/lib/utils/date';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { toast } from '@/components/ui/toaster';
import { StatusBadge } from '@/components/shared/StatusBadge';
import type { ThesisRequestDetails } from '@/types/admin';
import { supabase } from '@/lib/supabase/client';

// --- Helper Components ---

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-800 break-words">{value || 'N/A'}</p>
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
          <span className="text-[10px] font-medium text-red-600 flex-shrink-0 ml-2">To Resubmit</span>
        )}
      </div>
      <div className={`flex items-center justify-between p-3 pl-4 border rounded-lg transition-colors ${needsResubmit ? 'bg-red-50 border-red-200' : 'bg-gray-50'}`}>
        {fileName ? (
           <>
             <span className={`text-sm font-medium truncate ${needsResubmit ? 'text-red-700' : 'text-gray-800'}`} title={fileName}>
                {fileName}
             </span>
             <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
               <Button variant="ghost" size="sm" className="w-7 h-7 p-0 text-gray-500 hover:text-dost-title" title="Download">
                 <Download className="h-4 w-4" />
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
    key: 'sig_missing',
    text: 'Document is missing required signatures from the adviser or school officials.',
    short: 'Missing Signature',
  },
  {
    key: 'abstract_incomplete',
    text: 'Abstract is incomplete. Please ensure Title, Rationale, Objectives, and Methodology are present.',
    short: 'Incomplete Abstract',
  },
  {
    key: 'cor_invalid',
    text: 'The Registration Form/COR is for the wrong semester or is invalid.',
    short: 'Invalid COR',
  },
  {
    key: 'manuscript_issue',
    text: 'The Final Manuscript file cannot be opened or is incomplete. Please convert to PDF and re-upload.',
    short: 'Manuscript Issue',
  },
];

interface ThesisModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: ThesisRequestDetails; 
  onUpdate: () => void; 
}

export function ThesisModal({
  isOpen,
  onClose,
  request,
  onUpdate
}: ThesisModalProps) {
  const { scholarInfo, percentage, abstract, approvalSheet, finalManuscript, registrationForm } = request;
  
  // Local state to handle immediate updates
  const [currentStatus, setCurrentStatus] = useState(request.status);
  const [adminComment, setAdminComment] = useState(request.adminComment || '');
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isResubmitOpen, setIsResubmitOpen] = useState(false);

  // Sync local state on prop change
  useEffect(() => {
    setCurrentStatus(request.status);
    setAdminComment(request.adminComment || '');
  }, [request.status, request.adminComment]);

  const isActionable = currentStatus === 'Pending';

  const handleAddComment = (commentText: string) => {
    setAdminComment((prev: string) => {
      if (prev.trim() === '') return commentText;
      return `${prev}\n- ${commentText}`;
    });
  };

  // --- LOGIC FOR RESUBMISSION DETECTION ---
  const comment = (adminComment || '').toLowerCase();

  const hasKeyword = (keywords: string[]) => {
    return keywords.some((keyword) => {
      const safeKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${safeKeyword}\\b`, 'i'); 
      return regex.test(comment);
    });
  };

  const mentionsBoth = hasKeyword(['both', 'all', 'everything']);

  // Specific File Logic
  const showAbstractResubmit = (mentionsBoth || hasKeyword(['abstract', 'summary', 'rationale'])) && currentStatus !== 'Approved';
  const showApprovalResubmit = (mentionsBoth || hasKeyword(['approval', 'sheet', 'sign', 'signature', 'adviser'])) && currentStatus !== 'Approved';
  const showManuscriptResubmit = (mentionsBoth || hasKeyword(['manuscript', 'final', 'paper', 'thesis', 'book'])) && currentStatus !== 'Approved';
  const showCorResubmit = (mentionsBoth || hasKeyword(['cor', 'registration', 'enrollment', 'load'])) && currentStatus !== 'Approved';

  // General Blocker Logic
  const hasResubmitRequest = (
    showAbstractResubmit || showApprovalResubmit || showManuscriptResubmit || showCorResubmit ||
    hasKeyword(['resubmit', 'wrong', 'invalid', 'incorrect', 'missing', 'blur', 'unclear', 'error', 'corrupt'])
  );

  const getReleaseTitle = () => {
    if (percentage === 90) return '90% Partial Release';
    if (percentage === 10) return '10% Final Release';
    return '100% Full Release';
  };

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
      try{
          const { error: updateError } = await supabase
                .from('Thesis Allowance')
                .update({
                  status: "Approved",
                  comment: adminComment // Save comment even on approve if exists
                })
                .eq('id', parseInt(request.id));
        
                if(updateError) throw new Error(updateError.message);
                
                toast.success('Request Approved', { description: `${scholarInfo.name} has been notified.` });
                
                setCurrentStatus('Approved');
                onUpdate();
                setIsApproveOpen(false);
                onClose();
        }catch(e: any){
            console.error('Update failed:', e);
            toast.error('Update Failed', { description: e.message });
        }
  };

  const handleResubmit = async () => {
     if (adminComment.trim() === '') {
          toast.error('Comment Required', { description: 'Please provide a comment before requesting resubmission.' });
          return;
        }
        try{
          const { error: updateError } = await supabase
                .from('Thesis Allowance')
                .update({
                  status: "Resubmit",
                  comment: adminComment,
                })
                .eq('id', parseInt(request.id));
        
                if(updateError) throw new Error(updateError.message);
        
          toast.warning('Resubmission Requested', { 
            description: `${scholarInfo.name} has been notified.`,
            className: "bg-yellow-50 border-yellow-200"
          });

          setCurrentStatus('Resubmit');
          onUpdate();
          setIsResubmitOpen(false);
          // Keep modal open so admin can review
        }catch(e: any){
            console.error('Update failed:', e);
            toast.error('Update Failed', { description: e.message });
        }
  };

  return (
    <>
      <Modal open={isOpen} onOpenChange={onClose}>
        <ModalContent size="4xl" className="w-[95%] sm:w-full">
          <ModalHeader>
             <div className="flex items-center justify-between w-full pr-8">
                <div className="flex flex-col">
                   <ModalTitle>Thesis Allowance Request</ModalTitle>
                   <p className="text-sm text-gray-500 font-normal mt-1">{getReleaseTitle()}</p>
                </div>  
             </div>
          </ModalHeader>

          <ModalBody className="max-h-[70vh] overflow-y-auto scrollbar-thin p-6 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              
              {/* === COLUMN 1: Scholar Info & Request Details === */}
              <div className="flex flex-col gap-6 h-full">
                <section className="bg-white border rounded-lg shadow-sm p-5 space-y-3">
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Scholar Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InfoItem label="Name" value={scholarInfo.name} />
                    <InfoItem label="SPAS ID" value={scholarInfo.spas_id} />
                    <InfoItem label="Email" value={scholarInfo.email} />
                    <InfoItem label="Contact Number" value={scholarInfo.contactNumber} />
                  </div>
                </section>

                <section className="bg-white border rounded-lg shadow-sm p-5 space-y-3 flex-1 flex flex-col">
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Request Details
                  </h2>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InfoItem label="Transaction Type" value={`${percentage}% Release`} />
                    <InfoItem label="Academic Term" value={`${request.semester}, ${request.academicYear}`} />
                    <InfoItem label="Year Level" value={request.yearLevel} />
                    <InfoItem label="Date Submitted" value={formatDate(request.dateSubmitted)} />
                    <InfoItem label="Current Status" value={
                        <StatusBadge status={currentStatus} className="mt-1"/>
                    } />
                  </div>
                </section>
              </div>

              {/* === COLUMN 2: Placement & Documents === */}
              <div className="flex flex-col gap-6 h-full">
                <section className="bg-white border rounded-lg shadow-sm p-5 space-y-3">
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Placement Information
                  </h2>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InfoItem label="Scholarship Type" value={scholarInfo.scholarshipType} />
                    <InfoItem label="Batch / Year Awarded" value={scholarInfo.yearAwarded} />
                    <InfoItem label="School / University" value={scholarInfo.university} />
                    <InfoItem label="Program / Course" value={scholarInfo.program} />
                  </div>
                </section>

                <section className="bg-white border rounded-lg shadow-sm p-5 space-y-3 flex-1 flex flex-col">
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Submitted Documents
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Always show Registration Form */}
                    <FileDisplay
                        label="Registration Form / COR"
                        fileName={registrationForm}
                        needsResubmit={showCorResubmit}
                    />

                    {/* 90% and 100% require Abstract & Approval */}
                    {(percentage === 90 || percentage === 100) && (
                        <>
                            <FileDisplay
                                label="One-Page Abstract"
                                fileName={abstract}
                                needsResubmit={showAbstractResubmit}
                            />
                            <FileDisplay
                                label="Signed Approval Sheet"
                                fileName={approvalSheet}
                                needsResubmit={showApprovalResubmit}
                            />
                        </>
                    )}

                    {/* 10% and 100% require Final Manuscript */}
                    {(percentage === 10 || percentage === 100) && (
                        <FileDisplay
                            label="Final Thesis Manuscript"
                            fileName={finalManuscript}
                            needsResubmit={showManuscriptResubmit}
                        />
                    )}
                  </div>
                </section>
              </div>
            </div>

            {/* --- Comments & Actions (Full Width) --- */}
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
                        className="min-h-[100px]"
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

      {/* --- Confirmation Dialogs --- */}
      <ConfirmDialog
        isOpen={isApproveOpen}
        onClose={() => setIsApproveOpen(false)}
        onConfirm={handleApprove}
        title="Approve Thesis Allowance"
        description={`Are you sure you want to approve this ${percentage}% release for ${scholarInfo.name}?`}
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