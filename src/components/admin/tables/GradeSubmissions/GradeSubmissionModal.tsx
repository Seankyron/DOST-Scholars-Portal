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
import type { GradeSubmissionDetails } from './GradeSubmissionsTable';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { toast } from '@/components/ui/toaster';
import { supabase } from '@/lib/supabase/client';
import { StatusBadge } from '@/components/shared/StatusBadge';

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-800 break-words">{value || 'N/A'}</p>
    </div>
  );
}

// --- Helper Component for file display ---
function FileDisplay({
  label,
  fileName,
  needsResubmit = false,
}: {
  label: string;
  fileName: string;
  needsResubmit?: boolean;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <Label className="text-xs font-medium text-gray-700 truncate" title={label}>{label}</Label>
        {/* The red indicator label */}
        {needsResubmit && (
          <span className="text-[10px] font-medium text-red-600 flex-shrink-0 ml-2">To Resubmit</span>
        )}
      </div>
      {/* The red background/border styling */}
      <div className={`flex items-center justify-between p-3 pl-4 border rounded-lg transition-colors ${needsResubmit ? 'bg-red-50 border-red-200' : 'bg-gray-50'}`}>
        {fileName ? (
          <>
            <span className={`text-sm font-medium truncate ${needsResubmit ? 'text-red-700' : 'text-gray-800'}`} title={fileName}>{fileName}</span>
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
    key: 'cor_invalid',
    text: 'Invalid Certificate of Registration. Please upload the certified true copy of the document from the university registrar.',
    short: 'Invalid COR',
  },
  {
    key: 'grades_blurry',
    text: 'Unclear/blurry Copy of Grades. Please re-upload a clear copy.',
    short: 'Blurry Grades',
  },
  {
    key: 'cor_wrong_doc',
    text: 'Incorrect document uploaded for Registration Form. Please upload your Registration Form.',
    short: 'Wrong COR Doc',
  },
  {
    key: 'grades_wrong_doc',
    text: 'Wrong document uploaded for Grades. Please upload your Copy of Grades.',
    short: 'Wrong Grades Doc',
  },
  {
    key: 'both_wrong',
    text: 'Both documents are incorrect. Please re-upload your Certificate of Registration and your Copy of Grades.',
    short: 'Both Docs Wrong',
  },
];

const APPROVED_MESSAGE = 'Your submission is approved. Please wait for your stipend to be processed. You can check the status in the Stipend Tracking service.';

interface GradeSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: GradeSubmissionDetails;
  onUpdate: () => void;
}

export function GradeSubmissionModal({
  isOpen,
  onClose,
  submission,
  onUpdate
}: GradeSubmissionModalProps) {
  const { scholarInfo, placementInfo, submissionInfo, files, scholarStatus } = submission;
  
  // Local state to handle immediate updates
  const [currentStatus, setCurrentStatus] = useState(submissionInfo.status);
  const [scholarStatusState, setScholarStatusState] = useState(scholarStatus);
  const [adminComment, setAdminComment] = useState(submissionInfo.adminComment || '');

  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isResubmitOpen, setIsResubmitOpen] = useState(false);

  // Sync local state when the prop changes (e.g., when reopening the modal)
  useEffect(() => {
    setCurrentStatus(submissionInfo.status);
    setAdminComment(submissionInfo.adminComment || '');
    setScholarStatusState(scholarStatus);
  }, [submissionInfo.status, submissionInfo.adminComment, scholarStatus]);

  const isActionable = currentStatus === 'Pending' || 'Resubmit-Pending';

  const handleAddComment = (commentText: string) => {
    setAdminComment((prev) => {
      if (prev.trim() === '') return commentText;
      return `${prev}\n- ${commentText}`;
    });
  };

  const comment = adminComment.toLowerCase();

  // 1. Regex Helper: Checks for WHOLE words (prevents 'cor' matching inside 'incorrect')
  const hasKeyword = (keywords: string[]) => {
    return keywords.some((keyword) => {
      const safeKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${safeKeyword}\\b`, 'i'); 
      return regex.test(comment);
    });
  };

  const mentionsBoth = hasKeyword(['both', 'all', 'everything']);

  const showCorResubmit = (
    mentionsBoth || 
    hasKeyword(['registration', 'form 5', 'cor', 'enrollment', 'reg form', 'certificate'])
  ) && currentStatus !== 'Approved';

  const showGradesResubmit = (
    mentionsBoth || 
    hasKeyword(['grade', 'grades', 'cog', 'card', 'rating', 'scholastic'])
  ) && currentStatus !== 'Approved';

  // 5. Blocker Logic: Prevents approval if any negative keywords are found
  const hasResubmitRequest = (
    showCorResubmit || 
    showGradesResubmit || 
    hasKeyword(['incorrect', 'invalid', 'wrong', 'resubmit', 'missing', 'blurry'])
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
    const finalComment = adminComment.trim() === '' ? APPROVED_MESSAGE : adminComment;

     try{
        let { error: updateError } = await supabase
        .from('Grade Submission')
        .update({ status: "Approved", comment: finalComment })
        .eq('id', submission.id);

        if(updateError) throw new Error(updateError.message);
       
        const { error: userError } = await supabase
        .from('User')
        .update({ scholarship_status: scholarStatusState })
        .eq('spas_id', submission.spas_id);

        if (userError) throw new Error(userError.message);
        
        toast.success('Submission Approved', { description: `${scholarInfo.name} has been notified.` });
        
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
        .from('Grade Submission')
        .update({ status: "Resubmit", comment: adminComment })
        .eq('id', submission.id);

        if(updateError) throw new Error(updateError.message);

        const { error: userError } = await supabase
        .from('User')
        .update({ scholarship_status: scholarStatusState })
        .eq('spas_id', submission.spas_id);

        if (userError) throw new Error(userError.message);

        toast.warning('Resubmission Requested', { 
            description: `${scholarInfo.name} has been notified.`,
            className: "bg-yellow-50 border-yellow-200", 
        });

        setCurrentStatus('Resubmit');
        onUpdate();
        setIsResubmitOpen(false);
        // We keep the modal open so you can see the red flags update immediately
    }catch(e: any){
        console.error('Update failed:', e);
        toast.error('Update Failed', { description: e.message });
    }
  };

  return (
    <>
      <Modal open={isOpen} onOpenChange={onClose}>
        <ModalContent size="4xl">
          <ModalHeader>
             <div className="flex flex-col">
                <ModalTitle>Grade Submission Details</ModalTitle>
                <p className="text-sm text-gray-500 font-normal mt-1">{submissionInfo.year}, {submissionInfo.semester}</p>
             </div>
          </ModalHeader>

          <ModalBody className="max-h-[70vh] overflow-y-auto scrollbar-thin p-6 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              
              {/* === COLUMN 1 === */}
              <div className="flex flex-col gap-6 h-full">
                <section className="bg-white border rounded-lg shadow-sm p-5 space-y-3">
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">Scholar Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InfoItem label="Name" value={scholarInfo.name} />
                    <InfoItem label="SPAS ID" value={scholarInfo.completeAddress} />
                    <InfoItem label="Contact Number" value={scholarInfo.contactNumber} />
                    <InfoItem label="Email" value={scholarInfo.dateOfBirth} />
                  </div>
                </section>

                <section className="bg-white border rounded-lg shadow-sm p-5 space-y-4 flex-1">
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">Submission Details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InfoItem label="Academic Year" value={submissionInfo.academicYear} />
                    <InfoItem label="Date Submitted" value={formatDate(submissionInfo.dateSubmitted)} />
                    <InfoItem label="Current Submission Status" value={<StatusBadge status={currentStatus} className="mt-1"/>} />
                  </div>

                  <div className="pt-4 border-t mt-2">
                    <Label className="block text-xs font-semibold text-gray-500 uppercase mb-3">Update Scholar Status</Label>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {['Active', 'Warning', '2nd Warning', 'Suspended'].map((status) => (
                        <div key={status} className="flex items-center gap-2">
                          <input 
                            type="radio" 
                            id={`status-${status}`} 
                            name="scholarStatus" 
                            value={status} 
                            checked={scholarStatusState === status} 
                            onChange={() => setScholarStatusState(status as any)} 
                            className="accent-dost-title h-4 w-4"
                          />
                          <Label htmlFor={`status-${status}`} className="cursor-pointer">{status}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </div>

              {/* === COLUMN 2 === */}
              <div className="flex flex-col gap-6 h-full">
                <section className="bg-white border rounded-lg shadow-sm p-5 space-y-3">
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">Placement Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InfoItem label="Scholarship Type" value={placementInfo.scholarshipType} />
                    <InfoItem label="Batch / Year Awarded" value={placementInfo.batch} />
                    <InfoItem label="School / University" value={placementInfo.university} />
                    <InfoItem label="Program / Course" value={placementInfo.program} />
                  </div>
                </section>

                <section className="bg-white border rounded-lg shadow-sm p-5 space-y-3 flex-1">
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">Submitted Documents</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FileDisplay
                        label="Course Curriculum"
                        fileName={files.curriculumFile}
                    />
                    <FileDisplay
                        label="Registration Form / COR"
                        fileName={files.registrationForm}
                        needsResubmit={showCorResubmit}
                    />
                    <FileDisplay
                        label="Copy of Grades"
                        fileName={files.copyOfGrades}
                        needsResubmit={showGradesResubmit}
                    />
                  </div>
                </section>
              </div>
            </div>

            {/* --- COMMENTS SECTION --- */}
            <section className="bg-white border rounded-lg shadow-sm p-5">
               <div className="space-y-2">
                  <Label htmlFor="admin-comment" className="block text-sm font-medium text-gray-700">Admin Comments</Label>
                  {isActionable ? (
                    <>
                      <Textarea
                        id="admin-comment"
                        placeholder="Add comments..."
                        className="min-h-[100px]"
                        value={adminComment}
                        onChange={(e) => setAdminComment(e.target.value)}
                      />
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {PREBUILT_COMMENTS.map((c) => (
                          <Button key={c.key} type="button" variant="outline" size="sm" onClick={() => handleAddComment(c.text)} className="text-xs h-auto py-1 px-2 border-blue-200 text-blue-700 hover:bg-blue-50">
                            <MessageSquarePlus className="h-3 w-3 mr-1.5" />{c.short}
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
              <Button type="button" variant="outline">{isActionable ? 'Cancel' : 'Close'}</Button>
            </ModalClose>
            {isActionable && (
              <>
                <Button type="button" variant="primary" className="bg-red-600 hover:bg-red-700" onClick={() => setIsResubmitOpen(true)}>REQUEST RESUBMISSION</Button>
                <Button type="button" variant="primary" className="bg-green-600 hover:bg-green-700" onClick={handleAttemptApprove}>APPROVE</Button>
              </>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      <ConfirmDialog isOpen={isApproveOpen} onClose={() => setIsApproveOpen(false)} onConfirm={handleApprove} title="Approve Submission" description={`Are you sure you want to approve this submission for ${scholarInfo.name}?`} variant="info" confirmText="Yes, approve"/>
      <ConfirmDialog isOpen={isResubmitOpen} onClose={() => setIsResubmitOpen(false)} onConfirm={handleResubmit} title="Request Resubmission" description={`Are you sure you want to request resubmission from ${scholarInfo.name}?`} variant="danger" confirmText="Yes, request resubmission"/>
    </>
  );
}