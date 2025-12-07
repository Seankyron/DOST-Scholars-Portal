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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Download, MessageSquarePlus, FileText, User, Mail, Building, CheckCircle2 } from 'lucide-react';
import { formatDate } from '@/lib/utils/date';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { toast } from '@/components/ui/toaster';
import { StatusBadge } from '@/components/shared/StatusBadge'; 
import { cn } from '@/lib/utils/cn'; // Assuming you have this utility
import type { RequestFormDetails } from './RequestFormsTable';
import { supabase } from '@/lib/supabase/client';

function InfoItem({ label, value, fullWidth = false }: { label: string; value: React.ReactNode, fullWidth?: boolean }) {
  return (
    <div className={fullWidth ? "col-span-full" : ""}>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <div className="text-sm font-semibold text-gray-800 break-words">
        {value || 'N/A'}
      </div>
    </div>
  );
}

function FileDisplay({
  label,
  fileName,
  needsResubmit = false,
}: {
  label: string;
  fileName?: string;
  needsResubmit?: boolean;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <Label className="text-xs font-medium text-gray-700 truncate" title={label}>{label}</Label>
        {needsResubmit && (
          <span className="text-[10px] font-medium text-red-600 flex-shrink-0 ml-2">To Resubmit</span>
        )}
      </div>
      <div className={cn(
        "flex items-center justify-between p-3 pl-4 border rounded-lg transition-colors",
        needsResubmit ? 'bg-red-50 border-red-200' : 'bg-gray-50'
      )}>
        {fileName ? (
           <>
             <div className="flex items-center gap-2 overflow-hidden">
                <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className={cn("text-sm font-medium truncate", needsResubmit ? 'text-red-700' : 'text-gray-800')} title={fileName}>
                    {fileName}
                </span>
             </div>
             <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
               <Button variant="ghost" size="sm" className="w-7 h-7 p-0 text-gray-500 hover:text-dost-title" title="Download">
                 <Download className="h-4 w-4" />
               </Button>
             </div>
           </>
        ) : (
           <span className="text-sm text-gray-400 italic">No document attached</span>
        )}
      </div>
    </div>
  );
}

const PREBUILT_COMMENTS = [
  { key: 'invalid_doc', text: 'The supporting document provided is incorrect or outdated.', short: 'Invalid File' },
  { key: 'blur', text: 'The document uploaded is blurred or unreadable. Please re-upload a clear copy.', short: 'Blurred File' },
  { key: 'missing_info', text: 'Please provide more specific details regarding the purpose of this request.', short: 'More Details' },
];

interface RequestFormsModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: RequestFormDetails; 
  onUpdate: () => void; 
}

