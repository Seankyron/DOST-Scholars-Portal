// src/components/scholar/services/SupportFeedback/FeedbackForm.tsx
'use client';

import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FileUpload } from '@/components/ui/file-upload';
import { FileDisplayReadOnly } from '@/components/shared/FileDisplayReadOnly';

interface FeedbackFormProps {
  category: string;
  message: string;
  setMessage: (v: string) => void;
  
  // File State (Optional attachment)
  file: File | null;
  setFile: (f: File | null) => void;
  
  isConfirmed: boolean;
  setIsConfirmed: (v: boolean) => void;
  isReadOnly?: boolean;
}

export function FeedbackForm({
  category,
  message, setMessage,
  file, setFile,
  isConfirmed, setIsConfirmed,
  isReadOnly
}: FeedbackFormProps) {

  return (
    <div className="space-y-6">
      {/* Context Header */}
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
        <h4 className="text-xs font-semibold text-yellow-700 uppercase tracking-wider mb-1">
          Concern Category
        </h4>
        <p className="text-lg font-bold text-gray-900">{category}</p>
      </div>

      <div className="space-y-4">
        {/* Message Field */}
        <div className="space-y-2">
            <Label htmlFor="feedback-message">
                Description / Message <span className="text-red-500">*</span>
            </Label>
            <Textarea
                id="feedback-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please describe your concern, inquiry, or suggestion in detail..."
                disabled={isReadOnly}
                className="bg-white min-h-[150px]"
                maxLength={1000}
            />
        </div>

        {/* Attachment (Optional) */}
        <div className="space-y-2">
             <Label>Screenshot or Supporting Document (Optional)</Label>
             {isReadOnly ? (
                <FileDisplayReadOnly 
                   label=""
                   fileName={file ? file.name : "No attachment"}
                   className={!file ? "opacity-50" : ""}
                />
             ) : (
                <FileUpload 
                   label=""
                   helperText="Upload a screenshot or document if it helps explain your concern."
                   onChange={setFile}
                   value={file}
                   accept=".jpg,.jpeg,.png,.pdf"
                />
             )}
        </div>

        {/* Confirmation Checkbox */}
        {!isReadOnly && (
            <div className="pt-4 border-t mt-4">
              <Checkbox
                label="I confirm that the information provided is true and correct."
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
              />
            </div>
        )}
      </div>
    </div>
  );
}