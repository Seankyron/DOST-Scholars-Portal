'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FileUpload } from '@/components/ui/file-upload';
import { useFileUpload } from '@/hooks/useFileUpload';
import type { SemesterAvailability } from '@/types/curriculum';
import { toast } from '@/components/ui/toaster';

interface SubmissionFormProps {
  semester: SemesterAvailability;
  onSuccess: () => void;
}

export function SubmissionForm({ semester, onSuccess }: SubmissionFormProps) {
  const [regForm, setRegForm] = useState<File | null>(null);
  const [gradesFile, setGradesFile] = useState<File | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // In a real app, you'd get the scholar ID from useScholar() hook
  const scholarId = 'mock-scholar-id'; 
  const { uploadFile } = useFileUpload('grade-submissions');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm || !gradesFile || !isConfirmed) {
      toast.error('Please upload all required documents and confirm.');
      return;
    }
    
    setIsLoading(true);
    toast.loading('Submitting your documents...');

    try {
      // 1. Upload Registration Form
      const regFormPath = `${scholarId}/${semester.year}-${semester.semester}-regform.${regForm.name.split('.').pop()}`;
      const regFormUrl = await uploadFile(regForm, regFormPath, { acceptedTypes: ['.pdf'] });

      // 2. Upload Grades
      const gradesPath = `${scholarId}/${semester.year}-${semester.semester}-grades.${gradesFile.name.split('.').pop()}`;
      const gradesUrl = await uploadFile(gradesFile, gradesPath, { acceptedTypes: ['.pdf'] });

      if (!regFormUrl || !gradesUrl) {
        throw new Error('File upload failed. Please try again.');
      }

      // 3. TODO: Save URLs to your database (e.g., in 'grade_submissions' table)
      console.log('Registration Form URL:', regFormUrl);
      console.log('Grades URL:', gradesUrl);
      
      // Simulate API call
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
      <FileUpload
        label="Upload Scanned Copy of Registration Form or Form 5"
        onChange={setRegForm}
        accept="application/pdf"
        maxSizeMB={10}
        required
      />
      <FileUpload
        label="Upload Complete Copy of Grades"
        onChange={setGradesFile}
        accept="application/pdf"
        maxSizeMB={10}
        required
      />
      <Checkbox
        label="I confirm that the uploaded documents are correct*"
        checked={isConfirmed}
        onChange={(e) => setIsConfirmed(e.target.checked)}
        required
      />
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="submit" isLoading={isLoading} disabled={!isConfirmed || !regForm || !gradesFile}>
          Submit
        </Button>
      </div>
    </form>
  );
}