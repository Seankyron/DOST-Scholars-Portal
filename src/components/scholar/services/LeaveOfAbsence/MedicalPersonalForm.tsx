'use client';

import { FileUpload } from '@/components/ui/file-upload';
import { AlertCircle } from 'lucide-react';

interface FormProps {
  appForm: File | null; setAppForm: (f: File | null) => void;
  univApproval: File | null; setUnivApproval: (f: File | null) => void;
  grades: File | null; setGrades: (f: File | null) => void;
  medCert: File | null; setMedCert: (f: File | null) => void;
  otherDocs: File | null; setOtherDocs: (f: File | null) => void;
  isReadOnly?: boolean;
}

export function MedicalPersonalForm({
  setAppForm, setUnivApproval, setGrades,  setMedCert, setOtherDocs, isReadOnly
}: FormProps) {
  // Helper to conditionally render
  if (isReadOnly) {
    return <div className="text-center py-8 text-gray-500">File viewing is not yet implemented for this demo.</div>;
  }

  return (
    <div className="space-y-6">
       <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">General Requirements</h3>
        <FileUpload
            label="Application Form for Leave of Absence"
            helperText="Signed application form (Download template from panel)"
            onChange={setAppForm}
            required
        />
        <FileUpload
            label="University Approval of LOA"
            helperText="Must indicate duration and reason, signed by university authority"
            onChange={setUnivApproval}
            required
        />
        <FileUpload
            label="Certification of Grades"
            helperText="For all semesters enrolled (from 1st Year, 1st Sem to present)"
            onChange={setGrades}
            required
        />
        
        <FileUpload
            label="Medical Certificate"
            helperText="For health-related reasons"
            onChange={setMedCert}
        />
        <FileUpload
            label="Other Supporting Documents"
            helperText="Any other relevant documents to support your request"
            onChange={setOtherDocs}
        />
      </div>
    </div>
  );
}