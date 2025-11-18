'use client';

import { FileUpload } from '@/components/ui/file-upload';

interface FormProps {
  appForm: File | null; setAppForm: (f: File | null) => void;
  univApproval: File | null; setUnivApproval: (f: File | null) => void;
  grades: File | null; setGrades: (f: File | null) => void;
  // --- Added missing props to match LeaveOfAbsenceModal ---
  financialBreakdown: File | null; setFinancialBreakdown: (f: File | null) => void;
  regForm: File | null; setRegForm: (f: File | null) => void;
  proofAdmission: File | null; setProofAdmission: (f: File | null) => void;
  isReadOnly?: boolean;
}

export function ExchangeStudentForm({
  setAppForm, 
  setUnivApproval, 
  setGrades, 
  setFinancialBreakdown,
  setRegForm, 
  setProofAdmission,
  isReadOnly
}: FormProps) {

  if (isReadOnly) {
    return <div className="text-center py-8 text-gray-500">File viewing is not yet implemented for this demo.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">General Requirements</h3>
        <FileUpload
            label="Application Form for Leave of Absence"
            helperText="Signed application form"
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
            label="Registration Form / Form 5"
            helperText="For the applicable semester under Exchange Student Program"
            onChange={setRegForm}
            required
        />
        <FileUpload
            label="Proof of Admission"
            helperText="Acceptance letter from host university"
            onChange={setProofAdmission}
            required
        />
      </div>
    </div>
  );
}