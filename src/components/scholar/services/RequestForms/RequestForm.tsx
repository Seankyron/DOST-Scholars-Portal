'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FileUpload } from '@/components/ui/file-upload';
import { FileDisplayReadOnly } from '@/components/shared/FileDisplayReadOnly';
import type { RequestFormType } from '@/types/services';

interface RequestFormProps {
  type: RequestFormType;
  reason: string;
  setReason: (v: string) => void;
  details: string;
  setDetails: (v: string) => void;
  
  // File State
  file: File | null;
  setFile: (f: File | null) => void;
  
  isConfirmed: boolean;
  setIsConfirmed: (v: boolean) => void;
  isReadOnly?: boolean;
}

export function RequestForm({
  type,
  reason, setReason,
  details, setDetails,
  file, setFile,
  isConfirmed, setIsConfirmed,
  isReadOnly
}: RequestFormProps) {
  
  const isEndorsement = type === 'Letter of Endorsement';

  return (
    <div className="space-y-6">
      {/* Context Header */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h4 className="text-xs font-semibold text-dost-title uppercase tracking-wider mb-1">
          Selected Document
        </h4>
        <p className="text-lg font-bold text-gray-900">{type}</p>
      </div>

      <div className="space-y-4">
        {/* 1. Text Fields */}
        {isEndorsement && (
           <div className="space-y-2">
                <Label htmlFor="addressee">
                    Addressee <span className="text-red-500">*</span>
                </Label>
                <Input 
                    id="addressee"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Name, Position, Company/School"
                    disabled={isReadOnly}
                    required
                />
           </div>
        )}

        <div className="space-y-2">
            <Label htmlFor="brief-reason">
                Brief Reason <span className="text-red-500">*</span>
            </Label>
            <Textarea
                id="brief-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please state the specific purpose of this request..."
                disabled={isReadOnly}
                className="bg-white min-h-[100px]"
                maxLength={500}
            />
        </div>

        {/* 2. File Upload / Read Only Display */}
        <div className="space-y-2">
             <Label>Supporting Document (Optional)</Label>
             {isReadOnly ? (
                /* --- THIS IS THE READ ONLY DISPLAY --- */
                <FileDisplayReadOnly 
                   label="Submitted Document"
                   fileName={file ? file.name : "No file attached"}
                   // In a real app, you'd pass the fileUrl here
                   className={!file ? "opacity-50" : ""} 
                />
             ) : (
                /* --- THIS IS THE UPLOAD INPUT --- */
                <FileUpload 
                   label=""
                   helperText="Attach a formal letter or any supporting document."
                   onChange={setFile}
                   value={file}
                />
             )}
        </div>

        {/* 3. Confirmation Checkbox */}
        {!isReadOnly && (
            <div className="pt-4 border-t mt-4">
              <Checkbox
                label="I confirm that the uploaded documents are correct."
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
              />
            </div>
        )}
      </div>
    </div>
  );
}