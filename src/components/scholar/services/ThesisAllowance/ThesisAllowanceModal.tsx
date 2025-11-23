'use client';

import { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  ModalClose,
} from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Calendar } from 'lucide-react';
import { AdminCommentAlert } from '@/components/shared/AdminCommenAlert';
import { StatusBadge } from '@/components/shared/StatusBadge'; 
import { formatDate } from '@/lib/utils/date'; 
import { useFileUpload } from '@/hooks/useFileUpload';
import { FileUpload } from '@/components/ui/file-upload';
import { FileDisplayReadOnly } from '@/components/shared/FileDisplayReadOnly'; // Imported
import { toast } from '@/components/ui/toaster';
import type { ThesisPercentage } from '@/types/services';
import { Label } from '@/components/ui/label';

interface ThesisAllowanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  percentage: ThesisPercentage;
  existingRequest?: any;
}

export function ThesisAllowanceModal({ isOpen, onClose, percentage, existingRequest }: ThesisAllowanceModalProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const status = existingRequest?.status;
  const adminComment = existingRequest?.adminComment;
  const isResubmit = status === 'Resubmit';

  // Determine initial editing state:
  const [isEditing, setIsEditing] = useState(!existingRequest || isResubmit || status === 'Pending');

  // File States
  const [abstract, setAbstract] = useState<File | null>(null);
  const [approvalSheet, setApprovalSheet] = useState<File | null>(null);
  const [manuscript, setManuscript] = useState<File | null>(null);

  const { uploadFile } = useFileUpload('thesis-allowance');

  useEffect(() => {
    if (!isOpen) {
      setAbstract(null);
      setApprovalSheet(null);
      setManuscript(null);
      setIsConfirmed(false);
    }
  }, [isOpen]);

  const requiresPartialDocs = percentage === 90 || percentage === 100;
  const requiresFinalDocs = percentage === 10 || percentage === 100;

  const handleSubmit = async () => {
    if (!isConfirmed) {
      toast.error('Please confirm that your documents are correct.');
      return;
    }

    // Minimal Validation for demo
    if (requiresPartialDocs && !abstract && !existingRequest) {
        toast.error('Please upload your Thesis Abstract.');
        return;
    }
    
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(isResubmit ? 'Resubmission successful!' : 'Application submitted successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to submit application.');
    } finally {
      setIsLoading(false);
    }
  };

  const showAdminAlert = existingRequest && (status === 'Resubmit' || status === 'Approved');

  // Helper to render file input OR read-only display
  const renderFileField = (
    label: string, 
    description: string, 
    fileState: File | null, 
    setFileState: (f: File | null) => void,
    existingFileKey?: string // Key to find file info in existingRequest object (e.g., 'abstractFile')
  ) => {
    if (!isEditing && existingRequest) {
       // Fallback mock names if real file objects aren't in the mock data yet
       const fileName = existingRequest[existingFileKey || '']?.name || `${label}.pdf`; 
       const fileUrl = existingRequest[existingFileKey || '']?.url || '#';

       return (
         <div className="space-y-2">
            <FileDisplayReadOnly 
              label={label}
              fileName={fileName}
              fileUrl={fileUrl}
            />
         </div>
       );
    }

    // Otherwise show standard Upload
    return (
      <div className="space-y-2">
        <Label className="text-base font-semibold text-gray-800">
            {label} <span className="text-red-500">*</span>
        </Label>
        <p className="text-sm text-gray-500 mb-2">{description}</p>
        <FileUpload 
            value={fileState}
            onChange={setFileState}
            accept=".pdf"
            disabled={!isEditing}
        />
      </div>
    );
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent size="3xl">
        <ModalHeader>
          <ModalTitle>
            {existingRequest ? (isEditing ? 'Update Request' : 'View Request') : 'Apply for Thesis Allowance'}
          </ModalTitle>
          <p className="text-sm text-gray-500 font-normal mt-1">
            Type: <span className="font-semibold text-dost-title">{percentage}% Release</span>
          </p>
        </ModalHeader>

        <ModalBody className="max-h-[70vh] overflow-y-auto scrollbar-thin space-y-6">
          
          {showAdminAlert && (
            <AdminCommentAlert 
              status={status}
              comment={adminComment || 'No comment provided.'}
            />
          )}

          <div className="space-y-6">
            {requiresPartialDocs && (
                <>
                    {renderFileField(
                        "One-Page Abstract of Thesis Proposal",
                        "Must include Title, Rationale, Objectives, and Methodology.",
                        abstract,
                        setAbstract,
                        "abstractFile"
                    )}
                    {renderFileField(
                        "Approval Sheet",
                        "Signed by Thesis Adviser and authorized school officials.",
                        approvalSheet,
                        setApprovalSheet,
                        "approvalFile"
                    )}
                </>
            )}

            {requiresFinalDocs && (
                 renderFileField(
                    "Final Thesis Manuscript",
                    "Full PDF format including signatures.",
                    manuscript,
                    setManuscript,
                    "manuscriptFile"
                )
            )}
          </div>

          {isEditing && (
            <div className="pt-4 border-t">
              <Checkbox
                label="I confirm that the uploaded documents are correct, clear, and authentic."
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
              />
            </div>
          )}

          {existingRequest && !isEditing && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase">Current Status</span>
                    <div><StatusBadge status={status} /></div>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase">Date Submitted</span>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        {formatDate(existingRequest.timestamp || existingRequest.dateSubmitted)}
                    </div>
                </div>
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          {isEditing ? (
             <>
              <ModalClose asChild>
                <Button variant="outline" disabled={isLoading}>Cancel</Button>
              </ModalClose>
              <Button 
                onClick={handleSubmit} 
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isResubmit ? 'Submit Corrections' : 'Submit Application'}
              </Button>
             </>
          ) : (
             <>
               <ModalClose asChild>
                 <Button variant="outline">Close</Button>
               </ModalClose>
               {status === 'Pending' && (
                 <Button onClick={() => setIsEditing(true)}>
                   <Edit className="h-4 w-4 mr-2" />
                   Edit Response
                 </Button>
               )}
             </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}