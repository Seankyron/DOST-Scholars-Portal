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
  DTRUrl?: string;
  certUrl?: string;
  form126Url?: string;
  form127Url?: string;
  form128Url?: string;
}

export function CompletionSubmissionForm({
  form126, setForm126,
  form127, setForm127,
  form128, setForm128,
  dtr, setDtr,
  certCompletion, setCertCompletion,
  DTRUrl, certUrl, form126Url, form127Url, form128Url,
  isReadOnly, isResubmit, adminComment = ''
}: FormProps) {
  const userStr = typeof window !== 'undefined' ? sessionStorage.getItem('user') : null;
  const user = userStr ? JSON.parse(userStr) : null;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const DTRFKUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${DTRUrl}.pdf`;
  const certFKUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${certUrl}.pdf`;
  const form126FKUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${form126Url}.pdf`;
  const form127FKUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${form127Url}.pdf`;
  const form128FKUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${form128Url}.pdf`;

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
                <FileDisplayReadOnly label="Form 126"
                fileName={`${user.spas_id} – Form 126.pdf`}
                fileUrl={form126FKUrl} />
            )}

            {showForm127.isEditable ? (
                <FileUpload
                    label="Form 127"
                    helperText="Student Evaluation"
                    onChange={setForm127}
                    required
                />
            ) : (
                <FileDisplayReadOnly label="Form 127"
                fileName={`${user.spas_id} – Form 127.pdf`}
                fileUrl={form127FKUrl}/>
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
                <FileDisplayReadOnly label="Form 128"
                fileName={`${user.spas_id} – Form 128.pdf`}
                fileUrl={form128FKUrl}/>
            )}

            {showDtr.isEditable ? (
                <FileUpload
                    label="Daily Time Record (DTR)"
                    helperText="Signed DTR"
                    onChange={setDtr}
                    required
                />
            ) : (
                <FileDisplayReadOnly label="Daily Time Record (DTR)"
                fileName={`${user.spas_id} – DTR.pdf`}
                fileUrl={DTRFKUrl}/>
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
            <FileDisplayReadOnly label="Certificate of Completion"
            fileName={`${user.spas_id} – Certification of Completion.pdf`}
            fileUrl={certFKUrl}/>
        )}
      </div>
    </div>
  );
}