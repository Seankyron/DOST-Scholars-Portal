'use client';

import { FileUpload } from '@/components/ui/file-upload';
import { FileDisplayReadOnly } from '@/components/shared/FileDisplayReadOnly';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';

interface FormProps {
  destination: string; setDestination: (v: string) => void;
  departureDate: string; setDepartureDate: (v: string) => void;
  returnDate: string; setReturnDate: (v: string) => void;

  // New props
  isLateFiling: boolean;
  delayReason: string; 
  setDelayReason: (v: string) => void;
  
  requestLetter: File | null; setRequestLetter: (f: File | null) => void;
  deedOfUndertaking: File | null; setDeedOfUndertaking: (f: File | null) => void;
  coMakerEmploy: File | null; setCoMakerEmploy: (f: File | null) => void;
  coMakerId: File | null; setCoMakerId: (f: File | null) => void;
  requestForm: File | null; setRequestForm: (f: File | null) => void;
  
  isReadOnly?: boolean;
  isResubmit?: boolean;
  adminComment?: string;
}

export function OtherPurposesForm({
  destination, setDestination,
  departureDate, setDepartureDate,
  returnDate, setReturnDate,
  isLateFiling, delayReason, setDelayReason,
  requestLetter, setRequestLetter,
  deedOfUndertaking, setDeedOfUndertaking,
  coMakerEmploy, setCoMakerEmploy,
  coMakerId, setCoMakerId,
  requestForm, setRequestForm,
  isReadOnly, isResubmit, adminComment = ''
}: FormProps) {

  const checkVisibility = (keywords: string[]) => {
    if (!isResubmit) return { isEditable: !isReadOnly };
    const hasMatch = keywords.some(k => adminComment.toLowerCase().includes(k));
    return { isEditable: hasMatch }; 
  };

  const showLetter = checkVisibility(['letter', 'regional director']);
  const showDeed = checkVisibility(['deed', 'undertaking']);
  const showCoMakerDocs = checkVisibility(['co-maker', 'employment', 'itr', 'id']);
  const showForm = checkVisibility(['request form']);

  return (
    <div className="space-y-6">
      {/* Travel Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
         <div className="md:col-span-2">
            <Input 
                label="Destination" 
                placeholder="Country / City" 
                value={destination} 
                onChange={(e) => setDestination(e.target.value)}
                disabled={isReadOnly}
                required
            />
         </div>
         <Input 
            type="date" 
            label="Departure Date" 
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            disabled={isReadOnly}
            required
         />
         <Input 
            type="date" 
            label="Return Date" 
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            disabled={isReadOnly}
            required
         />

         {/* Cause of Delay Section - Conditionally Rendered */}
         {isLateFiling && (
           <div className="md:col-span-2 bg-orange-50 p-3 rounded-md border border-orange-200 mt-2">
             <div className="flex items-center gap-2 mb-2 text-orange-700">
               <AlertTriangle className="h-4 w-4" />
               <span className="text-sm font-semibold">Late Submission Detected</span>
             </div>
             <p className="text-xs text-gray-600 mb-2">
               Requests must be submitted at least 2 weeks before departure. Please provide a reason for the delay.
             </p>
             <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Cause of Delay <span className="text-red-500">*</span>
             </Label>
             <Textarea 
               value={delayReason}
               onChange={(e) => setDelayReason(e.target.value)}
               placeholder="Please explain why the request was not submitted 2 weeks in advance..."
               className="bg-white"
               disabled={isReadOnly}
             />
           </div>
         )}
      </div>

      {/* Documents */}
      <div className="space-y-4">
        {showLetter.isEditable ? (
            <FileUpload
                label="Letter to Regional Director"
                helperText="Addressed to Ms. Emelita P. Bagsit, indicating purpose, destination, and dates."
                onChange={setRequestLetter}
                required
            />
        ) : (
            <FileDisplayReadOnly label="Letter to Regional Director" fileName="Submitted File" />
        )}

        {showDeed.isEditable ? (
            <FileUpload
                label="Notarized Deed of Undertaking"
                helperText="Signed by Scholar and Co-maker"
                onChange={setDeedOfUndertaking}
                required
            />
        ) : (
            <FileDisplayReadOnly label="Deed of Undertaking" fileName="Submitted File" />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {showCoMakerDocs.isEditable ? (
                <FileUpload
                    label="Co-maker's COE / ITR"
                    helperText="Certificate of Employment or ITR"
                    onChange={setCoMakerEmploy}
                    required
                />
            ) : (
                <FileDisplayReadOnly label="Co-maker's COE / ITR" fileName="Submitted File" />
            )}

            {showCoMakerDocs.isEditable ? (
                <FileUpload
                    label="Co-maker's Valid ID"
                    helperText="Photocopy of ID"
                    onChange={setCoMakerId}
                    required
                />
            ) : (
                <FileDisplayReadOnly label="Co-maker's Valid ID" fileName="Submitted File" />
            )}
        </div>

        {showForm.isEditable ? (
            <FileUpload
                label="Completed Request Form"
                helperText="Signed request form template"
                onChange={setRequestForm}
                required
            />
        ) : (
            <FileDisplayReadOnly label="Completed Request Form" fileName="Submitted File" />
        )}
      </div>
    </div>
  );
}