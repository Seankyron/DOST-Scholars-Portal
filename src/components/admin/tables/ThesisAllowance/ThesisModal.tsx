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
import { Download, MessageSquarePlus, FileText, BookOpen, CheckCircle2 } from 'lucide-react';
import { formatDate } from '@/lib/utils/date';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { toast } from '@/components/ui/toaster';
import type { ThesisRequestDetails } from '@/types/admin';

// --- Helper Components ---

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 uppercase">{label}</p>
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
    key: 'manuscript_corrupt',
    text: 'The Final Manuscript file cannot be opened. Please convert to PDF and re-upload.',
    short: 'Corrupt File',
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
  
  const [adminComment, setAdminComment] = useState(request.adminComment || '');
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isResubmitOpen, setIsResubmitOpen] = useState(false);

  const handleAddComment = (commentText: string) => {
    setAdminComment((prev: string) => {
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

  const comment = adminComment.toLowerCase();
  
  // Logic to determine icon and title based on percentage
  const getHeaderIcon = () => {
    if (percentage === 90) return <FileText className="h-5 w-5 text-blue-600" />;
    if (percentage === 10) return <BookOpen className="h-5 w-5 text-blue-600" />;
    return <CheckCircle2 className="h-5 w-5 text-blue-600" />;
  };

  const getReleaseTitle = () => {
    if (percentage === 90) return '90% Partial Release';
    if (percentage === 10) return '10% Final Release';
    return '100% Full Release';
  };

  return (
    <>
      <Modal open={isOpen} onOpenChange={onClose}>
        <ModalContent size="4xl">
          <ModalHeader>
             <div className="flex flex-col">
                <ModalTitle className="flex items-center gap-2">
                    {getHeaderIcon()}
                    Thesis Allowance Request
                </ModalTitle>
                <p className="text-sm text-gray-500 font-normal mt-1 ml-7">
                    {getReleaseTitle()}
                </p>
             </div>
          </ModalHeader>

          <ModalBody className="max-h-[70vh] overflow-y-auto scrollbar-thin p-6 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              
              {/* === COLUMN 1: SCHOLAR INFO === */}
              <div className="space-y-6">
                <section className="space-y-3">
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Scholar Information
                  </h2>
                  <InfoItem label="Full Name" value={scholarInfo.name} />
                  <InfoItem label="SPAS ID" value={scholarInfo.spas_id} />
                  <InfoItem label="Email" value={scholarInfo.email} />
                  <InfoItem label="Contact Number" value={scholarInfo.contactNumber} />
                </section>

                <section className="space-y-3">
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Request Details
                  </h2>
                  <InfoItem label="Transaction Type" value={`${percentage}% Release`} />
                  <InfoItem label="Date Submitted" value={formatDate(request.dateSubmitted)} />
                  <InfoItem label="Status" value={request.status} />
                </section>
              </div>

              {/* === COLUMN 2: PLACEMENT & DOCUMENTS === */}
              <div className="space-y-6">
                <section className="space-y-3">
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Year of Award and Study Placement
                  </h2>
                  <InfoItem label="Scholarship Type" value={scholarInfo.scholarshipType} />
                  <InfoItem label="Batch / Year Awarded" value={scholarInfo.yearAwarded} />
                  <InfoItem label="School / University" value={scholarInfo.university} />
                  <InfoItem label="Program / Course" value={scholarInfo.program} />
                </section>

                <section className="space-y-3">
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Submitted Documents
                  </h2>
                  
                  {/* --- Grid Layout for Documents --- */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {/* Always show Registration Form if available */}
                    <div className="lg:col-span-2">
                        <FileDisplay
                            label="Registration Form / COR"
                            fileName={registrationForm}
                            needsResubmit={comment.includes('registration') || comment.includes('cor')}
                        />
                    </div>

                    {/* 90% and 100% require Abstract & Approval */}
                    {(percentage === 90 || percentage === 100) && (
                        <>
                            <FileDisplay
                                label="One-Page Abstract"
                                fileName={abstract}
                                needsResubmit={comment.includes('abstract')}
                            />
                            <FileDisplay
                                label="Signed Approval Sheet"
                                fileName={approvalSheet}
                                needsResubmit={comment.includes('approval') || comment.includes('signature')}
                            />
                        </>
                    )}

                    {/* 10% and 100% require Final Manuscript */}
                    {(percentage === 10 || percentage === 100) && (
                        <div className="lg:col-span-2">
                            <FileDisplay
                                label="Final Thesis Manuscript"
                                fileName={finalManuscript}
                                needsResubmit={comment.includes('manuscript')}
                            />
                        </div>
                    )}
                  </div>
                </section>
              </div>
            </div>

            {/* --- Comments & Actions (Full Width) --- */}
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
              onClick={() => setIsResubmitOpen(true)}
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