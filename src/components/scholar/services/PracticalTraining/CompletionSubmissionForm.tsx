'use client';

import { FileUpload } from '@/components/ui/file-upload';
import { FileDisplayReadOnly } from '@/components/shared/FileDisplayReadOnly';

interface FormProps {
  form126: File | null; setForm126: (f: File | null) => void;
  form127: File | null; setForm127: (f: File | null) => void;
  form128: File | null; setForm128: (f: File | null) => void;
  dtr: File | null; setDtr: (f: File | null) => void;
  certCompletion: File | null; setCertCompletion: (f: File | null) => void;
  isReadOnly?: boolean;
  isResubmit?: boolean;
  adminComment?: string;
}

export function CompletionSubmissionForm({
  form126, setForm126,
  form127, setForm127,
  form128, setForm128,
  dtr, setDtr,
  certCompletion, setCertCompletion,
  isReadOnly, isResubmit, adminComment = ''
}: FormProps) {

  const checkVisibility = (keywords: string[]) => {
    if (!isResubmit) return { isEditable: !isReadOnly };
    const hasMatch = keywords.some(k => adminComment.toLowerCase().includes(k));
    return { isEditable: hasMatch }; 
  };

  const showForm126 = checkVisibility(['126']);
  const showForm127 = checkVisibility(['127']);
  const showForm128 = checkVisibility(['128']);
  const showDtr = checkVisibility(['dtr', 'daily time record']);
  const showCert = checkVisibility(['certificate', 'completion', 'proof']);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="space-y-4">
            {showForm126.isEditable ? (
                <FileUpload
                    label="Form 126"
                    helperText="PTP Assignment Sheet"
                    onChange={setForm126}
                    required
                />
            ) : (
                <FileDisplayReadOnly label="Form 126" fileName="Submitted File" />
            )}

            {showForm127.isEditable ? (
                <FileUpload
                    label="Form 127"
                    helperText="Student Evaluation"
                    onChange={setForm127}
                    required
                />
            ) : (
                <FileDisplayReadOnly label="Form 127" fileName="Submitted File" />
            )}
         </div>

         <div className="space-y-4">
            {showForm128.isEditable ? (
                <FileUpload
                    label="Form 128"
                    helperText="Supervisor Evaluation"
                    onChange={setForm128}
                    required
                />
            ) : (
                <FileDisplayReadOnly label="Form 128" fileName="Submitted File" />
            )}

            {showDtr.isEditable ? (
                <FileUpload
                    label="Daily Time Record (DTR)"
                    helperText="Signed DTR"
                    onChange={setDtr}
                    required
                />
            ) : (
                <FileDisplayReadOnly label="Daily Time Record (DTR)" fileName="Submitted File" />
            )}
         </div>
      </div>

      <div className="space-y-4">
         {showCert.isEditable ? (
            <FileUpload
                label="Certificate of Completion"
                helperText="Issued by the Host Training Establishment"
                onChange={setCertCompletion}
                required
            />
        ) : (
            <FileDisplayReadOnly label="Certificate of Completion" fileName="Submitted File" />
        )}
      </div>
    </div>
  );
}