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
import type { GradeSubmission, YearLevel } from '@/types'; // 

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

export function GradeSubmissionModal({ isOpen, onClose, semester }: GradeSubmissionModalProps) {
  
  // Create mock data based on the semester prop to ensure types are correct
  const mockSubmissionData: GradeSubmission = {
    id: 'sub123',
    scholarId: 'scholar123',
    status: semester.status,
    dateSubmitted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    adminComment: 'Invalid Certificate of Registration. Please upload the certified true copy of the document from the university registrar.',
    yearLevel: yearLabels[semester.year] || '1st Year',
    semester: semester.semester,
    academicYear: '2023-2024', // This would also come from props/state
    registrationForm: 'De Larosa_COR.pdf',
    copyOfGrades: 'De Larosa_Grades.pdf',
  };

  const [submission, setSubmission] = useState<GradeSubmission | null>(
    (semester.status === 'Pending' || semester.status === 'Resubmit' || semester.status === 'Rejected') 
    ? mockSubmissionData
    : null
  );

  const [isEditing, setIsEditing] = useState(semester.status === 'Open' || semester.status === 'Resubmit');

  const handleSuccess = () => {
    // In a real app, this would trigger a refetch and close
    onClose();
  };

  const showForm = isEditing && (semester.status === 'Open' || semester.status === 'Resubmit');
  const showComment = (semester.status === 'Resubmit' || semester.status === 'Rejected') && submission?.adminComment;

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent size="2xl">
        <ModalHeader>
          <ModalTitle>
            Grade Submission: {yearLabels[semester.year] || `${semester.year}th Year`}
            , {semester.semester}
          </ModalTitle>
        </ModalHeader>
        
        <ModalBody className="space-y-4">
          {showComment && (
            <AdminCommentAlert
              status={semester.status}
              comment={submission.adminComment!}
            />
          )}

          {showForm ? (
            <SubmissionForm
              semester={semester}
              onSuccess={handleSuccess}
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