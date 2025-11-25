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
import { Download, MessageSquarePlus } from 'lucide-react';
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
    text: 'Incorrect document uploaded for Grades. Please upload your Copy of Grades.',
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
  
  const [scholarStatusState, setScholarStatusState] = useState(scholarStatus);
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
    const finalComment = adminComment.trim() === '' ? APPROVED_MESSAGE : adminComment;

     try{
        // Update Grade Submission
        let { error: updateError } = await supabase
        .from('Grade Submission')
        .update({
          status: "Approved",
          comment: finalComment,
        })
        .eq('id', submission.id);

        if(updateError) throw new Error(updateError.message);
       
        // Update User Status
        const { error: userError } = await supabase
        .from('User')
        .update({
          scholarship_status: scholarStatusState,
        })
        .eq('spas_id', submission.spas_id);

        if (userError) throw new Error(userError.message);
        
        toast.success('Submission Approved', { description: `${scholarInfo.name} has been notified.` });
        onUpdate();
    }catch(e: any){
        console.error('Update failed:', e);
        toast.error('Update Failed', { description: e.message });
    }finally{
        setIsApproveOpen(false);
        onClose(); 
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
        .update({
          status: "Resubmit",
          comment: adminComment,
        })
        .eq('id', submission.id);

        if(updateError) throw new Error(updateError.message);

         // Update User Status
        const { error: userError } = await supabase
        .from('User')
        .update({
          scholarship_status: scholarStatusState,
        })
        .eq('spas_id', submission.spas_id);

        if (userError) throw new Error(userError.message);

        toast.warning('Resubmission Requested', { 
            description: `${scholarInfo.name} has been notified.`,
            className: "bg-yellow-50 border-yellow-200", 
        });
        onUpdate();
    }catch(e: any){
        console.error('Update failed:', e);
        toast.error('Update Failed', { description: e.message });
    }finally{
        setIsResubmitOpen(false);
        onClose(); 
    }
  };

  const comment = adminComment.toLowerCase();
  const showCorResubmit = comment.includes('registration') || comment.includes('form 5');
  const showGradesResubmit = comment.includes('grades');

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
              
              {/* === COLUMN 1: Scholar Info & Details === */}
              <div className="flex flex-col gap-6 h-full">
                {/* Card 1: Scholar Info */}
                <section className="bg-white border rounded-lg shadow-sm p-5 space-y-3">
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Scholar Information
                  </h2>
                  <InfoItem label="Name" value={scholarInfo.name} />
                  <InfoItem label="Contact Number" value={scholarInfo.contactNumber} />
                  <InfoItem label="Date of Birth" value={scholarInfo.dateOfBirth} />
                  <InfoItem label="Complete Address" value={scholarInfo.completeAddress} />
                </section>

                {/* Card 2: Submission Details & Status Update */}
                <section className="bg-white border rounded-lg shadow-sm p-5 space-y-4 flex-1">
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Submission Details
                  </h2>
                  
                  {/* Read-Only Info */}
                  <div className="space-y-3">
                    <InfoItem label="Academic Year" value={submissionInfo.academicYear} />
                    <InfoItem label="Date Submitted" value={formatDate(submissionInfo.dateSubmitted)} />
                    <InfoItem label="Current Submission Status" value={
                        <StatusBadge status={submissionInfo.status} className="mt-1"/>
                    } />
                  </div>

                  {/* Status Update Control */}
                  <div className="pt-4 border-t mt-2">
                    <Label className="block text-xs font-semibold text-gray-500 uppercase mb-3">
                      Update Scholar Status
                    </Label>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {/* Active */}
                      <div className="flex items-center gap-2">
                        <input 
                          type="radio" 
                          id="status-active" 
                          name="scholarStatus" 
                          value="Active" 
                          checked={scholarStatusState === 'Active'} 
                          onChange={() => setScholarStatusState('Active')} 
                          className="accent-dost-title h-4 w-4"
                        />
                        <Label htmlFor="status-active" className="cursor-pointer">Active</Label>
                      </div>
                      {/* Warning */}
                      <div className="flex items-center gap-2">
                        <input 
                          type="radio" 
                          id="status-warning" 
                          name="scholarStatus" 
                          value="Warning" 
                          checked={scholarStatusState === 'Warning'} 
                          onChange={() => setScholarStatusState('Warning')} 
                          className="accent-dost-title h-4 w-4"
                        />
                        <Label htmlFor="status-warning" className="cursor-pointer">Warning</Label>
                      </div>
                      {/* 2nd Warning */}
                      <div className="flex items-center gap-2">
                        <input 
                          type="radio" 
                          id="status-2ndwarning" 
                          name="scholarStatus" 
                          value="2nd Warning" 
                          checked={scholarStatusState === '2nd Warning'} 
                          onChange={() => setScholarStatusState('2nd Warning')} 
                          className="accent-dost-title h-4 w-4"
                        />
                        <Label htmlFor="status-2ndwarning" className="cursor-pointer">2nd Warning</Label>
                      </div>
                      {/* Suspended */}
                      <div className="flex items-center gap-2">
                        <input 
                          type="radio" 
                          id="status-suspended" 
                          name="scholarStatus" 
                          value="Suspended" 
                          checked={scholarStatusState === 'Suspended'} 
                          onChange={() => setScholarStatusState('Suspended')} 
                          className="accent-dost-title h-4 w-4"
                        />
                        <Label htmlFor="status-suspended" className="cursor-pointer">Suspended</Label>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* === COLUMN 2: Placement & Documents === */}
              <div className="flex flex-col gap-6 h-full">
                {/* Card 3: Placement Info */}
                <section className="bg-white border rounded-lg shadow-sm p-5 space-y-3">
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Placement Information
                  </h2>
                  <InfoItem label="Scholarship Type" value={placementInfo.scholarshipType} />
                  <InfoItem label="Batch / Year Awarded" value={placementInfo.batch} />
                  <InfoItem label="School / University" value={placementInfo.university} />
                  <InfoItem label="Program / Course" value={placementInfo.program} />
                </section>

                {/* Card 4: Documents */}
                <section className="bg-white border rounded-lg shadow-sm p-5 space-y-3 flex-1">
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Submitted Documents
                  </h2>
                  <div className="flex flex-col gap-3">
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

            {/* --- FULL WIDTH SECTION: Comments --- */}
            <section className="bg-white border rounded-lg shadow-sm p-5">
               <div className="space-y-2">
                  <Label htmlFor="admin-comment" className="block text-sm font-medium text-gray-700">
                    Admin Comments
                  </Label>
                  <Textarea
                    id="admin-comment"
                    placeholder="Add comments for the scholar... (e.g., 'Invalid COR' or 'Congratulations on your grades!')"
                    className="min-h-[100px]"
                    value={adminComment}
                    onChange={(e) => setAdminComment(e.target.value)}
                  />
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {PREBUILT_COMMENTS.map((comment) => (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        key={comment.key}
                        onClick={() => handleAddComment(comment.text)}
                        className="text-xs h-auto py-1 px-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        <MessageSquarePlus className="h-3 w-3 mr-1.5" />
                        {comment.short}
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