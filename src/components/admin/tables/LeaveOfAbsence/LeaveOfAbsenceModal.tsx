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
import type { LOARequestDetails } from './LeaveOfAbsenceTable';
import { supabase } from '@/lib/supabase/client';


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
          <span className="text-[10px] font-medium text-red-600 flex-shrink-0 ml-2">To Resubmit</span>
        )}
      </div>
      <div className={`flex items-center justify-between p-3 pl-4 border rounded-lg ${needsResubmit ? 'bg-red-50 border-red-200' : 'bg-gray-50'}`}>
        {fileName ? (
           <>
             <span className={`text-sm font-medium truncate ${needsResubmit ? 'text-red-700' : 'text-gray-800'}`} title={fileName}>
                {fileName}
             </span>
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
    key: 'blur',
    text: 'The document uploaded is blurred or unreadable. Please re-upload a clear copy.',
    short: 'Blurred File',
  },
  {
    key: 'univ_approval',
    text: 'University Approval must be signed by the Dean or College Secretary.',
    short: 'Invalid Sig',
  },
  {
    key: 'med_cert',
    text: 'Medical Certificate must be issued by a government physician or university clinic.',
    short: 'Invalid Med Cert',
  },
];

interface LeaveOfAbsenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: LOARequestDetails; 
  onUpdate: () => void; 
}

export function LeaveOfAbsenceModal({
  isOpen,
  onClose,
  request,
  onUpdate
}: LeaveOfAbsenceModalProps) {
  const { scholarInfo, currentPlacement, loaDetails, submissionInfo, files, applicationType } = request;
  
  // Local state to handle immediate updates within modal session
  const [currentStatus, setCurrentStatus] = useState(submissionInfo.status);
  const [adminComment, setAdminComment] = useState(submissionInfo.adminComment || '');
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isResubmitOpen, setIsResubmitOpen] = useState(false);

  // Sync props to state if they change externally (e.g. re-opening modal)
  useEffect(() => {
    setCurrentStatus(submissionInfo.status);
    setAdminComment(submissionInfo.adminComment || '');
  }, [submissionInfo]);

  // Determine if actions are allowed
  const isActionable = currentStatus === 'Pending' || 'Resubmit-Pending';

  const handleAddComment = (commentText: string) => {
    setAdminComment((prev) => {
      if (prev.trim() === '') return commentText;
      return `${prev}\n- ${commentText}`;
    });
  };

  const handleApprove = async () => {
     try{
          let { error: updateError } = await supabase
          .from('Leave of Absence')
          .update({ status: "Approved", comment: 'Leave of Absence Approved!' })
          .eq('id', parseInt(request.id));

          if(updateError) throw new Error(updateError.message);
          toast.success('LOA Request Approved', { description: `${scholarInfo.name} has been notified.` });
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
      toast.error('Please provide a comment before requesting resubmission.');
      return;
    }
    try{
          let { error: updateError } = await supabase
          .from('Leave of Absence')
          .update({ status: "Resubmit", comment: adminComment.trim() })
          .eq('id', parseInt(request.id));
  
          if(updateError) throw new Error(updateError.message);
         
          toast.warning('Resubmission Requested', { 
              description: `${scholarInfo.name} has been notified.`,
              className: "bg-yellow-50 border-yellow-200", 
          });
          toast.warning('Resubmission Requested', { description: `${scholarInfo.name} has been notified.` });
          setCurrentStatus('Resubmit');
          onUpdate();
          setIsResubmitOpen(false);
          onClose();
          }catch(e: any){
          console.error('Update failed:', e);
          toast.error('Update Failed', { description: e.message });
      }

  };

  const comment = adminComment.toLowerCase();
  const isMedical = applicationType === 'Medical/Personal';


  const hasKeyword = (keywords: string[]) => {
      return keywords.some(k => comment.includes(k));
  };

  const hasResubmitRequest = 
    hasKeyword(['form', 'grades', 'university', 'approval', 'medical', 'registration', 
                'admission', 'missing', 'blur', 'invalid', 'other', 'resubmit']);

  const handleAttemptApprove = () => {
    if (hasResubmitRequest) {
      toast.error("Action Blocked", {
        description: "You cannot approve this request while the comment indicates issues. Please edit the comment or request resubmission."
      });
      return;
    }
    setIsApproveOpen(true);
  };

  return (
    <>
      <Modal open={isOpen} onOpenChange={onClose}>
        <ModalContent size="3xl">
          <ModalHeader>
                <div className="flex flex-col">
                   <ModalTitle>Leave of Absence Request</ModalTitle>
                   <p className="text-sm text-gray-500 font-normal mt-1">{applicationType}</p>
                </div>  
          </ModalHeader>

          <ModalBody className="p-6 space-y-6">
            
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

                {/* 2. LOA Details */}
                <section className="bg-white border rounded-lg shadow-sm p-5 space-y-3 flex-1 flex flex-col">
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Application Details
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InfoItem label="Start Semester" value={loaDetails.startSemester} />
                    <InfoItem label="Academic Year" value={loaDetails.academicYear} />
                    <InfoItem label="Duration" value={loaDetails.duration} />
                    <InfoItem label="Date Submitted" value={formatDate(submissionInfo.dateSubmitted)} />
                    <InfoItem label="Current Status" value={
                        <StatusBadge status={currentStatus} className="mt-1"/>
                    } />
                  </div>
                  
                  {/* Reason Section */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                     <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Reason for Leave</p>
                     <div className="bg-blue-50 border border-blue-100 p-3 rounded-md">
                        <p className="font-normal italic text-gray-700 text-sm">{submissionInfo.reason}</p>
                     </div>
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
                    {/* Common Documents */}
                    <FileDisplay
                        label="Application Form"
                        fileName={files.applicationForm}
                        needsResubmit={hasKeyword(['form', 'application'])}
                    />
                    <FileDisplay
                        label="Cert. of Grades"
                        fileName={files.certificationGrades}
                        needsResubmit={hasKeyword(['grades', 'certification'])}
                    />

                    {/* Medical / Personal Specific */}
                    {isMedical && (
                       <>
                        <FileDisplay
                            label="University Approval"
                            fileName={files.universityApproval}
                            needsResubmit={hasKeyword(['approval', 'university'])}
                        />
                        <FileDisplay
                            label="Medical Certificate"
                            fileName={files.medicalCertificate}
                            needsResubmit={hasKeyword(['medical', 'certificate'])}
                        />
                       </>
                    )}

                    {/* Exchange Student Specific */}
                    {!isMedical && (
                        <>
                        <FileDisplay
                            label="Reg. Form (Form 5)"
                            fileName={files.registrationForm}
                            needsResubmit={hasKeyword(['registration', 'form 5'])}
                        />
                        <FileDisplay
                            label="Proof of Admission"
                            fileName={files.proofOfAdmission}
                            needsResubmit={hasKeyword(['admission', 'proof'])}
                        />
                        </>
                    )}

                    {/* Optional/Other */}
                    <FileDisplay
                        label="Other Documents"
                        fileName={files.supportingDocument}
                        needsResubmit={hasKeyword(['other', 'supporting'])}
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
                  
                  {isActionable ? (
                    <>
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
        title="Approve LOA Request"
        description={`Are you sure you want to approve the Leave of Absence for ${scholarInfo.name}?`}
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