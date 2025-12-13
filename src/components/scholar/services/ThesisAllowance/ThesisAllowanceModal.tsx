'use client';

import { useState, useEffect, useRef } from 'react';
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
import { Edit, Calendar, FileText } from 'lucide-react';
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
import { useCurrentThesis } from '@/hooks/scholar/Thesis Allowance/useCurrentThesis';

interface ThesisAllowanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  percentage: ThesisPercentage;
  existingRequest?: any;
}

export function ThesisAllowanceModal({ isOpen, onClose, percentage, existingRequest }: ThesisAllowanceModalProps) {
  const userStr = typeof window !== 'undefined' ? sessionStorage.getItem('user') : null;
  const user = userStr ? JSON.parse(userStr) : null;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  const [isConfirmed, setIsConfirmed] = useState(false);
  
  // Hooks
  const { submitThesis, loading: isSubmitting, error: submitError, success } = useThesisUpload();
  const { updateThesis, loading: isUpdating } = useUpdateThesis();
  const { uploadDocument } = useCloudinaryUpload(); 
  
  const status = existingRequest?.status;
  const adminComment = existingRequest?.comment;
  const isResubmit = status === 'Resubmit';
  
  const { data: fetchedData, loading: dataLoading } = useCurrentThesis(percentage);

  // State
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // File States
  const [abstract, setAbstract] = useState<File | null>(null);
  const [approvalSheet, setApprovalSheet] = useState<File | null>(null);
  const [manuscript, setManuscript] = useState<File | null>(null);

  // Initialize State on Open
  useEffect(() => {
    if (isOpen) {
      // Logic: If there is no request, OR it is a Resubmit, we enter Edit Mode immediately.
      // If there is a Pending/Approved request, we start in View Mode (isEditing = false).
      const shouldEdit = !existingRequest || isResubmit;
      setIsEditing(shouldEdit);
    } else {
      // Reset on close
      setAbstract(null);
      setApprovalSheet(null);
      setManuscript(null);
      setIsConfirmed(false);
      setIsEditing(false);
    }
  }, [isOpen, fetchedData, isResubmit]);

  useEffect(() => {
    if (submitError) toast.error(submitError);
  }, [submitError]);

  // Logic: 90% and 100% need partial docs; 10% and 100% need final docs.
  const requiresPartialDocs = percentage === '90%' || percentage === '100%';
  const requiresFinalDocs = percentage === '10%' || percentage === '100%';
  
  const isLoading = isSubmitting || isUpdating || isUploading;

  // --- SUBMISSION HANDLER ---
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

    // Validation checks
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

      // 1. Setup keys (Default to keeping existing files)
      let abstractKey = existingRequest?.abstract_thesis_file_key;
      let approvalKey = existingRequest?.approval_file_key;
      let manuscriptKey = existingRequest?.final_thesis_file_key;

      // 2. Helper to Upload
      const handleFileUpload = async (file: File, context: string): Promise<string> => {
        const result = await uploadDocument(file, context);
        if (!result?.key) throw new Error(`Failed to upload ${file.name}`);
        return result.key;
      };

      // 3. Upload ONLY if a new file was selected in the state
      if (abstract) abstractKey = await handleFileUpload(abstract, thesisURL);
      if (approvalSheet) approvalKey = await handleFileUpload(approvalSheet, thesisURL);
      if (manuscript) manuscriptKey = await handleFileUpload(manuscript, thesisURL);

      setIsUploading(false); 

      let currentStatus = 'Pending';
      // 4. Submit to DB
      if (existingRequest && existingRequest.id) {
        if (existingRequest.status === 'Resubmit') currentStatus = 'Resubmit-Pending'
        await updateThesis({
          id: existingRequest.id,
          type: `${percentage}`, 
          abstract_thesis_file_key: abstractKey,
          approval_file_key: approvalKey,
          final_thesis_file_key: manuscriptKey,
          status: currentStatus,
          });
      } else {
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
  console.log("existingRequest: ", existingRequest)
  // --- FIXED RENDER LOGIC ---
  const renderFileField = (
    label: string,
    description: string, 
    fileState: File | null, 
    setFileState: (f: File | null) => void,
    dbKey: string 
  ) => {
    const existingFKUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${existingRequest?.[dbKey]}.pdf`;

    // Helper to determine if this specific field should be editable
    const isFieldEditable = () => {
        // If it's a new request, everything is editable
        if (!existingRequest) return true;
        
        // If the main edit switch is off, nothing is editable
        if (!isEditing) return false;

        // --- NEW LOGIC: Resubmit filtering based on comment ---
        if (isResubmit && adminComment) {
            const lowerComment = adminComment.toLowerCase();
            
            if (dbKey === 'abstract_thesis_file_key') {
                return lowerComment.includes('abstract');
            }
            if (dbKey === 'approval_file_key') {
                return lowerComment.includes('approval');
            }
            if (dbKey === 'final_thesis_file_key') {
                return lowerComment.includes('manuscript') || lowerComment.includes('final');
            }
            
            // If the field isn't mentioned, it remains read-only
            return false;
        }

        // Default behavior for other statuses (e.g. if we allow editing Pending)
        return true;
    };

    const editable = isFieldEditable();

    // CASE 1: READ-ONLY MODE
    // If we are NOT editing, we ONLY show the read-only display.
    if (!editable && existingRequest) {
      return (
        <div className="space-y-2">
            <FileDisplayReadOnly 
              label={label}
              fileName={`${user.spas_id} – ${label}.pdf`} 
              fileUrl={existingFKUrl || "#"} 
            />
        </div>
      );
    }

    // CASE 2: EDIT MODE (Or New Application)
    // We ALWAYS show the FileUpload here.
    return (
      <div className="space-y-2">
        <Label className="text-base font-semibold text-gray-800">
            {label} <span className="text-red-500">*</span>
        </Label>

        {/* The Uploader is always visible in edit mode */}
        <FileUpload 
            value={fileState}
            onChange={setFileState}
            accept=".pdf"
            helperText={description} // Using helperText as per your reference
            disabled={isLoading}
        />
      </div>
    );
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent size="xl">
        <ModalHeader>
          <ModalTitle>
            {existingRequest ? (isEditing ? 'Update Request' : 'View Request') : 'Apply for Thesis Allowance'}
          </ModalTitle>
          <p className="text-sm text-gray-500 font-normal mt-1">
            Type: <span className="font-semibold text-dost-title">{percentage} Release</span>
          </p>
        </ModalHeader>

        <ModalBody>
          
          {showAdminAlert && (
            <AdminCommentAlert 
              status={status}
              comment={adminComment}
            />
          )}

          <div className="space-y-6 mt-4">
            {requiresPartialDocs && (
                <>
                    {renderFileField(
                        "Thesis Proposal Abstract",
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
            <div className="pt-4">
              <Checkbox
                label="I confirm that the uploaded documents are correct, clear, and authentic."
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
              />
            </div>
          )}

          {existingRequest && !isEditing && (
            <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
               {(status === 'Pending' || status === 'Resubmit') && (
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