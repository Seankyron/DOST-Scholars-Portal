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
import { FileUpload } from '@/components/ui/file-upload';
import { FileDisplayReadOnly } from '@/components/shared/FileDisplayReadOnly'; 
import { toast } from '@/components/ui/toaster';
import { Label } from '@/components/ui/label';

// Import Custom Hooks
import { useThesisUpload } from '@/hooks/scholar/Thesis Allowance/useThesisUpload';
import { useUpdateThesis } from '@/hooks/scholar/Thesis Allowance/useThesisUpdate';
import { useCloudinaryUpload } from '@/hooks/scholar/useDocumentUpload';
import type { ThesisPercentage } from './ThesisAllowancePanel';

interface ThesisAllowanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  percentage: ThesisPercentage;
  existingRequest?: any;
}

export function ThesisAllowanceModal({ isOpen, onClose, percentage, existingRequest }: ThesisAllowanceModalProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  
  // Hooks for DB actions
  const { submitThesis, loading: isSubmitting } = useThesisUpload();
  const { updateThesis, loading: isUpdating } = useUpdateThesis();
  
  const status = existingRequest?.status;
  const adminComment = existingRequest?.comment;
  const isResubmit = status === 'Resubmit';

  // Determine initial editing state:
  const [isEditing, setIsEditing] = useState(!existingRequest || isResubmit || status === 'Pending');

  // File States
  const [abstract, setAbstract] = useState<File | null>(null);
  const [approvalSheet, setApprovalSheet] = useState<File | null>(null);
  const [manuscript, setManuscript] = useState<File | null>(null);

  // Hook for file storage
  // Note: useCloudinaryUpload only returns uploadDocument, so we manage isUploading locally
  const { uploadDocument } = useCloudinaryUpload(); 
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setAbstract(null);
      setApprovalSheet(null);
      setManuscript(null);
      setIsConfirmed(false);
      setIsEditing(!existingRequest || isResubmit || status === 'Pending');
    }
  }, [isOpen, existingRequest, isResubmit, status]);

  // Fix: Check against numbers (90, 100) instead of strings ('90%') to match Type definition
  const requiresPartialDocs = percentage === '90%' || percentage === '100%';
  const requiresFinalDocs = percentage === '10%' || percentage === '100%';
  
  const isLoading = isSubmitting || isUpdating || isUploading;

  const handleSubmit = async () => {
    if (!isConfirmed) {
      toast.error('Please confirm that your documents are correct.');
      return;
    }

    const userString = sessionStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    
    if (!user?.spas_id) {
        toast.error("User session not found. Please relogin.");
        return;
    }

    const thesisURL = `dost-portal/${user.spas_id}/thesis-allowance`;

    // Validation
    if (requiresPartialDocs && !abstract && !existingRequest?.abstract_thesis_file_key) {
        toast.error('Please upload your Thesis Abstract.');
        return;
    }
    if (requiresPartialDocs && !approvalSheet && !existingRequest?.approval_file_key) {
        toast.error('Please upload your Approval Sheet.');
        return;
    }
    if (requiresFinalDocs && !manuscript && !existingRequest?.final_thesis_file_key) {
        toast.error('Please upload your Final Manuscript.');
        return;
    }
    
    try {
      setIsUploading(true);

      // 1. Upload new files to Storage bucket
      let abstractKey = existingRequest?.abstract_thesis_file_key;
      let approvalKey = existingRequest?.approval_file_key;
      let manuscriptKey = existingRequest?.final_thesis_file_key;

      // Helper to handle upload and extract URL
      const handleFileUpload = async (file: File, context: string): Promise<string> => {
        const result = await uploadDocument(file, context);
        if (!result?.key) throw new Error(`Failed to upload ${file.name}`);
        return result.key;
      };

      if (abstract) {
         const url = await handleFileUpload(abstract, thesisURL);
         if (url) abstractKey = url;
      }
      if (approvalSheet) {
         const url = await handleFileUpload(approvalSheet, thesisURL);
         if (url) approvalKey = url;
      }
      if (manuscript) {
         const url = await handleFileUpload(manuscript, thesisURL);
         if (url) manuscriptKey = url;
      }

      setIsUploading(false); // Done uploading

      // 2. Submit to Database
      if (existingRequest && existingRequest.id) {
          // UPDATE Existing
          await updateThesis({
              id: existingRequest.id,
              type: `${percentage}`, 
              abstract_thesis_file_key: abstractKey,
              approval_file_key: approvalKey,
              final_thesis_file_key: manuscriptKey,
          });
      } else {
          // CREATE New
          await submitThesis({
              spas_id: user.spas_id,
              type: `${percentage}`,
              abstract_thesis_file_key: abstractKey,
              approval_file_key: approvalKey,
              final_thesis_file_key: manuscriptKey,
          });
      }

      toast.success(isResubmit ? 'Resubmission successful!' : 'Application submitted successfully!');
      onClose();
    } catch (error: any) {
      console.error(error);
      setIsUploading(false);
      toast.error(error.message || 'Failed to submit application.');
    }
  };

  const showAdminAlert = existingRequest && (status === 'Resubmit' || status === 'Approved');

  // Helper to render file input OR read-only display
  const renderFileField = (
    label: string, 
    description: string, 
    fileState: File | null, 
    setFileState: (f: File | null) => void,
    dbKey: string 
  ) => {
    const existingPath = existingRequest?.[dbKey];
    
    if (!isEditing && existingRequest) {
       return (
         <div className="space-y-2">
            <FileDisplayReadOnly 
              label={label}
              fileName={existingPath ? "View Uploaded File" : "No file"} 
              fileUrl={existingPath} 
            />
         </div>
       );
    }

    return (
      <div className="space-y-2">
        <Label className="text-base font-semibold text-gray-800">
            {label} <span className="text-red-500">*</span>
        </Label>
        <p className="text-sm text-gray-500 mb-2">{description}</p>
        
        {isEditing && existingPath && !fileState && (
            <div className="mb-2 p-2 bg-blue-50 text-xs text-blue-700 rounded border border-blue-200">
                Current file: <a href={existingPath} target="_blank" className="underline">View Current</a> (Upload below to replace)
            </div>
        )}

        <FileUpload 
            value={fileState}
            onChange={setFileState}
            accept=".pdf"
            disabled={!isEditing || isLoading}
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
                        "abstract_thesis_file_key"
                    )}
                    {renderFileField(
                        "Approval Sheet",
                        "Signed by Thesis Adviser and authorized school officials.",
                        approvalSheet,
                        setApprovalSheet,
                        "approval_file_key"
                    )}
                </>
            )}

            {requiresFinalDocs && (
                 renderFileField(
                    "Final Thesis Manuscript",
                    "Full PDF format including signatures.",
                    manuscript,
                    setManuscript,
                    "final_thesis_file_key"
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
                        {formatDate(existingRequest.created_at)}
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
                disabled={isLoading || !isConfirmed}
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