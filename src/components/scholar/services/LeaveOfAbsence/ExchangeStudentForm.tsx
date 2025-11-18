'use client';

import { FileUpload } from '@/components/ui/file-upload';
import { FileDisplayReadOnly } from '@/components/shared/FileDisplayReadOnly'; // Import from shared

interface FormProps {
  appForm: File | null; setAppForm: (f: File | null) => void;
  univApproval: File | null; setUnivApproval: (f: File | null) => void;
  grades: File | null; setGrades: (f: File | null) => void;
  regForm: File | null; setRegForm: (f: File | null) => void;
  proofAdmission: File | null; setProofAdmission: (f: File | null) => void;
  isReadOnly?: boolean;
  isResubmit?: boolean;
  adminComment?: string;
}

export function ExchangeStudentForm({
  setAppForm, 
  setUnivApproval, 
  setGrades, 
  setRegForm, 
  setProofAdmission,
  isReadOnly,
  isResubmit,
  adminComment = ''
}: FormProps) {

  const checkVisibility = (keywords: string[]) => {
    if (!isResubmit) return { isEditable: !isReadOnly };
    const hasMatch = keywords.some(k => adminComment.toLowerCase().includes(k));
    return { isEditable: hasMatch }; 
  };

  const showAppForm = checkVisibility(['application', 'form', 'loa']);
  const showUnivApproval = checkVisibility(['university', 'approval']);
  const showGrades = checkVisibility(['grades', 'certification']);
  const showRegForm = checkVisibility(['registration', 'form 5']);
  const showProof = checkVisibility(['proof', 'admission', 'acceptance']);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        
        {showAppForm.isEditable ? (
            <FileUpload
                label="Application Form for Leave of Absence"
                helperText="Signed application form"
                onChange={setAppForm}
                required
            />
        ) : (
            <FileDisplayReadOnly label="Application Form for Leave of Absence" fileName="Submitted File" />
        )}

        {showUnivApproval.isEditable ? (
            <FileUpload
                label="University Approval of LOA"
                helperText="Must indicate duration and reason, signed by university authority"
                onChange={setUnivApproval}
                required
            />
        ) : (
            <FileDisplayReadOnly label="University Approval of LOA" fileName="Submitted File" />
        )}

        {showGrades.isEditable ? (
            <FileUpload
                label="Certification of Grades"
                helperText="For all semesters enrolled (from 1st Year, 1st Sem to present)"
                onChange={setGrades}
                required
            />
        ) : (
            <FileDisplayReadOnly label="Certification of Grades" fileName="Submitted File" />
        )}
      </div>

      <div className="space-y-4">
        
        {showRegForm.isEditable ? (
            <FileUpload
                label="Registration Form / Form 5"
                helperText="For the applicable semester under Exchange Student Program"
                onChange={setRegForm}
                required
            />
        ) : (
            <FileDisplayReadOnly label="Registration Form / Form 5" fileName="Submitted File" />
        )}

        {showProof.isEditable ? (
            <FileUpload
                label="Proof of Admission"
                helperText="Acceptance letter from host university"
                onChange={setProofAdmission}
                required
            />
        ) : (
            <FileDisplayReadOnly label="Proof of Admission" fileName="Submitted File" />
        )}
      </div>
    </div>
  );
}