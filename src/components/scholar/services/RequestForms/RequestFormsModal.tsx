// src/components/scholar/services/RequestForms/RequestFormsModal.tsx
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
import { Calendar, Edit } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatDate } from '@/lib/utils/date';
import { toast } from '@/components/ui/toaster';
import { AdminCommentAlert } from '@/components/shared/AdminCommenAlert';
import { RequestForm } from './RequestForm';
import type { RequestFormType } from '@/types/services';

// Hooks
import { useRequestUpload } from '@/hooks/scholar/Request Forms/useRequestUpload';
import { useRequestUpdate } from '@/hooks/scholar/Request Forms/useRequestUpdate';
import { useCloudinaryUpload } from '@/hooks/scholar/useDocumentUpload';

interface RequestFormsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: RequestFormType;
  existingRequest?: any;
  onSuccess?: () => void; // New Prop
}

export function RequestFormsModal({ isOpen, onClose, type, existingRequest, onSuccess }: RequestFormsModalProps) {
  // Session Access
  const userStr = typeof window !== 'undefined' ? sessionStorage.getItem('user') : null;
  const user = userStr ? JSON.parse(userStr) : null;

  // Hooks
  const { submitRequest, loading: isSubmitting, error: submitError } = useRequestUpload();
  const { updateRequest, loading: isUpdating } = useRequestUpdate();
  const { uploadDocument } = useCloudinaryUpload();

  // Local State
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [file, setFile] = useState<File | null>(null); 
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Status & Logic
  const status = existingRequest?.status;
  const adminComment = existingRequest?.comment;
  const isResubmit = status === 'Resubmit';
  
  // Edit Mode: True if it's a new request OR if it's a resubmission
  const [isEditing, setIsEditing] = useState(false);

  // Initialize Modal State
  useEffect(() => {
    if (isOpen) {
        if (existingRequest) {
            // VIEW/EDIT EXISTING MODE
            setReason(existingRequest.reason || '');
            // setDetails(existingRequest.details || ''); // If applicable
            setIsEditing(isResubmit); // Auto-edit if resubmit, else view only
            setIsConfirmed(false);
            setFile(null); // Reset file input
        } else {
            // NEW REQUEST MODE (Transactional)
            setReason('');
            setDetails('');
            setFile(null);
            setIsConfirmed(false);
            setIsEditing(true); // Always editing for new
        }
    }
  }, [isOpen, existingRequest, isResubmit]);

  // Error Toast
  useEffect(() => {
    if (submitError) toast.error(submitError);
  }, [submitError]);

  const handleSubmit = async () => {
    if (!isConfirmed) {
      toast.error('Please confirm your request.');
      return;
    }
    if (!reason.trim()) {
      toast.error('Brief reason is required.');
      return;
    }
    if (!user?.spas_id) {
        toast.error('User session not found. Please relogin.');
        return;
    }

    try {
      setIsUploading(true);

      // 1. Upload to Cloudinary (if file exists)
      let fileKey = existingRequest?.file_key || null;

      if (file) {
        // Path: dost-portal/{spas_id}/request-forms/{filename}
        const uploadPath = `dost-portal/${user.spas_id}/request-forms`;
        const result = await uploadDocument(file, uploadPath);
        
        if (result?.key) {
            fileKey = result.key;
        } else {
            throw new Error('File upload failed.');
        }
      }

      setIsUploading(false);

      // 2. Submit to Supabase
      if (existingRequest && existingRequest.id) {
          // --- UPDATE EXISTING ---
          let newStatus = status;
          if (isResubmit) newStatus = 'Pending'; // Reset to Pending if it was Resubmit

          await updateRequest({
              id: existingRequest.id,
              reason: reason,
              status: newStatus,
              file_key: fileKey, // Update file key if new file uploaded
          });
          toast.success('Request updated successfully!');
      } else {
          // --- CREATE NEW (Transactional) ---
          await submitRequest({
              spas_id: user.spas_id,
              requested_document: type,
              reason: reason,
              file_key: fileKey,
          });
          toast.success('Request submitted successfully!');
      }

      if (onSuccess) onSuccess();

      onClose();
    } catch (error: any) {
      console.error(error);
      setIsUploading(false);
      toast.error(error.message || 'Submission failed.');
    }
  };

  const isLoading = isSubmitting || isUpdating || isUploading;

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent size="xl">
        <ModalHeader>
          <ModalTitle>
            {existingRequest ? (isEditing ? 'Update Request' : 'View Request') : 'New Request'}
          </ModalTitle>
          <p className="text-sm text-dost-title font-semibold mt-1">
             {type}
          </p>
        </ModalHeader>

        <ModalBody>
          
          {existingRequest && (status === 'Resubmit' || status === 'Approved') && (
             <AdminCommentAlert status={status} comment={adminComment || ''} />
          )}

          <RequestForm 
             type={type}
             reason={reason} setReason={setReason}
             details={details} setDetails={setDetails}
             file={file} setFile={setFile}
             isConfirmed={isConfirmed} setIsConfirmed={setIsConfirmed}
             isReadOnly={!isEditing} 
             // existingFileKey={existingRequest?.file_key} 
          />

          {/* Footer Info (Only in Read-Only View Mode) */}
          {existingRequest && !isEditing && (
             <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex justify-between items-center mt-4">
                 <div>
                     <span className="text-xs font-semibold text-gray-500 uppercase">Status</span>
                     <div className="mt-1"><StatusBadge status={status} /></div>
                 </div>
                 <div className="text-right">
                     <span className="text-xs font-semibold text-gray-500 uppercase">Submitted</span>
                     <div className="flex items-center gap-2 mt-1 text-sm font-medium text-gray-900">
                         <Calendar className="h-4 w-4 text-gray-500" />
                         {formatDate(existingRequest.requested_at)}
                     </div>
                 </div>
             </div>
          )}
        </ModalBody>

        <ModalFooter>
           {isEditing ? (
              /* --- EDIT / NEW MODE FOOTER --- */
              <>
                <ModalClose asChild>
                    <Button variant="outline" disabled={isLoading}>Cancel</Button>
                </ModalClose>
                <Button onClick={handleSubmit} isLoading={isLoading} disabled={isLoading || !isConfirmed}>
                    {isResubmit ? 'Submit Correction' : 'Submit Request'}
                </Button>
              </>
           ) : (
              /* --- READ-ONLY MODE FOOTER --- */
              <>
                 <ModalClose asChild>
                    <Button variant="outline">Close</Button>
                 </ModalClose>
                 
                 {/* Allow editing only if Pending */}
                 {status === 'Pending' && (
                    <Button onClick={() => setIsEditing(true)}>
                       <Edit className="h-4 w-4 mr-2" />
                       Edit Request
                    </Button>
                 )}
              </>
           )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}