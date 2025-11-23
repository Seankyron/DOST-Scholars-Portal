'use client';

import { useState, useEffect } from 'react';
import { FileUpload } from '@/components/ui/file-upload';
import { FileDisplayReadOnly } from '@/components/shared/FileDisplayReadOnly';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'; // Assuming you have this or standard input


interface FormProps {
  grades: File | null; setGrades: (f: File | null) => void;
  replySlip: File | null; setReplySlip: (f: File | null) => void;
  plan: string; setPlan: (s: string) => void; // Added plan state
  isReadOnly?: boolean;
  isResubmit?: boolean;
  adminComment?: string;
}

export function ReferralRequestForm({
  grades, setGrades,
  replySlip, setReplySlip,
  plan, setPlan,
  isReadOnly, isResubmit, adminComment = ''
}: FormProps) {
  
  const checkVisibility = (keywords: string[]) => {
    if (!isResubmit) return { isEditable: !isReadOnly };
    const hasMatch = keywords.some(k => adminComment.toLowerCase().includes(k));
    return { isEditable: hasMatch }; 
  };

  const showGrades = checkVisibility(['grades', 'checklist', 'certified']);
  const showReplySlip = checkVisibility(['reply', 'slip']);

  // Options derived from user request
  const planOptions = [
    "I will undertake Practical Training Program.",
    "I have required OJT during Midyear under curriculum and will undertake the Practical Training Program.",
    "I cannot participate in the training."
  ];

  return (
    <div className="space-y-8">
       {/* 1. Practical Training Plan Survey */}
       <div className="space-y-3 border p-4 rounded-lg bg-blue-50/50 border-blue-100">
          <Label className="text-base font-semibold text-dost-title">
            What are your plans for the Practical Training Program? <span className="text-red-500">*</span>
          </Label>
          
          {isReadOnly ? (
             <div className="p-3 bg-gray-50 rounded-md text-sm font-medium text-gray-700 border">
                {plan || "No option selected"}
             </div>
          ) : (
            <RadioGroup 
              value={plan} 
              onValueChange={setPlan}
              className="flex flex-col space-y-2 mt-2"
            >
              {planOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option} className="font-normal cursor-pointer text-gray-700">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
       </div>

       {/* 2. Document Uploads */}
       <div className="space-y-6">
        {/* Grades Upload */}
        {showGrades.isEditable ? (
           <FileUpload
              label="Certified Complete Grades"
              helperText="From 1st sem, 1st year to latest"
              onChange={setGrades}
              required
           />
        ) : (
           <FileDisplayReadOnly label="Certified Complete Grades" fileName="Submitted File" />
        )}

        {/* Reply Slip Upload with Download Button */}
        <div>
            <div className="flex justify-between items-end mb-2">
                <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                   Accomplished Reply Slip {showReplySlip.isEditable && <span className="text-red-500">*</span>}
                </Label>
                
    
            </div>

            {showReplySlip.isEditable ? (
                <FileUpload
                    label="" // Label handled above to include button
                    helperText="Signed reply slip for PTP"
                    onChange={setReplySlip}
                    // If we customized the label above, we might need to hide the internal label of FileUpload or pass undefined
                />
            ) : (
                <FileDisplayReadOnly label="" fileName="Submitted File" />
            )}
        </div>
      </div>  
    </div>
  );
}