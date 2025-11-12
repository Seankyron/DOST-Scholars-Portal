'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { FileUpload } from '@/components/ui/file-upload';
import type { SemesterAvailability, GradeSubmission } from '@/types'; 
import { CheckCircle} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

function FileDisplayReadOnly({ label, fileName }: { label: string; fileName: string; }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div className={cn(
        'relative border-2 border-dashed rounded-lg p-4',
        'border-green-500 bg-green-50/50' // Success state
      )}>
        <div className="flex items-center gap-3 min-w-0">
          <CheckCircle className="h-8 w-8 text-green-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900 truncate">{fileName}</p>
            <p className="text-xs text-green-700">
              This file has been approved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SubmissionFormProps {
  semester: SemesterAvailability;
  submission: GradeSubmission | null;
  regForm: File | null;
  setRegForm: (file: File | null) => void;
  gradesFile: File | null;
  setGradesFile: (file: File | null) => void;
  isConfirmed: boolean;
  setIsConfirmed: (value: boolean) => void;
}

export function SubmissionForm({
  semester,
  submission,
  regForm,
  setRegForm,
  gradesFile,
  setGradesFile,
  isConfirmed,
  setIsConfirmed,
}: SubmissionFormProps) {
  

  const isResubmit = submission && submission.status === 'Resubmit';
  const comment = submission?.adminComment?.toLowerCase() || '';
  
  const showRegForm = !isResubmit || (isResubmit && (comment.includes('registration') || comment.includes('form 5')));
  const showGradesForm = !isResubmit || (isResubmit && (comment.includes('grades') || comment.includes('tor')));


  return (
    <div className="space-y-6">
      
      {showRegForm ? (
        <FileUpload
          label={`Official Registration From for ${semester.semester}`}
          helperText="Upload your scanned copy of the official Registration Form (Form 5) for this semester."
          onChange={setRegForm} // Use prop
          accept="application/pdf"
          maxSizeMB={10}
          required
        />
      ) : (
        <FileDisplayReadOnly 
          label={`Official Registration From for ${semester.semester}`}
          fileName={submission?.registrationForm || 'File Approved'}
        />
      )}

      {showGradesForm ? (
        <FileUpload
          label="TOR or Certified Complete Grades"
          helperText="Upload your scanned copy of your continues grades from First semester of your 1st year up to current semester."
          onChange={setGradesFile} // Use prop
          accept="application/pdf"
          maxSizeMB={10}
          required
        />
      ) : (
         <FileDisplayReadOnly 
          label="TOR or Certified Complete Grades"
          fileName={submission?.copyOfGrades || 'File Approved'}
        />
      )}

      <Checkbox
        label="I confirm that the uploaded documents are correct and legible."
        checked={isConfirmed} // Use prop
        onChange={(e) => setIsConfirmed(e.target.checked)} // Use prop
        required
      />      
    </div>
  );
}