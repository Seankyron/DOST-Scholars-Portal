'use client';

import { useState } from 'react';
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
import { Download, MessageSquarePlus, Radio } from 'lucide-react';
import { formatDate } from '@/lib/utils/date';
import type { PTPRequestDetails } from './PTPTable'; 
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { toast } from '@/components/ui/toaster';
import { PTPPlan } from '@/types/services';

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value || 'N/A'}</p>
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
        <Label className="text-sm font-medium text-gray-700 truncate" title={label}>{label}</Label>
        {needsResubmit && (
          <span className="text-xs font-medium text-red-600 flex-shrink-0 ml-2">To Resubmit</span>
        )}
      </div>
      <div className="flex items-center justify-between p-3 pl-4 border rounded-lg bg-gray-50">
        {fileName ? (
           <>
             <span className="text-sm font-medium text-gray-800 truncate" title={fileName}>{fileName}</span>
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
      return 'I will undertake the Required Practical Training Program (PTP) in the Mid-Year Term.';
    case 'cannot_participate':
      return 'I cannot participate in the PTP this Mid-Year Term.';
    case 'ojt_midyear_and_ptp':
      return 'My OJT/Practicum is included in the curriculum for the Mid-Year Term.';
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
  
  const [adminComment, setAdminComment] = useState(submissionInfo.adminComment || '');
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isResubmitOpen, setIsResubmitOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  const handleAddComment = (commentText: string) => {
    setAdminComment((prev) => {
      if (prev.trim() === '') return commentText;
      return `${prev}\n- ${commentText}`;
    });
  };

  const handleApprove = async () => {
    toast.success('Request Approved', { description: `${scholarInfo.name} has been notified.` });
    onUpdate();
    setIsApproveOpen(false);
    onClose();
  };

  const handleResubmit = async () => {
    if (adminComment.trim() === '') {
      toast.error('Please provide a comment before requesting resubmission.');
      return;
    }
    toast.warning('Resubmission Requested', { description: `${scholarInfo.name} has been notified.` });
    onUpdate();
    setIsResubmitOpen(false);
    onClose();
  };
  
  const handleReject = async () => {
    if (adminComment.trim() === '') {
       toast.error('Please provide a reason for rejection.');
       return;
    }
    toast.error('Request Rejected', { description: `${scholarInfo.name} has been notified.` });
    onUpdate();
    setIsRejectOpen(false);
    onClose();
  }

  const comment = adminComment.toLowerCase();
  
  return (
    <>
      <Modal open={isOpen} onOpenChange={onClose}>
        <ModalContent size="4xl">
          <ModalHeader>
             <div className="flex flex-col">
                <ModalTitle>Practical Training Request</ModalTitle>
                <p className="text-sm text-gray-500 font-normal mt-1">{request.type}</p>
             </div>
          </ModalHeader>

          <ModalBody className="max-h-[70vh] overflow-y-auto scrollbar-thin p-6 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              
              {/* === COLUMN 1 === */}
              <div className="space-y-6">
                <section className="space-y-3">
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Scholar Information
                  </h2>
                  <InfoItem label="Name" value={scholarInfo.name} />
                  <InfoItem label="Contact Number" value={scholarInfo.contactNumber} />
                  <InfoItem label="Date of Birth" value={scholarInfo.dateOfBirth} />
                  <InfoItem label="Complete Address" value={scholarInfo.completeAddress} />
                </section>

                <section className="space-y-3">
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Request Details
                  </h2>
                  <InfoItem label="Transaction Type" value={request.type} />
                  <InfoItem label="Training Year" value={submissionInfo.trainingYear} />
                  <InfoItem label="Date Submitted" value={formatDate(submissionInfo.dateSubmitted)} />
                </section>

                {/* --- PLAN SELECTION (Only for Referral Letter) --- */}
                {request.type === 'Referral Letter' && (
                  <section className="space-y-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <h2 className="text-sm font-semibold text-dost-title flex items-center gap-2">
                      <Radio className="h-4 w-4" />
                      Selected Plan Option
                    </h2>
                    <p className="text-sm text-gray-800 font-medium pl-6">
                      {formatPTPPlan(submissionInfo.plan)}
                    </p>
                  </section>
                )}
              </div>

              {/* === COLUMN 2 === */}
              <div className="space-y-6">
                <section className="space-y-3">
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Placement Information
                  </h2>
                  <InfoItem label="Scholarship Type" value={placementInfo.scholarshipType} />
                  <InfoItem label="Batch / Year Awarded" value={placementInfo.batch} />
                  <InfoItem label="University" value={placementInfo.university} />
                  <InfoItem label="Program" value={placementInfo.program} />
                </section>

                {/* --- DYNAMIC DOCUMENTS SECTION --- */}
                <section className="space-y-3">
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Submitted Documents
                  </h2>
                  
                  {/* --- UPDATED: Grid Layout for Documents --- */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {request.type === 'Referral Letter' ? (
                       <>
                          <FileDisplay
                             label="Certified Grades"
                             fileName={files.grades}
                             needsResubmit={comment.includes('grades')}
                          />
                          <FileDisplay
                             label="Reply Slip"
                             fileName={files.replySlip}
                             needsResubmit={comment.includes('reply')}
                          />
                          <FileDisplay
                             label="Curriculum Checklist"
                             fileName={files.curriculum}
                          />
                       </>
                    ) : (
                       <>
                          <FileDisplay
                             label="Form 126"
                             fileName={files.form126}
                             needsResubmit={comment.includes('126')}
                          />
                          <FileDisplay
                             label="Form 127"
                             fileName={files.form127}
                             needsResubmit={comment.includes('127')}
                          />
                          <FileDisplay
                             label="Form 128"
                             fileName={files.form128}
                             needsResubmit={comment.includes('128')}
                          />
                          <FileDisplay
                             label="Daily Time Record"
                             fileName={files.dtr}
                             needsResubmit={comment.includes('dtr')}
                          />
                          <FileDisplay
                             label="Cert. of Completion"
                             fileName={files.certCompletion}
                             needsResubmit={comment.includes('cert')}
                          />
                       </>
                    )}
                  </div>
                </section>
              </div>
            </div>

            {/* --- FULL WIDTH SECTION (Comments & Actions) --- */}
            <section className="pt-4 border-t">
               <div className="space-y-2">
                  <Label htmlFor="admin-comment" className="block text-sm font-medium text-gray-700">
                    Admin Comments
                  </Label>
                  <Textarea
                    id="admin-comment"
                    placeholder="Add comments, instructions for resubmission, or reason for rejection..."
                    className="min-h-[100px]"
                    value={adminComment}
                    onChange={(e) => setAdminComment(e.target.value)}
                  />
                  <div className="flex flex-wrap gap-1.5">
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
                </div>
            </section>

          </ModalBody>

          <ModalFooter>
            <ModalClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </ModalClose>
            <Button
              type="button"
              variant="primary"
              className="bg-red-600 hover:bg-red-700"
              onClick={() => setIsResubmitOpen(true)} // <-- MODIFIED
            >
              REQUEST RESUBMISSION
            </Button>
            <Button
              type="button"
              variant="primary"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => setIsApproveOpen(true)}
            >
              APPROVE
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* --- ADDED: Confirmation Dialogs --- */}
      <ConfirmDialog
        isOpen={isApproveOpen}
        onClose={() => setIsApproveOpen(false)}
        onConfirm={handleApprove}
        title="Approve Submission"
        description={`Are you sure you want to approve this submission for ${scholarInfo.name}?`}
        variant="info"
        confirmText="Yes, approve"
      />
      
      <ConfirmDialog
        isOpen={isResubmitOpen}
        onClose={() => setIsResubmitOpen(false)}
        onConfirm={handleResubmit}
        title="Request Resubmission"
        description={`Are you sure you want to request resubmission from ${scholarInfo.name}? Make sure you have added a clear comment.`}
        variant="danger"
        confirmText="Yes, request resubmission"
      />
    </>
  );
}