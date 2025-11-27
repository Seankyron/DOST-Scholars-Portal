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
import { Download, MessageSquarePlus, AlertTriangle } from 'lucide-react';
import { formatDate } from '@/lib/utils/date';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { toast } from '@/components/ui/toaster';
import { StatusBadge } from '@/components/shared/StatusBadge'; 
import type { ShiftingRequestDetails } from './ShiftingTransferringTable';

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      {/* Change this from <p> to <div> */}
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
               <Button variant="ghost" size="sm" className="w-7 h-7 p-0 text-gray-500 hover:text-dost-title" title="View">
               </Button>
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
    key: 'missing_docs',
    text: 'Please upload all required documents.',
    short: 'Missing Docs',
  },
  {
    key: 'invalid_grades',
    text: 'The Certification of Grades is incomplete or blurred.',
    short: 'Invalid Grades',
  },
  {
    key: 'program_mismatch',
    text: 'The new program is not within the priority science and technology courses.',
    short: 'Program Invalid',
  },
  {
    key: 'missing_admission',
    text: 'Please provide proof of admission to the new university.',
    short: 'Missing Admission',
  },
];

interface ShiftingModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: ShiftingRequestDetails; 
  onUpdate: () => void; 
}

export function ShiftingTransferringModal({
  isOpen,
  onClose,
  request,
  onUpdate
}: ShiftingModalProps) {
  const { scholarInfo, currentPlacement, newPlacement, submissionInfo, files, applicationType } = request;
  
  const [adminComment, setAdminComment] = useState(submissionInfo.adminComment || '');
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isResubmitOpen, setIsResubmitOpen] = useState(false);

  const handleAddComment = (commentText: string) => {
    setAdminComment((prev) => {
      if (prev.trim() === '') return commentText;
      return `${prev}\n- ${commentText}`;
    });
  };

  const handleApprove = async () => {
    toast.success('Application Approved', { description: `${scholarInfo.name} has been notified.` });
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
  
  return (
    <>
      <Modal open={isOpen} onOpenChange={onClose}>
        <ModalContent size="4xl">
          <ModalHeader>
             <div className="flex items-center justify-between w-full pr-8">
                <div className="flex flex-col">
                   <ModalTitle>Shifting & Transferring Request</ModalTitle>
                   <p className="text-sm text-gray-500 font-normal mt-1">{applicationType}</p>
                </div>  
             </div>
          </ModalHeader>

          <ModalBody className="max-h-[70vh] overflow-y-auto scrollbar-thin p-6 space-y-6">
            
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

                {/* 2. Application & Status Details */}
                <section className="bg-white border rounded-lg shadow-sm p-5 space-y-3 flex-1 flex flex-col">
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Application Details
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InfoItem label="Effectivity" value={newPlacement.effectivity} />
                    <InfoItem label="New Duration" value={newPlacement.duration} />
                    <InfoItem label="Date Submitted" value={formatDate(submissionInfo.dateSubmitted)} />
                    <InfoItem label="Current Status" value={
                        <StatusBadge status={submissionInfo.status} className="mt-1"/>
                    } />
                  </div>
                  
                  {/* Proposed Changes Section */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                     <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Proposed Changes</p>
                     <div className="bg-blue-50 border border-blue-100 p-3 rounded-md space-y-2">
                        {newPlacement.university && (
                            <InfoItem label="New University" value={newPlacement.university} />
                        )}
                        {newPlacement.program && (
                            <InfoItem label="New Program" value={newPlacement.program} />
                        )}
                     </div>
                  </div>

                  <div className="mt-2">
                     <InfoItem label="Reason for Application" value={
                        <p className="font-normal italic text-gray-700">{submissionInfo.reason}</p>
                     } />
                  </div>
                  
                </section>
              </div>

              {/* RIGHT COLUMN */}
              <div className="flex flex-col gap-6 h-full">
                
                {/* 3. Current Placement Information */}
                <section className="bg-white border rounded-lg shadow-sm p-5 space-y-3">
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Current Placement
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InfoItem label="Scholarship Type" value={currentPlacement.scholarshipType} />
                    <InfoItem label="Batch / Year Awarded" value={currentPlacement.batch} />
                    <InfoItem label="University" value={currentPlacement.university} />
                    <InfoItem label="Program" value={currentPlacement.program} />
                 </div>
                </section>

                {/* 4. Submitted Documents */}
                <section className="bg-white border rounded-lg shadow-sm p-5 space-y-3 flex-1">
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Submitted Documents
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FileDisplay
                        label="Application Form"
                        fileName={files.applicationForm}
                        needsResubmit={comment.includes('form')}
                    />
                    <FileDisplay
                        label="Cert. of Admission"
                        fileName={files.certificationAdmission}
                        needsResubmit={comment.includes('admission')}
                    />
                     <FileDisplay
                        label="Cert. of Grades"
                        fileName={files.certificationGrades}
                        needsResubmit={comment.includes('grades')}
                    />
                    <FileDisplay
                        label="Approved Program"
                        fileName={files.approvedProgram}
                        needsResubmit={comment.includes('program')}
                    />
                    <FileDisplay
                        label="Cert. of Year Level"
                        fileName={files.certificationYearLevel}
                        needsResubmit={comment.includes('year level')}
                    />
                    <FileDisplay
                        label="Cert. Accredited Subj."
                        fileName={files.certificationAccredited}
                        needsResubmit={comment.includes('accredited')}
                    />
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

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={isApproveOpen}
        onClose={() => setIsApproveOpen(false)}
        onConfirm={handleApprove}
        title="Approve Application"
        description={`Are you sure you want to approve the shifting/transferring request for ${scholarInfo.name}?`}
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