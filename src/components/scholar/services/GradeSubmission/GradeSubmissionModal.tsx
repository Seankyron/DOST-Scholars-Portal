'use client';

import { useState } from 'react';
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalTitle, 
  ModalBody, 
  ModalFooter,
  ModalClose 
} from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { SubmissionForm } from './SubmissionForm';
import { SubmissionReview } from './SubmissionReview';
import { AdminCommentAlert } from './AdminCommenAlert';
import type { SemesterAvailability } from '@/types/curriculum';
import type { GradeSubmission, YearLevel } from '@/types'; 

interface GradeSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  semester: SemesterAvailability;
}

const yearLabels: { [key: number]: YearLevel } = {
  1: '1st Year',
  2: '2nd Year',
  3: '3rd Year',
  4: '4th Year',
  5: '5th Year',
};

// --- MODIFICATION: This is your custom approved message ---
const APPROVED_MESSAGE = 'Your submission is approved. Please wait for your stipend to be processed. You can check the status in the Stipend Tracking service.';

export function GradeSubmissionModal({ isOpen, onClose, semester }: GradeSubmissionModalProps) {
  
  const mockSubmissionData: GradeSubmission = {
    id: 'sub123',
    scholarId: 'scholar123',
    status: semester.status,
    dateSubmitted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    // --- MODIFICATION: Use real comment only for resubmit ---
    adminComment: semester.status === 'Resubmit' 
      ? 'Invalid Certificate of Registration. Please upload the certified true copy of the document from the university registrar.'
      : undefined,
    yearLevel: yearLabels[semester.year] || '1st Year',
    semester: semester.semester,
    academicYear: '2023-2024',
    registrationForm: 'De Larosa_COR.pdf',
    registrationFormUrl: '#mock-reg-form-url',
    copyOfGrades: 'De Larosa_Grades.pdf',
    copyOfGradesUrl: '#mock-grades-url',
  };

  const [submission, setSubmission] = useState<GradeSubmission | null>(
    // --- MODIFICATION: Load data for all viewable statuses ---
    (semester.status === 'Pending' || semester.status === 'Resubmit' || semester.status === 'Approved' || semester.status === 'Closed') 
    ? mockSubmissionData
    : null
  );

  // --- MODIFICATION: Only "edit" for Open or Resubmit ---
  const [isEditing, setIsEditing] = useState(semester.status === 'Open' || semester.status === 'Resubmit');

  const handleSuccess = () => {
    onClose();
  };

  // --- MODIFICATION: Logic to determine what comment to show ---
  let commentToShow: string | undefined = undefined;
  if (semester.status === 'Resubmit' && submission?.adminComment) {
    commentToShow = submission.adminComment;
  } else if (semester.status === 'Approved') {
    commentToShow = APPROVED_MESSAGE;
  }
  
  const showForm = isEditing && (semester.status === 'Open' || semester.status === 'Resubmit');

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent size="2xl">
        <ModalHeader>
          <ModalTitle>
            Grade Submission: {yearLabels[semester.year] || `${semester.year}th Year`}
            , {semester.semester}
          </ModalTitle>
        </ModalHeader>
        
        <ModalBody className="space-y-4 overflow-y-auto scrollbar-thin">
          {/* --- MODIFICATION: Use the new commentToShow variable --- */}
          {commentToShow && (
            <AdminCommentAlert
              status={semester.status}
              comment={commentToShow}
            />
          )}

          {showForm ? (
            <SubmissionForm
              semester={semester}
              onSuccess={handleSuccess}
              submission={submission} 
            />
          ) : (
            submission && (
              <SubmissionReview
                submission={submission}
                onEdit={() => setIsEditing(true)}
              />
            )
          )}
        </ModalBody>
        
        {!showForm && (
           <ModalFooter>
            <ModalClose asChild>
              <Button variant="outline">Close</Button>
            </ModalClose>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
}