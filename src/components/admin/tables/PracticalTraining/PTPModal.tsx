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
import { Download, MessageSquarePlus} from 'lucide-react';
import { formatDate } from '@/lib/utils/date';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { toast } from '@/components/ui/toaster';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PTPPlan } from '@/types/services';
import type { PTPRequestDetails } from '@/types/admin';
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
        {/* Red Indicator Label */}
        {needsResubmit && (
          <span className="text-[10px] font-medium text-red-600 flex-shrink-0 ml-2">To Resubmit</span>
        )}
      </div>
      {/* Dynamic Styling based on needsResubmit */}
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

const formatPTPPlan = (plan?: PTPPlan) => {
  switch (plan) {
    case 'undertake_ptp':
      return 'I will undertake the Required PTP in the Mid-Year Term.';
    case 'cannot_participate':
      return 'I cannot participate in the PTP this Mid-Year Term.';
    case 'ojt_midyear_and_ptp':
      return 'My OJT/Practicum is included in the curriculum.';
    default:
      return 'N/A';
  }
};

const PREBUILT_COMMENTS = [
  {
    key: 'dtr_unsigned',
    text: 'Daily Time Record (DTR) is not signed by the supervisor. Please upload the signed copy.',
    short: 'Unsigned DTR',
  },
  {
    key: 'grades_incomplete',
    text: 'Certified Grades are incomplete. Please ensure all semesters are included.',
    short: 'Incomplete Grades',
  },
  {
    key: 'reply_slip_missing',
    text: 'Reply slip is missing or not filled out correctly.',
    short: 'Invalid Reply Slip',
  },
  {
    key: 'form126_incorrect',
    text: 'Form 126 is incomplete or incorrect. Please review the details.',
    short: 'Form 126 Issue',
  },
  {
    key: 'cert_wrong',
    text: 'Incorrect Certificate of Completion uploaded.',
    short: 'Wrong Certificate',
  },
];

interface PTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: PTPRequestDetails;
  onUpdate: () => void;
}