export function RequestFormsModal({
  isOpen,
  onClose,
  request,
  onUpdate
}: RequestFormsModalProps) {
  const { scholarInfo, currentPlacement, requestType, submissionInfo, files } = request;
  
  const [currentStatus, setCurrentStatus] = useState(submissionInfo.status);
  const [adminComment, setAdminComment] = useState(submissionInfo.adminComment || '');
  
  // 1. New State for Admin Decision
  const [deliveryMode, setDeliveryMode] = useState<'Email' | 'Pickup'>('Email');
  
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isResubmitOpen, setIsResubmitOpen] = useState(false);

  useEffect(() => {
    setCurrentStatus(submissionInfo.status);
    setAdminComment(submissionInfo.adminComment || '');
    // Reset delivery mode on open
    setDeliveryMode('Email');
  }, [submissionInfo.status, submissionInfo.adminComment, isOpen]);

  const isActionable = currentStatus === 'Pending' || 'Resubmit-Pending';
  const isEndorsement = requestType === 'Letter of Endorsement';
  const isEmail = deliveryMode === 'Email';

  const handleAddComment = (commentText: string) => {
    setAdminComment((prev) => {
      if (prev.trim() === '') return commentText;
      return `${prev}\n- ${commentText}`;
    });
  };

  // --- SMART RESUBMISSION LOGIC ---
  const comment = (adminComment || '').toLowerCase();
  const hasKeyword = (keywords: string[]) => keywords.some(k => comment.includes(k.toLowerCase()));
  const showFileResubmit = (hasKeyword(['file', 'blur', 'invalid', 'scan']) && currentStatus !== 'Approved' && !!files.supportingDocument);
  const hasResubmitRequest = showFileResubmit || hasKeyword(['resubmit', 'revise']);

  const handleAttemptApprove = () => {
    if (hasResubmitRequest) {
      toast.error("Action Blocked", {
        description: "You cannot approve this request while the comment indicates issues. Please edit the comment."
      });
      return;
    }
    setIsApproveOpen(true);
  };

  const handleApprove = async () => {
    const successMsg = isEmail ? 'Request Approved & Emailed' : 'Request Approved for Pickup';
    
    try{
          let { error: updateError } = await supabase
          .from('Request Forms')
          .update({ status: "Approved", comment: 'Travel Clearance Approved!' })
          .eq('id', parseInt(request.id));
  
          if(updateError) throw new Error(updateError.message);
          
          toast.success(successMsg, { description: `${scholarInfo.name} has been notified.` });
          setCurrentStatus('Approved');
          onUpdate();
          setIsApproveOpen(false);
          onClose();
      }catch(e: any){
          console.error('Update failed:', e);
          toast.error('Update Failed', { description: e.message });
      }
    };

  const handleResubmit = async () => {
    if (adminComment.trim() === '') {
      toast.error('Comment Required', { description: 'Please provide a comment before requesting resubmission.' });
      return;
    }
    try{
        let { error: updateError } = await supabase
        .from('Request Forms')
        .update({ status: "Resubmit", comment: adminComment.trim() })
        .eq('id', parseInt(request.id));

        if(updateError) throw new Error(updateError.message);
        toast.warning('Resubmission Requested', { 
          description: `${scholarInfo.name} has been notified.`,
          className: "bg-yellow-50 border-yellow-200", 
        });
        setCurrentStatus('Resubmit');
        onUpdate();
        setIsResubmitOpen(false);
      }catch(e: any){
          console.error('Update failed:', e);
          toast.error('Update Failed', { description: e.message });
      }
        

  };

  // Dynamic Text for Dialog
  const approveTitle = isEmail ? "Approve & Send Email" : "Approve for Pickup";
  const approveDesc = isEmail 
     ? `Are you sure you want to approve this request? A digital copy will be automatically sent to ${scholarInfo.email}.`
     : `Are you sure you want to approve this request? ${scholarInfo.name} will be notified to pick up the document at the DOST Office.`;

  return (
    <>
      <Modal open={isOpen} onOpenChange={onClose}>
        <ModalContent size="3xl">
          <ModalHeader>
             <div className="flex items-center justify-between w-full pr-8">
                <div className="flex flex-col">
                   <ModalTitle>Request Details</ModalTitle>
                   <p className="text-sm text-gray-500 font-normal mt-1">{requestType}</p>
                </div>  
             </div>
          </ModalHeader>

          <ModalBody className="p-6 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              
              {/* LEFT COLUMN */}
              <div className="flex flex-col gap-6 h-full">
                {/* 1. Scholar Information */}
                <section className="bg-white border rounded-lg shadow-sm p-5 space-y-3">
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2 flex items-center gap-2">
                    <User className="h-4 w-4" /> Scholar Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InfoItem label="Name" value={scholarInfo.name} />
                    <InfoItem label="SPAS ID" value={request.spas_id} />
                    <InfoItem label="Email" value={scholarInfo.email} />
                    <InfoItem label="Contact Number" value={scholarInfo.contactNumber} />
                  </div>
                </section>

                {/* 2. Request Specifics */}
                <section className="bg-white border rounded-lg shadow-sm p-5 space-y-3 flex-1 flex flex-col">
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Request Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InfoItem label="Date Submitted" value={formatDate(submissionInfo.dateSubmitted)} />
                    <InfoItem label="Current Status" value={<StatusBadge status={currentStatus} className="mt-1"/>} />
                  </div>

                  {isEndorsement && submissionInfo.details && (
                     <div className="mt-2 pt-2 border-t border-gray-100">
                        <InfoItem label="Addressee / Details" value={submissionInfo.details} fullWidth />
                     </div>
                  )}
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                     <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Purpose / Brief Reason</p>
                     <div className="bg-gray-50 border border-gray-100 p-3 rounded-md">
                        <p className="font-normal italic text-gray-700 text-sm">{submissionInfo.reason}</p>
                     </div>
                  </div>
                </section>
              </div>

              {/* RIGHT COLUMN */}
              <div className="flex flex-col gap-6 h-full">
                <section className="bg-white border rounded-lg shadow-sm p-5 space-y-3">
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Academic Placement
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InfoItem label="Scholarship Type" value={currentPlacement.scholarshipType} />
                    <InfoItem label="Batch" value={currentPlacement.batch} />
                    <InfoItem label="University" value={currentPlacement.university} />
                    <InfoItem label="Program" value={currentPlacement.program} />
                 </div>
                </section>

                <section className="bg-white border rounded-lg shadow-sm p-5 space-y-3 flex-1">
                  <h2 className="text-lg font-semibold text-dost-title border-b pb-2">
                    Supporting Documents
                  </h2>
                  <div className="flex flex-col gap-3">
                    <FileDisplay
                        label="Uploaded Attachment"
                        fileName={files.supportingDocument}
                        needsResubmit={showFileResubmit}
                    />
                  </div>
                </section>
              </div>
            </div>

            <section className="bg-white border rounded-lg shadow-sm p-5">
               <div className="space-y-4">
                  
                  {/* IMPROVED DELIVERY MODE SELECTOR */}
                  {isActionable && (
                    <div>
                        <Label className="block text-xs font-semibold text-gray-500 uppercase mb-3">
                            Set Delivery Mode
                        </Label>
                        <RadioGroup 
                            value={deliveryMode} 
                            onValueChange={(v) => setDeliveryMode(v as 'Email' | 'Pickup')}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        >
                            {/* EMAIL OPTION */}
                            <div 
                                onClick={() => setDeliveryMode('Email')}
                                className={cn(
                                    "relative flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md",
                                    isEmail 
                                      ? "bg-blue-50/50 border-blue-500 ring-1 ring-blue-500" 
                                      : "bg-white border-gray-100 hover:border-blue-200"
                                )}
                            >
                                <div className={cn(
                                    "flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center mt-0.5 transition-colors",
                                    isEmail ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"
                                )}>
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="r-email" className="font-bold text-gray-900 cursor-pointer">
                                            Send via Email
                                        </Label>
                                        <RadioGroupItem value="Email" id="r-email" className="sr-only" />
                                        {isEmail && <CheckCircle2 className="h-5 w-5 text-blue-600" />}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                        The document will be sent directly to the scholar&apos;s registered email address.
                                    </p>
                                </div>
                            </div>

                            {/* PICKUP OPTION */}
                            <div 
                                onClick={() => setDeliveryMode('Pickup')}
                                className={cn(
                                    "relative flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md",
                                    !isEmail 
                                      ? "bg-orange-50/50 border-orange-500 ring-1 ring-orange-500" 
                                      : "bg-white border-gray-100 hover:border-orange-200"
                                )}
                            >
                                <div className={cn(
                                    "flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center mt-0.5 transition-colors",
                                    !isEmail ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-400"
                                )}>
                                    <Building className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="r-pickup" className="font-bold text-gray-900 cursor-pointer">
                                            For Pick Up
                                        </Label>
                                        <RadioGroupItem value="Pickup" id="r-pickup" className="sr-only" />
                                        {!isEmail && <CheckCircle2 className="h-5 w-5 text-orange-600" />}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                        The scholar will be notified to physically claim the document at the DOST Office.
                                    </p>
                                </div>
                            </div>
                        </RadioGroup>
                    </div>
                  )}

                  <div className="space-y-2 pt-2">
                    <Label htmlFor="admin-comment" className="block text-sm font-medium text-gray-700">
                        Admin Comments
                    </Label>
                    {isActionable ? (
                        <>
                        <Textarea
                            id="admin-comment"
                            placeholder="Add comments, instructions for resubmission..."
                            className="min-h-[100px]"
                            value={adminComment}
                            onChange={(e) => setAdminComment(e.target.value)}
                        />
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {PREBUILT_COMMENTS.map((c) => (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                key={c.key}
                                onClick={() => handleAddComment(c.text)}
                                className="text-xs h-auto py-1 px-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                            >
                                <MessageSquarePlus className="h-3 w-3 mr-1.5" />
                                {c.short}
                            </Button>
                            ))}
                        </div>
                        </>
                    ) : (
                        <div className="p-3 bg-gray-50 border rounded-md min-h-[60px] text-sm text-gray-600 whitespace-pre-line">
                        {adminComment || <span className="text-gray-400 italic">No comments provided.</span>}
                        </div>
                    )}
                  </div>
               </div>
            </section>
          </ModalBody>

          <ModalFooter>
            <ModalClose asChild>
              <Button type="button" variant="outline">
                {isActionable ? 'Cancel' : 'Close'}
              </Button>
            </ModalClose>
            {isActionable && (
              <>
                <Button
                  type="button"
                  variant="primary"
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => setIsResubmitOpen(true)}
                >
                  REQUEST RESUBMISSION
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleAttemptApprove}
                >
                  {isEmail ? 'APPROVE & EMAIL' : 'APPROVE FOR PICKUP'}
                </Button>
              </>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      <ConfirmDialog
        isOpen={isApproveOpen}
        onClose={() => setIsApproveOpen(false)}
        onConfirm={handleApprove}
        title={approveTitle}
        description={approveDesc}
        variant="info"
        confirmText={isEmail ? "Yes, send email" : "Yes, approve"}
      />
      
      <ConfirmDialog
        isOpen={isResubmitOpen}
        onClose={() => setIsResubmitOpen(false)}
        onConfirm={handleResubmit}
        title="Request Resubmission"
        description={`Are you sure you want to request resubmission from ${scholarInfo.name}? Ensure the comments are clear.`}
        variant="danger"
        confirmText="Yes, request resubmission"
      />
    </>
  );    
}