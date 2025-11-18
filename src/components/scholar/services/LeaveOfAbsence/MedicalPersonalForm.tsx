'use client';

import { FileUpload } from '@/components/ui/file-upload';
import { FileDisplayReadOnly } from '@/components/shared/FileDisplayReadOnly'; // Import from shared

interface FormProps {
  appForm: File | null; setAppForm: (f: File | null) => void;
  univApproval: File | null; setUnivApproval: (f: File | null) => void;
  grades: File | null; setGrades: (f: File | null) => void;
  medCert: File | null; setMedCert: (f: File | null) => void;
  otherDocs: File | null; setOtherDocs: (f: File | null) => void;
  isReadOnly?: boolean;
  isResubmit?: boolean;
  adminComment?: string;
}

export function MedicalPersonalForm({
  setAppForm, setUnivApproval, setGrades, setMedCert, setOtherDocs, 
  isReadOnly, isResubmit, adminComment = ''
}: FormProps) {
  
  const checkVisibility = (keywords: string[]) => {
    if (!isResubmit) return { isEditable: !isReadOnly };
    const hasMatch = keywords.some(k => adminComment.toLowerCase().includes(k));
    return { isEditable: hasMatch }; 
  };

  const showAppForm = checkVisibility(['application', 'form', 'loa']);
  const showUnivApproval = checkVisibility(['university', 'approval']);
  const showGrades = checkVisibility(['grades', 'certification']);
  const showMedCert = checkVisibility(['medical', 'certificate']);

  return (
    <div className="space-y-6">
       <div className="space-y-4">
        
        {showAppForm.isEditable ? (
           <FileUpload
              label="Application Form for Leave of Absence"
              helperText="Signed application form (Download template from panel)"
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
        {showMedCert.isEditable ? (
            <FileUpload
                label="Medical Certificate"
                helperText="For health-related reasons"
                onChange={setMedCert}
            />
        ) : (
            <FileDisplayReadOnly label="Medical Certificate" fileName="Submitted File" />
        )}

        {/* Always allow adding supporting docs in edit mode */}
        {!isReadOnly && (
            <FileUpload
                label="Other Supporting Documents"
                helperText="Any other relevant documents to support your request"
                onChange={setOtherDocs}
            />
        )}
      </div>
    </div>
  );
}