export function PTPModal({
  isOpen,
  onClose,
  request,
  onUpdate
}: PTPModalProps) {
  const { scholarInfo, placementInfo, submissionInfo, files } = request;

  // Local state to handle immediate updates
  const [currentStatus, setCurrentStatus] = useState(submissionInfo.status);
  const [adminComment, setAdminComment] = useState(submissionInfo.adminComment || '');
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isResubmitOpen, setIsResubmitOpen] = useState(false);

  // Sync local state when the prop changes (e.g. after reopen)
  useEffect(() => {
    setCurrentStatus(submissionInfo.status);
    setAdminComment(submissionInfo.adminComment || '');
  }, [submissionInfo.status, submissionInfo.adminComment]);

  const isActionable = currentStatus === 'Pending';

  const handleAddComment = (commentText: string) => {
    setAdminComment((prev) => {
      if (prev.trim() === '') return commentText;
      return `${prev}\n- ${commentText}`;
    });
  };

  // --- LOGIC FOR RESUBMISSION DETECTION ---
  
  const comment = (adminComment || '').toLowerCase(); // Ensure safe string

  const hasKeyword = (keywords: string[]) => {
    return keywords.some((keyword) => {
      const safeKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${safeKeyword}\\b`, 'i'); 
      return regex.test(comment);
    });
  };

  const mentionsBoth = hasKeyword(['both', 'all', 'everything']);

  // Specific Document Logic
  const showGradesResubmit = ( mentionsBoth || hasKeyword(['grade', 'grades', 'cog', 'scholastic', 'rating'])) && currentStatus !== 'Approved';
  const showReplyResubmit = ( mentionsBoth || hasKeyword(['reply', 'slip', 'acceptance'])) && currentStatus !== 'Approved';
  
  const showForm126Resubmit = ( mentionsBoth || hasKeyword(['126', 'form 126', 'form-126', 'proposal'])) && currentStatus !== 'Approved';
  const showForm127Resubmit = ( mentionsBoth || hasKeyword(['127', 'form 127', 'form-127'])) && currentStatus !== 'Approved';
  const showForm128Resubmit = ( mentionsBoth || hasKeyword(['128', 'form 128', 'form-128', 'evaluation'])) && currentStatus !== 'Approved';
  
  const showDtrResubmit = ( mentionsBoth || hasKeyword(['dtr', 'time', 'daily', 'hours', 'attendance'])) && currentStatus !== 'Approved';
  const showCertResubmit = ( mentionsBoth || hasKeyword(['cert', 'certificate', 'completion', 'coc'])) && currentStatus !== 'Approved';

  // General Blocker Logic (prevents approving if issues are mentioned)
  const hasResubmitRequest = (
    showGradesResubmit || showReplyResubmit ||
    showForm126Resubmit || showForm127Resubmit || showForm128Resubmit ||
    showDtrResubmit || showCertResubmit ||
    hasKeyword(['resubmit', 'wrong', 'invalid', 'incorrect', 'missing', 'blur', 'unclear', 'mismatch', 'error'])
  );

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
    try {
      const { error: updateError } = await supabase
        .from('PTP Submission')
        .update({ status: "Approved", comment: adminComment })
        .eq('id', parseInt(request.id));

      if (updateError) throw new Error(updateError.message);
      
      toast.success('Request Approved', { description: `${scholarInfo.name} has been notified.` });

      setCurrentStatus('Approved');
      onUpdate();
      setIsApproveOpen(false);
      onClose();
    } catch (e: any) {
      console.error('Update failed:', e);
      toast.error('Update Failed', { description: e.message });
    }
  };

  const handleResubmit = async () => {
    if (adminComment.trim() === '') {
      toast.error('Comment Required', { description: 'Please provide a comment before requesting resubmission.' });
      return;
    }
    try {
      const { error: updateError } = await supabase
        .from('PTP Submission')
        .update({
          status: "Resubmit",
          comment: adminComment,
        })
        .eq('id', parseInt(request.id));

      if (updateError) throw new Error(updateError.message);

      toast.warning('Resubmission Requested', { 
        description: `${scholarInfo.name} has been notified.`,
        className: "bg-yellow-50 border-yellow-200", 
      });

      setCurrentStatus('Resubmit');
      onUpdate();
      setIsResubmitOpen(false);
      // We keep the modal open intentionally
    } catch (e: any) {
      console.error('Update failed:', e);
      toast.error('Update Failed', { description: e.message });
    }
  };

  return (
    <>
      <Modal open={isOpen} onOpenChange={onClose}>
        <ModalContent size="4xl">
          <ModalHeader>
            <div className="flex items-center justify-between w-full pr-8">
              <div className="flex flex-col">
                <ModalTitle>Practical Training Request</ModalTitle>
                <p className="text-sm text-gray-500 font-normal mt-1">{request.type}</p>
              </div>
            </div>
          </ModalHeader>

          <ModalBody className="max-h-[70vh] overflow-y-auto scrollbar-thin p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">

              {/* --- LEFT COLUMN --- */}
              <div className="flex flex-col gap-6 h-full">
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

                <section className="bg-white border rounded-lg shadow-sm p-5 space-y-3 flex-1 flex flex-col">
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Request Details
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InfoItem label="Transaction Type" value={request.type} />
                    <InfoItem label="Academic Term" value={`${submissionInfo.semester}, ${submissionInfo.academicYear}`} />
                    <InfoItem label="Date Submitted" value={formatDate(submissionInfo.dateSubmitted)} />

                    <InfoItem label="Current Status" value={
                      <StatusBadge status={currentStatus} className="mt-1" />
                    } />

                    {request.type === 'Referral Letter' && (
                      <div className="col-span-1 sm:col-span-2 mt-2 pt-4 border-t border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Selected Plan</p>
                        <div className="bg-blue-50 border border-blue-100 p-3 rounded-md">
                          <p className="text-sm text-gray-800 font-medium">
                            {formatPTPPlan(submissionInfo.plan)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              </div>

              {/* --- RIGHT COLUMN --- */}
              <div className="flex flex-col gap-6 h-full">
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

                <section className="bg-white border rounded-lg shadow-sm p-5 space-y-3 flex-1 flex flex-col">
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Submitted Documents
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Logic for specific file display based on Request Type */}
                    {request.type === 'Referral Letter' ? (
                      <>
                        <FileDisplay 
                            label="Certified Grades" 
                            fileName={files.grades} 
                            needsResubmit={showGradesResubmit} 
                        />
                        <FileDisplay 
                            label="Reply Slip" 
                            fileName={files.replySlip} 
                            needsResubmit={showReplyResubmit} 
                        />
                        <FileDisplay 
                            label="Curriculum Checklist" 
                            fileName={files.curriculum} 
                            needsResubmit={false} // Typically curriculum isn't resubmitted alone, but logic can be added
                        />
                      </>
                    ) : (
                      <>
                        <FileDisplay 
                            label="Form 126" 
                            fileName={files.form126} 
                            needsResubmit={showForm126Resubmit} 
                        />
                        <FileDisplay 
                            label="Form 127" 
                            fileName={files.form127} 
                            needsResubmit={showForm127Resubmit} 
                        />
                        <FileDisplay 
                            label="Form 128" 
                            fileName={files.form128} 
                            needsResubmit={showForm128Resubmit} 
                        />
                        <FileDisplay 
                            label="Daily Time Record" 
                            fileName={files.dtr} 
                            needsResubmit={showDtrResubmit} 
                        />
                        <FileDisplay 
                            label="Cert. of Completion" 
                            fileName={files.certCompletion}
                            needsResubmit={showCertResubmit} 
                        />
                      </>
                    )}
                  </div>
                </section>
              </div>
            </div>

            {/* --- ADMIN COMMENTS --- */}
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
                <Button type="button" variant="primary" className="bg-red-600 hover:bg-red-700" onClick={() => setIsResubmitOpen(true)}>
                  REQUEST RESUBMISSION
                </Button>
                <Button type="button" variant="primary" className="bg-green-600 hover:bg-green-700" onClick={handleAttemptApprove}>
                  APPROVE
                </Button>
              </>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      <ConfirmDialog
        isOpen={isApproveOpen}
        onClose={() => setIsApproveOpen(false)}
        onConfirm={handleApprove}
        title="Approve Practical Training Request"
        description={`Are you sure you want to approve this request from ${scholarInfo.name}?`}
        variant="info"
        confirmText="Yes, approve"
      />

      <ConfirmDialog
        isOpen={isResubmitOpen}
        onClose={() => setIsResubmitOpen(false)}
        onConfirm={handleResubmit}
        title="Request Resubmission"
        description={`Are you sure you want to request resubmission from ${scholarInfo.name}? Ensure the comments clearly state what needs to be fixed.`}
        variant="danger"
        confirmText="Yes, request resubmission"
      />
    </>
  );
}