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
import { Eye, Download, MessageSquarePlus } from 'lucide-react';
import { formatDate } from '@/lib/utils/date';
import type { GradeSubmissionDetails } from './GradeSubmissionsTable';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'; // <-- IMPORT
import { toast } from '@/components/ui/toaster'; // <-- IMPORT
import { supabase } from '@/lib/supabase/client';

{/*
  Suggestions:
  Add UX for when Updating  
  Improve Loading screen
*/}

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value || 'N/A'}</p>
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
        <Label className="text-sm font-medium text-gray-700">{label}</Label>
        {needsResubmit && (
          <span className="text-xs font-medium text-red-600">To Resubmit</span>
        )}
      </div>
      <div className="flex items-center justify-between p-3 pl-4 border rounded-lg bg-gray-50">
        <span className="text-sm font-medium text-gray-800 truncate">{fileName}</span>
        <div className="flex items-center gap-1.5 ml-2">
          <Button variant="ghost" size="sm" className="w-7 h-7 p-0" title="View">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="w-7 h-7 p-0" title="Download">
            <Download className="h-4 w-4" />
          </Button>
        </div>
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
}

export function GradeSubmissionModal({
  isOpen,
  onClose,
  submission,
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

  // --- MODIFIED: This is now the CONFIRMED action ---
  const handleApprove = async () => {
    const finalComment = adminComment.trim() === '' ? APPROVED_MESSAGE : adminComment;

     try{
        // Update Grade Submission
        let {data, error: updateError} = await supabase
        .from('Grade Submission')
        .update({
          status: "Approved",
          comment: finalComment,
        })
        .eq('id', submission.id)
        .select()
        .single();

        if(updateError){
          throw new Error(updateError.message);
        }
       
        // Update User Status
        const { data: userData, error: userError } = await supabase
        .from('User')
        .update({
          scholarship_status: scholarStatusState,
        })
        .eq('spas_id', submission.spas_id)
        .select()
        .single(); 

        if (userError) throw new Error(userError.message);
        
        console.log(`Approving ${scholarInfo.name} with comment: ${finalComment}`);
        toast.success('Submission Approved', { description: `${scholarInfo.name} has been notified.` });

        submission.submissionInfo.status = "Approved"
    }catch(e: any){
        console.error('Update failed:', e);
        alert('Failed to update Grades: ' + e.message);
    }finally{
        setIsApproveOpen(false); // Close dialog
        onClose(); // Close modal
    }

    // In a real app, you would save:
    // 1. status: "Approved"
    // 2. adminComment: finalComment
    // 3. scholarStatus: scholarStatusState
    
  };

  // --- MODIFIED: This is now the CONFIRMED action ---
  const handleResubmit = async () => {
    if (adminComment.trim() === '') {
      toast.error('Please provide a comment before requesting resubmission.');
      return;
    }
    
    
    try{
        const {data, error: updateError} = await supabase
        .from('Grade Submission')
        .update({
          status: "Resubmit",
          comment: adminComment,
        })
        .eq('id', submission.id)
        .select()
        .single();

        if(updateError){
          throw new Error(updateError.message);
        }

         // Update User Status
        const { data: userData, error: userError } = await supabase
        .from('User')
        .update({
          scholarship_status: scholarStatusState,
        })
        .eq('spas_id', submission.spas_id)
        .select()
        .single(); 


        console.log(`Requesting resubmission from ${scholarInfo.name} with comment: ${adminComment}`);
        toast.warning('Resubmission Requested', { description: `${scholarInfo.name} has been notified.` });
        submission.submissionInfo.status = "Resubmit"
    }catch(e: any){
        console.error('Update failed:', e);
        alert('Failed to update Grades: ' + e.message);
    }finally{
        setIsResubmitOpen(false); // Close dialog
        onClose(); // Close modal
    }

    // In a real app, you would save:
    // 1. status: "Resubmit"
    // 2. adminComment: adminComment
    // 3. scholarStatus: scholarStatusState
    
    
  };

  const comment = adminComment.toLowerCase();
  const showCorResubmit = comment.includes('registration') || comment.includes('form 5');
  const showGradesResubmit = comment.includes('grades');

  return (
    <>
      <Modal open={isOpen} onOpenChange={onClose}>
        <ModalContent size="4xl">
          <ModalHeader>
            <ModalTitle>Grade Submission Details</ModalTitle>
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
                  {/* ... other InfoItems ... */}
                  <InfoItem label="Contact Number" value={scholarInfo.contactNumber} />
                  <InfoItem label="Date of Birth" value={scholarInfo.dateOfBirth} />
                  <InfoItem label="Complete Address" value={scholarInfo.completeAddress} />
                </section>

                <section className="space-y-3">
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Submission Details
                  </h2>
                  <InfoItem label="Year & Semester" value={`${submissionInfo.year}, ${submissionInfo.semester}`} />
                  <InfoItem label="Academic Year" value={submissionInfo.academicYear} />
                  <InfoItem label="Date Submitted" value={formatDate(submissionInfo.dateSubmitted)} />
                </section>
              </div>

              {/* === COLUMN 2 === */}
              <div className="space-y-6">
                <section className="space-y-3">
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Year of Award and Study Placement
                  </h2>
                  <InfoItem label="Scholarship Type" value={placementInfo.scholarshipType} />
                  <InfoItem label="Batch / Year Awarded" value={placementInfo.batch} />
                  <InfoItem label="School / University" value={placementInfo.university} />
                  <InfoItem label="Program / Course" value={placementInfo.program} />
                </section>

                <section className="space-y-4">
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Submitted Documents
                  </h2>
                  <FileDisplay
                    label="Course Curriculum:"
                    fileName={files.curriculumFile}
                  />
                  <FileDisplay
                    label="Registration Form or Form 5:"
                    fileName={files.registrationForm}
                    needsResubmit={showCorResubmit}
                  />
                  <FileDisplay
                    label="Copy of Grades:"
                    fileName={files.copyOfGrades}
                    needsResubmit={showGradesResubmit}
                  />
                </section>
              </div>
            </div>

            {/* --- FULL WIDTH SECTION (Comments & Status) --- */}
            <section className="pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <section>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Scholar Status
                  </Label>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                    {/* ... radio buttons ... */}
                    <div className="flex items-center gap-2">
                      <input type="radio" id="status-active" name="scholarStatus" value="Active" checked={scholarStatusState === 'Active'} onChange={() => setScholarStatusState('Active')} />
                      <Label htmlFor="status-active">Active</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="radio" id="status-warning" name="scholarStatus" value="Warning" checked={scholarStatusState === 'Warning'} onChange={() => setScholarStatusState('Warning')} />
                      <Label htmlFor="status-warning">Warning</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="radio" id="status-2ndwarning" name="scholarStatus" value="2nd Warning" checked={scholarStatusState === '2nd Warning'} onChange={() => setScholarStatusState('2nd Warning')} />
                      <Label htmlFor="status-2ndwarning">2nd Warning</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="radio" id="status-suspended" name="scholarStatus" value="Suspended" checked={scholarStatusState === 'Suspended'} onChange={() => setScholarStatusState('Suspended')} />
                      <Label htmlFor="status-suspended">Suspended</Label>
                    </div>
                  </div>
                </section>

                <section className="space-y-2">
                  <Label htmlFor="admin-comment" className="block text-sm font-medium text-gray-700">
                    Comments
                  </Label>
                  <Textarea
                    id="admin-comment"
                    placeholder="Add comments for the scholar... (e.g., 'Invalid COR')"
                    className="min-h-[100px]"
                    value={adminComment}
                    onChange={(e) => setAdminComment(e.target.value)}
                  />
                  <div className="flex flex-wrap gap-1.5">
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
                </section>
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