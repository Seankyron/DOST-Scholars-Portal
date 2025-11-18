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
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Calendar } from 'lucide-react'; 
import { SubmissionForm } from './SubmissionForm';
import { AdminCommentAlert } from '../../../shared/AdminCommenAlert';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatDate } from '@/lib/utils/date';
import type { SemesterAvailability, GradeSubmission, YearLevel } from '@/types'; 
import { useFileUpload } from '@/hooks/useFileUpload';
import { toast } from '@/components/ui/toaster';

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

const APPROVED_MESSAGE = 'Your submission is approved. Please wait for your stipend to be processed.';

export function GradeSubmissionModal({ isOpen, onClose, semester }: GradeSubmissionModalProps) {
  
  // --- Mock Data Loading ---
  const mockSubmissionData: GradeSubmission = {
    id: 'sub123',
    scholarId: 'scholar123',
    status: semester.status,
    dateSubmitted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    adminComment: semester.status === 'Resubmit' 
      ? 'Invalid Certificate of Registration. Please upload the certified true copy.'
      : undefined,
    yearLevel: yearLabels[semester.year] || '1st Year',
    semester: semester.semester,
    academicYear: semester.academicYear || 'N/A',
    registrationForm: 'De Larosa_COR.pdf',
    registrationFormUrl: '#',
    copyOfGrades: 'De Larosa_Grades.pdf',
    copyOfGradesUrl: '#',
  };

  const hasSubmission = semester.status !== 'Open' && semester.status !== 'Not Available';
  const initialSubmission = hasSubmission ? mockSubmissionData : null;

  // --- State ---
  const [submission, setSubmission] = useState<GradeSubmission | null>(initialSubmission);
  
  // Derived State (Moved up so handleSubmit can access them)
  const status = submission?.status || semester.status;
  const adminComment = submission?.adminComment;
  const isResubmit = status === 'Resubmit';
  
  // Initial Mode: Edit if 'Open' or 'Resubmit'. View otherwise.
  const [isEditing, setIsEditing] = useState(semester.status === 'Open' || isResubmit);
  
  const [regForm, setRegForm] = useState<File | null>(null);
  const [gradesFile, setGradesFile] = useState<File | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { uploadFile } = useFileUpload('grade-submissions');
  const scholarId = 'mock-scholar-id'; 

  const handleCloseAndReset = () => {
    setIsLoading(false);
    setRegForm(null);
    setGradesFile(null);
    setIsConfirmed(false);
    onClose(); 
  };

  const handleSubmit = async () => {
    // 1. Universal Check: Confirmation
    if (!isConfirmed) {
       toast.error('Please confirm that your documents are correct.');
       return;
    }

    if (isResubmit) {
        const comment = (adminComment || '').toLowerCase();
        
        const needsRegForm = comment.includes('registration') || comment.includes('form 5');
        const needsGrades = comment.includes('grades') || comment.includes('tor') || comment.includes('transcript');

        if (needsRegForm && !regForm) {
            toast.error('Please re-upload your Registration Form / Form 5.');
            return;
        }

        if (needsGrades && !gradesFile) {
            toast.error('Please re-upload your Copy of Grades.');
            return;
        }
    }

    // 3. New Submission Logic: Both files required
    if (semester.status === 'Open' && (!regForm || !gradesFile)) {
        toast.error('Please upload all required files.');
        return;
    }


    try {
      // Upload Logic
      if (regForm) {
        const path = `${scholarId}/${semester.year}-${semester.semester}-regform.${regForm.name.split('.').pop()}`;
        await uploadFile(regForm, path, { acceptedTypes: ['.pdf'] });
      }
      if (gradesFile) {
        const path = `${scholarId}/${semester.year}-${semester.semester}-grades.${gradesFile.name.split('.').pop()}`;
        await uploadFile(gradesFile, path, { acceptedTypes: ['.pdf'] });
      }

      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Submission successful! Awaiting verification.');
      handleCloseAndReset();

    } catch (error: any) {
      toast.error('Submission failed.');
      setIsLoading(false); 
    }
  };

  // Alert Logic
  const showAdminAlert = hasSubmission && (isResubmit || status === 'Approved');
  
  let alertMessage = adminComment || 'No comment provided.';
  if (status === 'Approved') alertMessage = APPROVED_MESSAGE;

  return (
    <Modal open={isOpen} onOpenChange={handleCloseAndReset}>
      <ModalContent size="2xl">
        <ModalHeader>
          <ModalTitle>
            Grade Submission: {yearLabels[semester.year] || `${semester.year}th Year`}
            , {semester.semester}
          </ModalTitle>
          <p className="text-sm text-gray-500 font-normal mt-1">
             Academic Year: <span className="font-semibold text-dost-title">{semester.academicYear || 'N/A'}</span>
          </p>
        </ModalHeader>
        
        <ModalBody className="space-y-6 max-h-[70vh] overflow-y-auto scrollbar-thin">
          
          {/* 1. Metadata Banner */}
          

          {/* 2. Admin Feedback Loop */}
          {showAdminAlert && (
            <AdminCommentAlert status={status} comment={alertMessage} />
          )}

          {/* 3. Smart Form */}
          <SubmissionForm
            semester={semester}
            submission={submission}
            regForm={regForm}
            setRegForm={setRegForm}
            gradesFile={gradesFile}
            setGradesFile={setGradesFile}
            // Logic Props for Smart Validation
            isReadOnly={!isEditing}
            isResubmit={isResubmit}
            adminComment={adminComment}
          />

          {/* 4. Confirmation Checkbox (Only in Edit Mode) */}
          {isEditing && (
             <div className="pt-4 border-t">
                <Checkbox
                    label="I confirm that the uploaded documents are correct, clear, and authentic."
                    checked={isConfirmed}
                    onChange={(e) => setIsConfirmed(e.target.checked)}
                />
             </div>
          )}

          {hasSubmission && !isEditing && (
             <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="flex flex-col gap-1">
                     <span className="text-xs font-semibold text-gray-500 uppercase">Current Status</span>
                     <div><StatusBadge status={status} /></div>
                 </div>
                 <div className="flex flex-col gap-1">
                     <span className="text-xs font-semibold text-gray-500 uppercase">Date Submitted</span>
                     <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                         <Calendar className="h-4 w-4 text-gray-500" />
                         {submission ? formatDate(submission.dateSubmitted) : 'N/A'}
                     </div>
                 </div>
             </div>
          )}

        </ModalBody>
        
        <ModalFooter>
          {isEditing ? (
            /* EDIT MODE FOOTER */
            <>
              <ModalClose asChild>
                <Button type="button" variant="outline" disabled={isLoading}>
                  Cancel
                </Button>
              </ModalClose>
              <Button
                type="button"
                onClick={handleSubmit} 
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isResubmit ? 'Submit Corrections' : 'Submit Grades'}
              </Button>
            </>
          ) : (
            /* VIEW MODE FOOTER */
            <>
              <ModalClose asChild>
                <Button variant="outline">Close</Button>
              </ModalClose>
              
              {status === 'Pending' && (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Response
                </Button>
              )}
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}