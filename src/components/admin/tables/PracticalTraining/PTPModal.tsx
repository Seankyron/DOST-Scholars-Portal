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
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { toast } from '@/components/ui/toaster';
import { StatusBadge } from '@/components/shared/StatusBadge'; 
import { PTPPlan } from '@/types/services';
import type { PTPRequestDetails } from '@/types/admin';
import {supabase} from '@/lib/supabase/client'

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
    
    try{
      const { error: updateError } = await supabase
            .from('PTP Submission')
            .update({
              status: "Approved",
            })
            .eq('id', parseInt(request.id));
    
            if(updateError) throw new Error(updateError.message);
            toast.success('Request Approved', { description: `${scholarInfo.name} has been notified.` });
    }catch(e: any){
        console.error('Update failed:', e);
        toast.error('Update Failed', { description: e.message });
    }finally{
        onUpdate();
        setIsResubmitOpen(false);
        onClose();
    }
  };

  const handleResubmit = async () => {
    if (adminComment.trim() === '') {
      toast.error('Please provide a comment before requesting resubmission.');
      return;
    }
    try{
      const { error: updateError } = await supabase
            .from('PTP Submission')
            .update({
              status: "Resubmit",
              comment: adminComment,
            })
            .eq('id', parseInt(request.id));
    
            if(updateError) throw new Error(updateError.message);
    
      toast.warning('Resubmission Requested', { description: `${scholarInfo.name} has been notified.` });
    }catch(e: any){
        console.error('Update failed:', e);
        toast.error('Update Failed', { description: e.message });
    }finally{
        onUpdate();
        setIsResubmitOpen(false);
        onClose();
    }
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
             <div className="flex items-center justify-between w-full pr-8">
                <div className="flex flex-col">
                   <ModalTitle>Practical Training Request</ModalTitle>
                   <p className="text-sm text-gray-500 font-normal mt-1">{request.type}</p>
                </div>  
             </div>
          </ModalHeader>

          <ModalBody className="max-h-[70vh] overflow-y-auto scrollbar-thin p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              
              <div className="flex flex-col gap-6 h-full">
                <section className="bg-white border rounded-lg shadow-sm p-5 space-y-3">
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Scholar Information
                  </h2>
                  <InfoItem label="Name" value={scholarInfo.name} />
                  <InfoItem label="SPAS ID" value={request.spas_id} />
                  <InfoItem label="Email" value={scholarInfo.email} />
                  <InfoItem label="Contact Number" value={scholarInfo.contactNumber} />
                </section>

                <section className="bg-white border rounded-lg shadow-sm p-5 space-y-3 flex-1 flex flex-col">
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Request Details
                  </h2>
                  <div className="space-y-3 flex-1"> {/* Content wrapper */}
                    <InfoItem label="Transaction Type" value={request.type} />
                    <InfoItem label="Academic Term" value={`${submissionInfo.semester}, ${submissionInfo.academicYear}`} />
                    <InfoItem label="Date Submitted" value={formatDate(submissionInfo.dateSubmitted)} />
                    <InfoItem label="Current Status" value={
                       <StatusBadge status={submissionInfo.status} className="mt-1"/>
                    } />
                    
                    {request.type === 'Referral Letter' && (
                      <div className="pt-2">
                        <p className="text-xs font-medium text-gray-500">Selected Plan</p>
                        <p className="text-sm font-semibold text-gray-800 break-words mt-1">
                          {formatPTPPlan(submissionInfo.plan)}
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              </div>

            
              <div className="flex flex-col gap-6 h-full">
                <section className="bg-white border rounded-lg shadow-sm p-5 space-y-3">
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Placement Information
                  </h2>
                  <InfoItem label="Scholarship Type" value={placementInfo.scholarshipType} />
                  <InfoItem label="Batch / Year Awarded" value={placementInfo.batch} />
                  <InfoItem label="School / University" value={placementInfo.university} />
                  <InfoItem label="Program / Course" value={placementInfo.program} />
                </section>

                <section className="bg-white border rounded-lg shadow-sm p-5 space-y-3 flex-1 flex flex-col">
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Submitted Documents
                  </h2>
                  
                  <div className="grid grid-cols-1 gap-3">
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
                              needsResubmit={comment.includes('curriculum')}
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

      {/* --- Confirmation Dialogs --- */}
      <ConfirmDialog
        isOpen={isApproveOpen}
        onClose={() => setIsApproveOpen(false)}
        onConfirm={handleApprove}
        title="Approve Practical Training Request"
        description={`Are you sure you want to approve from ${scholarInfo.name}?`}
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