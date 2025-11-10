'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FileUpload } from '@/components/ui/file-upload';
import { useFileUpload } from '@/hooks/useFileUpload';
import type { SemesterAvailability, GradeSubmission } from '@/types'; 
import { toast } from '@/components/ui/toaster';
import { CheckCircle, FileText } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

// --- NEW: Read-only component for valid files ---
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
  onSuccess: () => void;
  submission: GradeSubmission | null; // <-- MODIFICATION: Accept submission data
}

export function SubmissionForm({ semester, onSuccess, submission }: SubmissionFormProps) {
  const [regForm, setRegForm] = useState<File | null>(null);
  const [gradesFile, setGradesFile] = useState<File | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const scholarId = 'mock-scholar-id'; 
  const { uploadFile } = useFileUpload('grade-submissions');

  // --- MODIFICATION: Logic for resubmission ---
  const isResubmit = submission && submission.status === 'Resubmit';
  const comment = submission?.adminComment?.toLowerCase() || '';
  
  // Show if NOT resubmit, OR if resubmit AND the comment mentions it
  const showRegForm = !isResubmit || (isResubmit && (comment.includes('registration') || comment.includes('form 5')));
  const showGradesForm = !isResubmit || (isResubmit && (comment.includes('grades') || comment.includes('tor')));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // --- MODIFICATION: Check only visible fields ---
    if ((showRegForm && !regForm) || (showGradesForm && !gradesFile) || !isConfirmed) {
      toast.error('Please upload all required documents and confirm.');
      return;
    }
    
    setIsLoading(true);
    toast.loading('Submitting your documents...');

    try {
      // --- MODIFICATION: Get existing URLs if they exist ---
      let regFormUrl = submission?.registrationFormUrl || null;
      let gradesUrl = submission?.copyOfGradesUrl || null;

      // --- MODIFICATION: Only upload if the field is shown AND a new file is provided ---
      if (showRegForm && regForm) {
        const regFormPath = `${scholarId}/${semester.year}-${semester.semester}-regform.${regForm.name.split('.').pop()}`;
        regFormUrl = await uploadFile(regForm, regFormPath, { acceptedTypes: ['.pdf'] });
      }

      if (showGradesForm && gradesFile) {
        const gradesPath = `${scholarId}/${semester.year}-${semester.semester}-grades.${gradesFile.name.split('.').pop()}`;
        gradesUrl = await uploadFile(gradesFile, gradesPath, { acceptedTypes: ['.pdf'] });
      }
      
      if (!regFormUrl || !gradesUrl) {
        throw new Error('File upload failed. Please ensure both documents are provided.');
      }

      console.log('Registration Form URL:', regFormUrl);
      console.log('Grades URL:', gradesUrl);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Submission successful! Awaiting verification.');
      onSuccess();

    } catch (error: any) {
      toast.error(error.message || 'Submission failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* --- MODIFICATION: Conditional Rendering --- */}
      {showRegForm ? (
        <FileUpload
          label={`𝐎𝐟𝐟𝐢𝐜𝐢𝐚𝐥 𝐑𝐞𝐠𝐢𝐬𝐭𝐫𝐚𝐭𝐢𝐨𝐧 𝐅𝐨𝐫𝐦 𝐟𝐨𝐫 (${semester.semester})`}
          helperText="Upload your scanned copy of the official Registration Form (Form 5) for this semester."
          onChange={setRegForm}
          accept="application/pdf"
          maxSizeMB={10}
          required
        />
      ) : (
        <FileDisplayReadOnly 
          label={`𝐎𝐟𝐟𝐢𝐜𝐢𝐚𝐥 𝐑𝐞𝐠𝐢𝐬𝐭𝐫𝐚𝐭𝐢𝐨𝐧 𝐅𝐨𝐫𝐦 𝐟𝐨𝐫 (${semester.semester})`}
          fileName={submission?.registrationForm || 'File Approved'}
        />
      )}

      {showGradesForm ? (
        <FileUpload
          label="𝐓𝐎𝐑 𝐨𝐫 𝐂𝐞𝐫𝐭𝐢𝐟𝐢𝐞𝐝 𝐂𝐨𝐦𝐩𝐥𝐞𝐭𝐞 𝐆𝐫𝐚𝐝𝐞𝐬"
          helperText="(continues grades from First semester of your 1st year up to Second semester or Midyear AY 2024-2025)"
          onChange={setGradesFile}
          accept="application/pdf"
          maxSizeMB={10}
          required
        />
      ) : (
         <FileDisplayReadOnly 
          label="𝐓𝐎𝐑 𝐨𝐫 𝐂𝐞𝐫𝐭𝐢𝐟𝐢𝐞𝐝 𝐂𝐨𝐦𝐩𝐥𝐞𝐭𝐞 𝐆𝐫𝐚𝐝𝐞𝐬"
          fileName={submission?.copyOfGrades || 'File Approved'}
        />
      )}

      <Checkbox
        label="I confirm that the uploaded documents are correct and legible."
        checked={isConfirmed}
        onChange={(e) => setIsConfirmed(e.target.checked)}
        required
      />
      {/* This div is now correctly inside the scrollable ModalBody */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="submit" isLoading={isLoading} disabled={!isConfirmed || (showRegForm && !regForm) || (showGradesForm && !gradesFile)}>
          Submit
        </Button>
      </div>
    </form>
  );
}