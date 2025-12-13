'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/ui/file-upload';
import { FileDisplayReadOnly } from '@/components/shared/FileDisplayReadOnly';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface FormProps {
  grades: File | null; 
  setGrades: (f: File | null) => void;
  replySlip: File | null; 
  setReplySlip: (f: File | null) => void;
  plan: string; 
  setPlan: (s: string) => void;
  isReadOnly?: boolean;
  isResubmit?: boolean;
  adminComment?: string;
  hasRecentGrade?: boolean;
  gradeUrl?: string;
  replySlipUrl?: string;
}

export function ReferralRequestForm({
  grades, setGrades,
  replySlip, setReplySlip,
  plan, setPlan,
  gradeUrl,
  replySlipUrl,
  isReadOnly, isResubmit, hasRecentGrade, adminComment = ''
}: FormProps) {
  const userStr = typeof window !== 'undefined' ? sessionStorage.getItem('user') : null;
  const user = userStr ? JSON.parse(userStr) : null;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const gradeFKUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${gradeUrl}.pdf`;
  const replySlipFKUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${replySlipUrl}.pdf`;

  const checkVisibility = (keywords: string[]) => {
    if (!isResubmit) return { isEditable: !isReadOnly };
    
    const hasMatch = keywords.some(k => adminComment.toLowerCase().includes(k));
    return { isEditable: hasMatch }; 
  };

  const showGrades = checkVisibility(['grades', 'checklist', 'certified']);
  const showReplySlip = checkVisibility(['reply', 'slip']);

  const planOptions = [
    { value: "undertake_ptp", label: "I will undertake 2025 Practical Training Program." },
    { value: "ojt_midyear_and_ptp", label: "I have required OJT during Midyear under curriculum and will undertake the 2025 Practical Training Program." },
    { value: "cannot_participate", label: "I cannot participate in the training." }
  ];

  return (
    <div className="space-y-8">
       {/* 1. Practical Training Plan Survey */}
       <div className="space-y-3 border p-4 rounded-lg bg-blue-50/50 border-blue-100">
          <Label className="text-base font-semibold text-dost-title">
            What are your plans for the 2025 Practical Training Program? <span className="text-red-500">*</span>
          </Label>
          
          {isReadOnly ? (
             <div className="p-3 bg-gray-50 rounded-md text-sm font-medium text-gray-700 border">
                {planOptions.find(o => o.value === plan)?.label || plan || "No option selected"}
             </div>
          ) : (
            <RadioGroup 
              value={plan} 
              onValueChange={setPlan}
              className="flex flex-col space-y-3 mt-2"
            >
              {planOptions.map((option) => (
                <div key={option.value} className="flex items-start space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                  <Label htmlFor={option.value} className="font-normal cursor-pointer text-gray-700 leading-snug">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
       </div>

       {/* 2. Document Uploads */}
       <div className="space-y-6">
        {/* Grades Upload */}
        <div>
            {showGrades.isEditable && !hasRecentGrade ? (
               <FileUpload
                  label="Certified Complete Grades"
                  helperText="From 1st sem, 1st year to latest"
                  onChange={setGrades}
                  required
               />
            ) : (
               <div className="space-y-2">
                 <FileDisplayReadOnly 
                    // RESTORED LABEL HERE
                    label="Certified Complete Grades" 
                    fileName={hasRecentGrade ? "Most Recent Certified Complete Grades from Grade Submission" : "Submitted Grades File"} 
                    fileUrl={gradeFKUrl}
                 />
               </div>
            )}
        </div>

        {/* Reply Slip Upload with Download Button */}
        <div>
            {showReplySlip.isEditable ? (
                <FileUpload
                    label="Accomplished Reply Slip"
                    helperText="Signed reply slip for PTP"
                    onChange={setReplySlip}
                    required
                />
            ) : (
                <FileDisplayReadOnly 
                    // RESTORED LABEL HERE
                    label="Accomplished Reply Slip"
                    fileName={`${user.spas_id} – Reply Slip.pdf`}
                    fileUrl={replySlipFKUrl} 
                />
            )}
        </div>
      </div>  
    </div>
  );
}